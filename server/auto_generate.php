<?php
require_once 'config.php';

$pdo = getDB();

// 설명이 없는 용어 10개 가져오기
$stmt = $pdo->query("SELECT id, term FROM terms WHERE description IS NULL OR description = '' LIMIT 10");
$terms = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($terms)) {
    echo "모든 용어에 설명이 있습니다.\n";
    exit;
}

echo "설명 생성 시작...\n\n";

foreach ($terms as $row) {
    $term = $row['term'];
    $id = $row['id'];
    
    echo "[$id] $term 처리 중... ";
    
    $prompt = "프로그래밍/코딩 용어 '$term'에 대해 다음 형식으로 바로 설명해주세요:

## 정의
객관적이고 정확한 기술적 정의 (2-3문장)

## 용도
실제로 어떤 상황에서 사용되는지

## 참고
관련 공식 문서나 신뢰할 수 있는 참고 링크 1-2개

주의사항:
- '~에 대한 설명입니다' 같은 서두 문장 절대 쓰지 말 것
- 어설픈 비유 사용하지 말 것
- 사실에 기반한 객관적 설명만 할 것
- 초보자도 이해할 수 있게 명확하게 작성
- 바로 본론으로 시작할 것";

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . GEMINI_API_KEY;
    
    $data = [
        'contents' => [
            ['parts' => [['text' => $prompt]]]
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_TIMEOUT => 60
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        echo "실패 (HTTP $httpCode)\n";
        continue;
    }
    
    $result = json_decode($response, true);
    $description = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
    
    if ($description) {
        $updateStmt = $pdo->prepare("UPDATE terms SET description = ? WHERE id = ?");
        $updateStmt->execute([trim($description), $id]);
        echo "완료!\n";
    } else {
        echo "응답 없음\n";
    }
    
    // API 호출 간격
    sleep(1);
}

echo "\n완료!\n";
