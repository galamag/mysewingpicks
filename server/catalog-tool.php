<?php
/**
 * catalog-tool.php — My Sewing Picks
 * ---------------------------------------------------------------------
 * Working tool (not part of the site): look products up in the Amazon
 * Creators API to pick products the API can show images for.
 *
 *   php ~/mysewingpicks-api/catalog-tool.php search "polyester batting" [SearchIndex]
 *       → up to 10 products: ASIN | image | brand | title
 *         (SearchItems only returns items the API can serve)
 *   php ~/mysewingpicks-api/catalog-tool.php check B0XXXXXXXX [B0YYYYYYYY ...]
 *       → for each ASIN: is it accessible, does it have an image
 *
 * Uses the same config.php as refresh-images.php. Prints product data only —
 * never secrets or tokens. Results are for choosing products; they are not
 * stored or shown on the site. Compatible with PHP 7.4+.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

const API_BASE = 'https://creatorsapi.amazon/catalog/v1/';
const RESOURCES = ['images.primary.large', 'itemInfo.title', 'itemInfo.byLineInfo'];

function out($line) { echo $line, "\n"; }
function fail($message) { out('ERROR: ' . $message); exit(1); }

/** Trim text to $width characters (mbstring if available). */
function short($text, $width)
{
    $text = (string) $text;
    if (function_exists('mb_strimwidth')) {
        return mb_strimwidth($text, 0, $width, '…');
    }
    return strlen($text) > $width ? substr($text, 0, $width - 3) . '...' : $text;
}

/** First existing key from $keys (the API's field casing is not guaranteed). */
function pick($array, array $keys)
{
    if (!is_array($array)) {
        return null;
    }
    foreach ($keys as $key) {
        if (array_key_exists($key, $array)) {
            return $array[$key];
        }
    }
    return null;
}

/** POST JSON, return [httpStatus, decodedBody|null, rawBodyOrCurlError]. */
function postJson($url, array $headers, array $body)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($body),
        CURLOPT_HTTPHEADER     => array_merge(['Content-Type: application/json', 'Accept: application/json'], $headers),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
    ]);
    $raw    = curl_exec($ch);
    $error  = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($raw === false) {
        return [0, null, $error];
    }
    return [$status, json_decode($raw, true), $raw];
}

/** Short, secret-free description of an error response. */
function describeError($status, $data, $raw)
{
    $first = pick(pick($data, ['errors', 'Errors']), [0]);
    $code  = pick($first, ['code', 'Code']) ?: pick($data, ['error', 'code']);
    $text  = pick($first, ['message', 'Message']) ?: pick($data, ['error_description', 'message']);
    if ($code || $text) {
        return "HTTP $status " . trim("$code $text");
    }
    return "HTTP $status " . substr(preg_replace('/\s+/', ' ', (string) $raw), 0, 300);
}

/** "ASIN | image | brand | title" for one item from the API response. */
function describeItem($item)
{
    $asin  = pick($item, ['asin', 'ASIN']);
    $image = pick(pick(pick($item, ['images', 'Images']), ['primary', 'Primary']), ['large', 'Large']);
    $info  = pick($item, ['itemInfo', 'ItemInfo']);
    $title = pick(pick($info, ['title', 'Title']), ['displayValue', 'DisplayValue']);
    $brand = pick(pick(pick($info, ['byLineInfo', 'ByLineInfo']), ['brand', 'Brand']), ['displayValue', 'DisplayValue']);
    $img   = is_array($image) && pick($image, ['url', 'URL'])
        ? 'image ' . (int) pick($image, ['width', 'Width']) . 'x' . (int) pick($image, ['height', 'Height'])
        : 'NO IMAGE';
    return sprintf('%-10s | %-13s | %-18s | %s', $asin, $img, short($brand ?: '—', 18), short($title, 110));
}

// ---------------------------------------------------------------- args

$command = isset($argv[1]) ? $argv[1] : '';
if ($command === 'search' && isset($argv[2]) && trim($argv[2]) !== '') {
    $keywords    = trim($argv[2]);
    $searchIndex = isset($argv[3]) ? $argv[3] : 'All';
} elseif ($command === 'check' && count($argv) > 2) {
    $asins = array_values(array_filter(array_slice($argv, 2), function ($a) {
        return preg_match('/^[A-Z0-9]{10}$/', $a);
    }));
    if (!$asins || count($asins) > 10) {
        fail('check takes 1–10 ASINs (10 characters, A–Z / 0–9).');
    }
} else {
    out('Usage:');
    out('  php catalog-tool.php search "keywords" [SearchIndex]');
    out('  php catalog-tool.php check ASIN [ASIN ...]   (up to 10)');
    exit(1);
}

// ---------------------------------------------------------------- config + token

if (!function_exists('curl_init')) {
    fail('PHP curl extension is not available.');
}
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    fail('config.php not found next to this script.');
}
$config = require $configFile;
if (!is_array($config) || empty($config['client_id']) || empty($config['client_secret']) || empty($config['partner_tag'])) {
    fail('config.php is incomplete (client_id, client_secret, partner_tag).');
}
$marketplace = isset($config['marketplace']) ? $config['marketplace'] : 'www.amazon.com';
$tokenUrl    = isset($config['token_url']) ? $config['token_url'] : 'https://api.amazon.com/auth/o2/token';

list($status, $data, $raw) = postJson($tokenUrl, [], [
    'grant_type'    => 'client_credentials',
    'client_id'     => $config['client_id'],
    'client_secret' => $config['client_secret'],
    'scope'         => 'creatorsapi::default',
]);
$token = pick($data, ['access_token']);
if ($status !== 200 || !$token) {
    fail('Token request failed: ' . describeError($status, $data, $raw));
}
$headers = ['Authorization: Bearer ' . $token, 'x-marketplace: ' . $marketplace];

// ---------------------------------------------------------------- run

if ($command === 'search') {
    list($status, $data, $raw) = postJson(API_BASE . 'searchItems', $headers, [
        'keywords'    => $keywords,
        'searchIndex' => $searchIndex,
        'itemCount'   => 10,
        'marketplace' => $marketplace,
        'partnerTag'  => $config['partner_tag'],
        'resources'   => RESOURCES,
    ]);
    if ($status !== 200) {
        fail('SearchItems failed: ' . describeError($status, $data, $raw));
    }
    $result = pick($data, ['searchResult', 'SearchResult']);
    $items  = (array) pick($result, ['items', 'Items']);
    out('Search: "' . $keywords . '" in ' . $searchIndex . ' — ' . count($items) . ' results'
        . ' (of ' . (int) pick($result, ['totalResultCount', 'TotalResultCount']) . ')');
    foreach ($items as $item) {
        out(describeItem($item));
    }
    if (!$items && is_array($data)) {
        out('Response top-level keys: ' . implode(', ', array_keys($data)));
    }
} else {
    list($status, $data, $raw) = postJson(API_BASE . 'getItems', $headers, [
        'itemIds'     => $asins,
        'itemIdType'  => 'ASIN',
        'marketplace' => $marketplace,
        'partnerTag'  => $config['partner_tag'],
        'resources'   => RESOURCES,
    ]);
    foreach ((array) pick($data, ['errors', 'Errors']) as $error) {
        out('NOT ACCESSIBLE: ' . trim(pick($error, ['code', 'Code']) . ' ' . pick($error, ['message', 'Message'])));
    }
    if ($status !== 200) {
        fail('GetItems failed: ' . describeError($status, $data, $raw));
    }
    foreach ((array) pick(pick($data, ['itemsResult', 'ItemsResult']), ['items', 'Items']) as $item) {
        out(describeItem($item));
    }
}
