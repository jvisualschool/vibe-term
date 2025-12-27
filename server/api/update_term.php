<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = intval($input['id'] ?? 0);
$term = trim($input['term'] ?? '');
$description = trim($input['description'] ?? '');
$sourceUrl = trim($input['source_url'] ?? '');

if (!$id || empty($term)) {
    echo json_encode(['status' => 'error', 'message' => '필수 항목이 누락되었습니다.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE terms SET term = ?, description = ?, source_url = ? WHERE id = ?");
    $stmt->execute([$term, $description, $sourceUrl, $id]);
    
    echo json_encode(['status' => 'success', 'message' => '수정되었습니다.']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => '수정 실패']);
}
