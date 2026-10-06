<?php

require_once __DIR__ . '/../config/config.php';

$connection = new PDO(
    "mysql:host=" . DB_HOST .
    ";port=" . DB_PORT .
    ";dbname=" . DB_NAME,
    DB_USER,
    DB_PASSWORD
);

$connection->setAttribute(
    PDO::ATTR_ERRMODE,
    PDO::ERRMODE_EXCEPTION
);