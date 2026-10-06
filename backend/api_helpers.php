<?php

function responseJson($data, $statusCode = 200)
{
    http_response_code($statusCode);

    echo json_encode($data);
    exit;
}