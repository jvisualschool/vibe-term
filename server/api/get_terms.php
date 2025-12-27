<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config.php';

$search = trim($_GET['search'] ?? '');
$category = trim($_GET['category'] ?? '');
$page = max(1, intval($_GET['page'] ?? 1));
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$offset = ($page - 1) * $limit;

try {
    $pdo = getDB();
    
    $where = [];
    $params = [];
    
    if ($search) {
        $where[] = "(term LIKE ? OR description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($category) {
        $where[] = "category = ?";
        $params[] = $category;
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $sql = "SELECT * FROM terms $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $countSql = "SELECT COUNT(*) FROM terms $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    
    $terms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $total = $countStmt->fetchColumn();
    
    echo json_encode([
        'status' => 'success',
        'data' => $terms,
        'total' => (int)$total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
}
