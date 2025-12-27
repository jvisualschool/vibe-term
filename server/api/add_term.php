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
$term = trim($input['term'] ?? '');
$sourceUrl = trim($input['source_url'] ?? '');
$description = trim($input['description'] ?? '');

if (empty($term)) {
    echo json_encode(['status' => 'error', 'message' => '용어를 입력해주세요.']);
    exit;
}

try {
    $pdo = getDB();
    
    // 중복 체크
    $stmt = $pdo->prepare("SELECT id FROM terms WHERE term = ?");
    $stmt->execute([$term]);
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => '이미 등록된 용어입니다.']);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO terms (term, source_url, description) VALUES (?, ?, ?)");
    $stmt->execute([$term, $sourceUrl, $description]);
    
    echo json_encode(['status' => 'success', 'message' => '용어가 저장되었습니다.', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => '저장 실패: ' . $e->getMessage()]);
}
