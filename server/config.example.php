<?php
/**
 * Config for refresh-images.php — TEMPLATE, no secrets here.
 *
 * On the server: copy this file to config.php in the same folder
 * (~/mysewingpicks-api/), fill in the credential values, and set its
 * permissions to 600. config.php must NEVER be committed to git.
 *
 * Credentials: Associates Central → Tools → Creators API → application
 * "MySewingPicks". Credential version 3.1 = North America token endpoint below.
 */
return [
    'client_id'     => 'PASTE_CREDENTIAL_ID_HERE',
    'client_secret' => 'PASTE_CREDENTIAL_SECRET_HERE',
    'partner_tag'   => 'mysewingpicks-20',
    'marketplace'   => 'www.amazon.com',
    'token_url'     => 'https://api.amazon.com/auth/o2/token',
    'public_dir'    => '/home1/mzadwkmy/public_html',
];
