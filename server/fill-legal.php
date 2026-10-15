<?php
/*
  fill-legal.php — puts the site owner's name, address, e-mail (and phone, if given) into the Legal
  notice pages (public_html/<lang>/legal.html: de, es, fr) at deploy. Run by .cpanel.yml right after
  dist/ is copied: every deploy copies the pages WITH placeholders again, so this must run every time.
  The data live ONLY on the server — ~/mysewingpicks-api/legal.php (see legal.example.php) — never in git.
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
  if (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) return 'legal.php: email is not an e-mail address';
  return null;
}

function legal_self_test() {
  $page = '<p>%%LEGAL_NAME%%<br />%%LEGAL_ADDRESS%%</p><p>E: <a href="mailto:%%LEGAL_EMAIL%%">%%LEGAL_EMAIL%%</a></p><p data-legal="phone">T: %%LEGAL_PHONE%%</p>';
  $data = array('name' => ' Ä & <b>"O\'Neil"</b> ', 'address' => "Straße 1/2\r\n12345 Stadt", 'email' => 'a.b@example.com');
  $cases = array(
    'no phone' => array(legal_fill($page, $data),
      '<p>Ä &amp; &lt;b&gt;&quot;O&apos;Neil&quot;&lt;/b&gt;<br />Straße 1/2<br>12345 Stadt</p><p>E: <a href="mailto:a.b@example.com">a.b@example.com</a></p>'),
    'phone' => array(legal_fill($page, $data + array('phone' => '+7 700 000 00 00')),
      '<p>Ä &amp; &lt;b&gt;&quot;O&apos;Neil&quot;&lt;/b&gt;<br />Straße 1/2<br>12345 Stadt</p><p>E: <a href="mailto:a.b@example.com">a.b@example.com</a></p><p data-legal="phone">T: +7 700 000 00 00</p>'),
  );
  $ok = true;
  foreach ($cases as $name => $c) {
    if ($c[0] !== $c[1]) { fwrite(STDERR, "fill-legal self-test '$name' failed:\n  got  {$c[0]}\n  want {$c[1]}\n"); $ok = false; }
  }
  if (legal_data_error(array('name' => 'X', 'address' => 'Y')) === null) { fwrite(STDERR, "fill-legal self-test: missing e-mail not caught\n"); $ok = false; }
  if (legal_data_error($data) !== null) { fwrite(STDERR, "fill-legal self-test: good data rejected\n"); $ok = false; }
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
$data = require $file;
$err = legal_data_error($data);
if ($err !== null) { fwrite(STDERR, "fill-legal: $err — pages left untouched\n"); exit(1); }
$pages = glob($root . '/*/legal.html');
if (!$pages) { fwrite(STDERR, "fill-legal: no <lang>/legal.html under $root\n"); exit(1); }
$bad = 0;
foreach ($pages as $page) {
  $out = legal_fill(file_get_contents($page), $data);
  if (strpos($out, '%%LEGAL_') !== false) { fwrite(STDERR, "fill-legal: a placeholder is left in $page — not written\n"); $bad++; continue; }
  file_put_contents($page, $out);
  echo "fill-legal: filled $page\n";
}
exit($bad ? 1 : 0);
