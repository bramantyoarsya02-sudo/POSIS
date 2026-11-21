<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'POSIS API - SMK Negeri 1 Ciomas',
        'status' => 'online',
        'version' => '1.0.0',
        'endpoints' => [
            'api' => '/api',
            'health' => '/up',
        ]
    ]);
});
