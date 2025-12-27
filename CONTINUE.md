# VIBETERM 프로젝트 - 완성 ✅

## 프로젝트 구조

```
VIBETERM/
├── 크롬 익스텐션 (로컬)
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html/js/css
│   └── icon.png
│
└── server/ (서버 배포용)
    ├── index.php          # 메인 웹 페이지
    ├── style.css          # 스타일 (1)
    ├── style2.css         # 스타일 (2)
    ├── app.js             # 프론트엔드 로직
    ├── config.php         # DB/API 설정
    └── api/
        ├── add_term.php       # 용어 추가
        ├── get_terms.php      # 용어 조회/검색
        ├── update_term.php    # 용어 수정
        ├── delete_term.php    # 용어 삭제
        └── generate_desc.php  # Gemini AI 설명 생성
```

## 서버 배포 방법

### 1. 서버 접속
```bash
ssh -i ~/.ssh/jvibeschool_org.pem bitnami@15.164.161.165
```

### 2. 파일 업로드 (로컬에서)
```bash
scp -i ~/.ssh/jvibeschool_org.pem -r server/* bitnami@15.164.161.165:/opt/bitnami/apache/htdocs/VIBETERM/
```

### 3. Gemini API 키 설정
서버의 `config.php` 파일에서 API 키 입력:
```php
define('GEMINI_API_KEY', '여기에_API_키_입력');
```

## 완성된 기능

- ✅ 용어 CRUD (추가/조회/수정/삭제)
- ✅ 검색 기능
- ✅ 페이지네이션
- ✅ Gemini AI 설명 자동 생성
- ✅ 크롬 익스텐션 연동
- ✅ 반응형 디자인

## Gemini API 키 발급

1. https://makersuite.google.com/app/apikey 접속
2. "Create API Key" 클릭
3. 발급된 키를 `config.php`에 입력
