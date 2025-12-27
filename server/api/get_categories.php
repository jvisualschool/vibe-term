<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config.php';

try {
    $pdo = getDB();
    
    // 카테고리별 개수 포함
    $stmt = $pdo->query("SELECT category, COUNT(*) as count FROM terms WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY category");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 전체 개수
    $totalStmt = $pdo->query("SELECT COUNT(*) FROM terms");
    $total = $totalStmt->fetchColumn();
    
    echo json_encode([
        'status' => 'success',
        'categories' => $categories,
        'total' => (int)$total
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
