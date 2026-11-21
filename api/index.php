<?php

// Siapkan folder /tmp yang writable untuk session, view cache, dan logs Laravel di Vercel
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    @mkdir($storagePath . '/framework/views', 0777, true);
    @mkdir($storagePath . '/framework/cache/data', 0777, true);
    @mkdir($storagePath . '/framework/sessions', 0777, true);
    @mkdir($storagePath . '/logs', 0777, true);
    @mkdir($storagePath . '/app/public', 0777, true);
}

putenv('APP_STORAGE=' . $storagePath);
$_ENV['APP_STORAGE'] = $storagePath;
$_SERVER['APP_STORAGE'] = $storagePath;

// Teruskan seluruh request API ke backend Laravel
require __DIR__ . '/../backend/public/index.php';
