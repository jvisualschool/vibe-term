<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config.php';

try {
    $pdo = getDB();
    
    // 총 용어 수
    $totalTerms = $pdo->query("SELECT COUNT(*) FROM terms")->fetchColumn();
    
    // 설명이 있는 용어 수 (AI 사용량 추정)
    $withDesc = $pdo->query("SELECT COUNT(*) FROM terms WHERE description IS NOT NULL AND description != ''")->fetchColumn();
    
    // 최종 업데이트
    $lastUpdate = $pdo->query("SELECT MAX(created_at) FROM terms")->fetchColumn();
    
    // 토큰 사용량
    $tokenFile = '../token_usage.json';
    $tokenData = file_exists($tokenFile) ? json_decode(file_get_contents($tokenFile), true) : ['prompt' => 0, 'output' => 0, 'total' => 0];
    
    echo json_encode([
        'status' => 'success',
        'totalTerms' => (int)$totalTerms,
        'apiUsage' => (int)$withDesc,
        'lastUpdate' => $lastUpdate,
        'tokens' => $tokenData
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
