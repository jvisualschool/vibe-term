<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// 간단한 API 보안 체크
$headers = getallheaders();
$apiKey = $headers['X-API-KEY'] ?? '';

if ($apiKey !== API_SECRET) {
    echo json_encode(['status' => 'error', 'message' => '인증되지 않은 접근입니다.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = intval($input['id'] ?? 0);

if (!$id) {
    echo json_encode(['status' => 'error', 'message' => 'ID가 필요합니다.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare("DELETE FROM terms WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['status' => 'success', 'message' => '삭제되었습니다.']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => '삭제 실패']);
}
