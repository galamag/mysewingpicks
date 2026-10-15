<?php
/*
  fill-legal.php — puts the site owner's name, address, e-mail (and phone, if given) into the Legal
  notice pages (public_html/<lang>/legal.html: de, es, fr) at deploy. Run by .cpanel.yml right after
  dist/ is copied: every deploy copies the pages WITH placeholders again, so this must run every time.
  The data live ONLY on the server — ~/mysewingpicks-api/legal.php (see legal.example.php) — never in git,
  and never in the deploy log: no message below prints a value from legal.php (key names and line numbers only).
    php fill-legal.php <public_html> <legal.php>    self-test, then fill (exit 1: data or pages missing, test failed)
    php fill-legal.php --self-test                 only the self-test
  PHP 7.0+.
*/

function legal_escape($s) {
  return htmlspecialchars(trim($s), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function legal_fill($html, array $data) {
  $lines = preg_split('/\R/u', trim($data['address']));
  $map = array(
    '%%LEGAL_NAME%%' => legal_escape($data['name']),
    '%%LEGAL_ADDRESS%%' => implode('<br>', array_map('legal_escape', $lines)),
    '%%LEGAL_EMAIL%%' => legal_escape($data['email']),
  );
  $phone = isset($data['phone']) ? trim((string) $data['phone']) : '';
  if ($phone === '') {
    $html = preg_replace('#<p data-legal="phone">[\s\S]*?</p>#', '', $html);
  } else {
    $map['%%LEGAL_PHONE%%'] = legal_escape($phone);
  }
  return strtr($html, $map);
}

function legal_data_error($data) {
  if (!is_array($data)) return 'legal.php must return an array';
  foreach (array('name', 'address', 'email') as $k) {
    if (!isset($data[$k]) || !is_string($data[$k]) || trim($data[$k]) === '') return "legal.php has no '$k'";
  }
  // Invalid UTF-8 would silently become an empty string (htmlspecialchars) or false (preg_split //u) — refuse it.
  foreach (array('name', 'address', 'email', 'phone') as $k) {
    if (isset($data[$k]) && is_string($data[$k]) && $data[$k] !== '' && !preg_match('//u', $data[$k])) {
      return "legal.php: '$k' is not UTF-8 — save the file as UTF-8";
    }
  }
  if (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) return 'legal.php: email is not an e-mail address';
  return null;
}

function legal_self_test() {
  $page = '<p>%%LEGAL_NAME%%<br />%%LEGAL_ADDRESS%%</p><p>E: <a href="mailto:%%LEGAL_EMAIL%%">%%LEGAL_EMAIL%%</a></p><p data-legal="phone">T: %%LEGAL_PHONE%%</p>';
  $data = array('name' => ' Ä & <b>"O\'Neil"</b> ', 'address' => "Straße 1/2\r\n12345 Stadt", 'email' => 'a.b@example.com');
  $cases = array(
    'no phone' => array(legal_fill($page, $data),
      '<p>Ä &amp; &lt;b&gt;&quot;O&apos;Neil&quot;&lt;/b&gt;<br />Straße 1/2<br>12345 Stadt</p><p>E: <a href="mailto:a.b@example.com">a.b@example.com</a></p>'),
    'phone' => array(legal_fill($page, $data + array('phone' => '+00 000 000 0000')),
      '<p>Ä &amp; &lt;b&gt;&quot;O&apos;Neil&quot;&lt;/b&gt;<br />Straße 1/2<br>12345 Stadt</p><p>E: <a href="mailto:a.b@example.com">a.b@example.com</a></p><p data-legal="phone">T: +00 000 000 0000</p>'),
  );
  $ok = true;
  foreach ($cases as $name => $c) {
    if ($c[0] !== $c[1]) { fwrite(STDERR, "fill-legal self-test '$name' failed:\n  got  {$c[0]}\n  want {$c[1]}\n"); $ok = false; }
  }
  if (legal_data_error(array('name' => 'X', 'address' => 'Y')) === null) { fwrite(STDERR, "fill-legal self-test: missing e-mail not caught\n"); $ok = false; }
  if (legal_data_error($data) !== null) { fwrite(STDERR, "fill-legal self-test: good data rejected\n"); $ok = false; }
  foreach (array('name', 'address', 'email', 'phone') as $k) {   // "\xC4" alone is not valid UTF-8 (e.g. a file saved as Latin-1)
    if (legal_data_error(array($k => "\xC4") + $data) === null) { fwrite(STDERR, "fill-legal self-test: non-UTF-8 '$k' not caught\n"); $ok = false; }
  }
  if ($ok) echo "fill-legal: self-test ok\n";
  return $ok;
}

$arg = isset($argv[1]) ? $argv[1] : '';
if ($arg === '--self-test') exit(legal_self_test() ? 0 : 1);
$root = rtrim($arg, '/');
$file = isset($argv[2]) ? $argv[2] : '';
if ($root === '' || !is_dir($root) || $file === '') { fwrite(STDERR, "usage: php fill-legal.php <public_html> <legal.php> | --self-test\n"); exit(2); }
if (!legal_self_test()) { fwrite(STDERR, "fill-legal: self-test failed — pages left untouched\n"); exit(1); }
if (!is_file($file)) { fwrite(STDERR, "fill-legal: $file is missing — the Legal notice pages still show placeholders. Create it from legal.example.php.\n"); exit(1); }
// A PHP error in legal.php (syntax, an unquoted word taken for a constant) must not put a piece of the
// owner's data into the deploy log: PHP's own error text quotes the offending token. So PHP's messages are
// switched off for the include, and a thrown error is reported by LINE NUMBER only — never getMessage().
// Text outside the PHP tags in legal.php would be echoed by `require` straight into the log, so the include
// runs inside an output buffer that is never printed (a fatal error that no catch can see is covered by
// the shutdown function: PHP runs it BEFORE it flushes the buffers still open).
// (Never write the closing tag in a // comment: it ends PHP mode there and the rest of the line is printed.)
ini_set('display_errors', '0');
ini_set('log_errors', '0');
register_shutdown_function(function () { while (ob_get_level() > 0) ob_end_clean(); });
ob_start();
try {
  $data = require $file;
} catch (Throwable $e) {
  ob_end_clean();
  fwrite(STDERR, "fill-legal: legal.php has a PHP error on line " . $e->getLine() . " (message hidden: it may contain your data) — pages left untouched\n");
  exit(1);
}
$stray = ob_get_clean();
if (trim(str_replace("\xEF\xBB\xBF", '', (string) $stray)) !== '') {   // a UTF-8 BOM before the opening tag is harmless, not "text"
  fwrite(STDERR, "fill-legal: legal.php prints text outside <?php ?> (hidden: it may contain your data) — pages left untouched\n");
  exit(1);
}
$err = legal_data_error($data);
if ($err !== null) { fwrite(STDERR, "fill-legal: $err — pages left untouched\n"); exit(1); }
$pages = glob($root . '/*/legal.html');
if (!$pages) { fwrite(STDERR, "fill-legal: no <lang>/legal.html under $root\n"); exit(1); }
$bad = 0;
foreach ($pages as $page) {
  $src = file_get_contents($page);
  if ($src === false) { fwrite(STDERR, "fill-legal: could not read $page — not written\n"); $bad++; continue; }
  $out = legal_fill($src, $data);
  if (strpos($out, '%%LEGAL_') !== false) { fwrite(STDERR, "fill-legal: a placeholder is left in $page — not written\n"); $bad++; continue; }
  if (file_put_contents($page, $out) === false) { fwrite(STDERR, "fill-legal: could not write $page\n"); $bad++; continue; }
  echo "fill-legal: filled $page\n";
}
exit($bad ? 1 : 0);
