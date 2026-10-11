<?php
/**
 * refresh-images.php — My Sewing Picks
 * ---------------------------------------------------------------------
 * Fetches product image URLs from the Amazon Creators API and writes
 * public_html/catalog/images.json. The site's product cards read that file
 * and show the Amazon image (see src/components/ProductCard.astro).
 *
 * Amazon rules this script follows:
 *   - images are NEVER downloaded — only their Amazon URLs are stored;
 *   - an image link may be kept at most 24 h → cron runs every 12 h, and if a
 *     run fails, an images.json older than 24 h is deleted (the site then
 *     falls back to placeholders).
 *
 * Deployed by .cpanel.yml to ~/mysewingpicks-api/ (OUTSIDE public_html).
 * Needs config.php next to it: copy config.example.php and fill it in.
 * config.php holds the API secret — it is never committed to git.
 *
 * Run (cron or SSH):  php ~/mysewingpicks-api/refresh-images.php
 * Writes a short log to last-run.log. Never prints secrets or tokens.
 * Compatible with PHP 7.4+.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

const MAX_AGE_SECONDS = 86400;   // Amazon: image links may be kept up to 24 h
const BATCH_SIZE      = 10;      // GetItems accepts up to 10 ASINs per call
const GET_ITEMS_URL   = 'https://creatorsapi.amazon/catalog/v1/getItems';
const IMAGE_RESOURCE  = 'images.primary.large';

$logLines = [];
$outFile  = null;

function logLine($message)
{
    global $logLines;
    $line = gmdate('Y-m-d H:i:s') . ' UTC  ' . $message;
    $logLines[] = $line;
    echo $line, "\n";
}

function finish($exitCode)
{
    global $logLines;
    @file_put_contents(__DIR__ . '/last-run.log', implode("\n", $logLines) . "\n");
    exit($exitCode);
}

/** Delete images.json if it is older than 24 h (Amazon storage limit). */
function dropStaleImages()
{
    global $outFile;
    if ($outFile && is_file($outFile) && filemtime($outFile) < time() - MAX_AGE_SECONDS) {
        @unlink($outFile);
        logLine('Deleted stale images.json (older than 24 h) — site shows placeholders.');
    }
}

function fail($message)
{
    logLine('ERROR: ' . $message);
    dropStaleImages();
    finish(1);
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

// ---------------------------------------------------------------- config

if (!function_exists('curl_init')) {
    fail('PHP curl extension is not available.');
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    fail('config.php not found — copy config.example.php to config.php and fill it in.');
}
$config = require $configFile;
if (!is_array($config)) {
    fail('config.php must return an array (see config.example.php).');
}

foreach (['client_id', 'client_secret', 'partner_tag'] as $key) {
    if (empty($config[$key]) || strpos($config[$key], 'PASTE_') === 0) {
        fail("config.php: '$key' is not filled in.");
    }
}
$marketplace = isset($config['marketplace']) ? $config['marketplace'] : 'www.amazon.com';
$tokenUrl    = isset($config['token_url']) ? $config['token_url'] : 'https://api.amazon.com/auth/o2/token';
$publicDir   = rtrim(isset($config['public_dir']) ? $config['public_dir'] : dirname(__DIR__) . '/public_html', '/');

$catalogDir = $publicDir . '/catalog';
$outFile    = $catalogDir . '/images.json';

// ---------------------------------------------------------------- ASINs

$asinsFile = $catalogDir . '/asins.json';
if (!is_file($asinsFile)) {
    fail("$asinsFile not found — deploy the site first (git push live main).");
}
$asinsData = json_decode((string) file_get_contents($asinsFile), true);
$asins = array_values(array_unique(array_filter(
    (array) pick($asinsData, ['asins']),
    function ($a) { return is_string($a) && preg_match('/^[A-Z0-9]{10}$/', $a); }
)));
if (!$asins) {
    fail('asins.json has no valid ASINs.');
}
logLine('ASINs to refresh: ' . count($asins));

// ---------------------------------------------------------------- token

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
logLine('Access token received.');

// ---------------------------------------------------------------- images

$images      = [];
$batchErrors = 0;
$lastData    = null;
$batches     = array_chunk($asins, BATCH_SIZE);

foreach ($batches as $i => $batch) {
    if ($i > 0) {
        sleep(1); // new credentials start at about 1 request per second
    }
    list($status, $data, $raw) = postJson(GET_ITEMS_URL, [
        'Authorization: Bearer ' . $token,
        'x-marketplace: ' . $marketplace,
    ], [
        'itemIds'     => $batch,
        'itemIdType'  => 'ASIN',
        'marketplace' => $marketplace,
        'partnerTag'  => $config['partner_tag'],
        'resources'   => [IMAGE_RESOURCE],
    ]);

    // Per-item errors (e.g. an ASIN no longer available) can come with HTTP 200.
    foreach ((array) pick($data, ['errors', 'Errors']) as $error) {
        logLine('API note: ' . trim(pick($error, ['code', 'Code']) . ' ' . pick($error, ['message', 'Message'])));
    }
    if ($status !== 200) {
        $batchErrors++;
        logLine('GetItems failed: ' . describeError($status, $data, $raw));
        continue;
    }

    $lastData = $data;
    $items = (array) pick(pick($data, ['itemsResult', 'ItemsResult']), ['items', 'Items']);
    foreach ($items as $item) {
        $asin    = pick($item, ['asin', 'ASIN']);
        $primary = pick(pick($item, ['images', 'Images']), ['primary', 'Primary']);
        $image   = pick($primary, ['large', 'Large']) ?: pick($primary, ['medium', 'Medium']);
        $url     = pick($image, ['url', 'URL']);
        if ($asin && is_string($url) && strpos($url, 'https://') === 0) {
            $images[$asin] = [
                'url'    => $url,
                'width'  => (int) pick($image, ['width', 'Width']),
                'height' => (int) pick($image, ['height', 'Height']),
            ];
        }
    }
}

if (!$images) {
    if (is_array($lastData)) {
        // Response shape differs from what we parse — show its structure (no secrets in it).
        logLine('Response top-level keys: ' . implode(', ', array_keys($lastData)));
    }
    fail($batchErrors ? 'No images received (all requests failed).' : 'No images in the API response.');
}
$missing = array_diff($asins, array_keys($images));
if ($missing) {
    logLine('No image for: ' . implode(', ', $missing) . ' (placeholder stays for these).');
}

// ---------------------------------------------------------------- write

$json = json_encode([
    'generatedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    'marketplace' => $marketplace,
    'items'       => $images,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

$tmpFile = $outFile . '.tmp';
if (file_put_contents($tmpFile, $json) === false || !rename($tmpFile, $outFile)) {
    fail("Cannot write $outFile");
}
@chmod($outFile, 0644);

logLine('OK: ' . count($images) . ' of ' . count($asins) . ' images written to catalog/images.json');
finish(0);
