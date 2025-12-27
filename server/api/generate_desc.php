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
$term = trim($input['term'] ?? '');

if (empty($term)) {
    echo json_encode(['status' => 'error', 'message' => '용어를 입력해주세요.']);
    exit;
}

if (empty(GEMINI_API_KEY)) {
    echo json_encode(['status' => 'error', 'message' => 'Gemini API 키가 설정되지 않았습니다.']);
    exit;
}

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
    CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['status' => 'error', 'message' => 'AI 응답 실패', 'code' => $httpCode, 'response' => $response]);
    exit;
}

$result = json_decode($response, true);
$description = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

// 토큰 사용량 추적
$usageMetadata = $result['usageMetadata'] ?? [];
$promptTokens = $usageMetadata['promptTokenCount'] ?? 0;
$outputTokens = $usageMetadata['candidatesTokenCount'] ?? 0;
$totalTokens = $usageMetadata['totalTokenCount'] ?? 0;

// 토큰 사용량 파일에 누적 저장
$tokenFile = '../token_usage.json';
$tokenData = file_exists($tokenFile) ? json_decode(file_get_contents($tokenFile), true) : ['prompt' => 0, 'output' => 0, 'total' => 0];
$tokenData['prompt'] += $promptTokens;
$tokenData['output'] += $outputTokens;
$tokenData['total'] += $totalTokens;
file_put_contents($tokenFile, json_encode($tokenData));

if ($description) {
    echo json_encode(['status' => 'success', 'description' => trim($description)]);
} else {
    echo json_encode(['status' => 'error', 'message' => '설명 생성 실패']);
}
