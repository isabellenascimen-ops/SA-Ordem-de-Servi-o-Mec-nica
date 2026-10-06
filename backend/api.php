<?php

require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

$response = [
    'success' => true,
    'message' => 'API EMU funcionando'
];

echo json_encode($response);