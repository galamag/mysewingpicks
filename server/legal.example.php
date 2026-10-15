<?php
// Template for ~/mysewingpicks-api/legal.php — the site owner's data for the Legal notice pages
// (de Impressum, es Aviso legal, fr Mentions légales). Copy to legal.php in the SAME folder on the
// server, fill in, set permissions to 600. legal.php is NEVER committed (see .gitignore) and never
// sent in chat. fill-legal.php puts the data into the pages at every deploy.
return array(
  'name'    => 'First Last',
  'address' => "Street 1, apt. 2\n12345 City\nCountry",   // one line per address line
  'email'   => 'name@example.com',
  'phone'   => '',                                        // optional, e.g. '+7 700 000 00 00'; empty = no phone line
);
