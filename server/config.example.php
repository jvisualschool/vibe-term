<?php
// 데이터베이스 설정
define('DB_HOST', 'localhost');
define('DB_NAME', 'VIBETERM');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// Gemini API 키
define('GEMINI_API_KEY', 'your_gemini_api_key_here');

// PDO 연결
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $pdo;
    } catch (PDOException $e) {
        die(json_encode(['status' => 'error', 'message' => 'DB 연결 실패']));
    }
}
