<?php

// Tampilkan detail error jika terjadi kendala pada Serverless
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

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

// Arahkan semua cache bootstrap ke /tmp agar tidak gagal karena Read-Only filesystem
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/packages.php';
$_SERVER['APP_PACKAGES_CACHE'] = '/tmp/packages.php';

putenv('APP_SERVICES_CACHE=/tmp/services.php');
$_ENV['APP_SERVICES_CACHE'] = '/tmp/services.php';
$_SERVER['APP_SERVICES_CACHE'] = '/tmp/services.php';

putenv('APP_CONFIG_CACHE=/tmp/config.php');
$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_SERVER['APP_CONFIG_CACHE'] = '/tmp/config.php';

putenv('APP_ROUTES_CACHE=/tmp/routes.php');
$_ENV['APP_ROUTES_CACHE'] = '/tmp/routes.php';
$_SERVER['APP_ROUTES_CACHE'] = '/tmp/routes.php';

putenv('APP_EVENTS_CACHE=/tmp/events.php');
$_ENV['APP_EVENTS_CACHE'] = '/tmp/events.php';
$_SERVER['APP_EVENTS_CACHE'] = '/tmp/events.php';

$backendPath = dirname(__DIR__) . '/backend';

// Pastikan file bootstrap autoloader Laravel ada
if (!file_exists($backendPath . '/vendor/autoload.php')) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Composer vendor autoloader not found in Vercel bundle',
        'path' => $backendPath,
    ]);
    exit;
}

try {
    require $backendPath . '/public/index.php';
} catch (\Throwable $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString())
    ]);
    exit;
}
