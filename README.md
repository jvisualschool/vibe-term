# 📖 VIBETERM (바이브코딩 백과사전)

비전공자 바이브코더를 위한 쉽고 명확한 개발 용어 사전입니다. PHP와 MySQL을 기반으로 하며, Gemini AI를 활용하여 용어 설명을 생성하고 관리합니다.


## 🚀 주요 기능

- **실시간 검색**: 방대한 개발 용어를 즉시 검색하고 카테고리별로 필터링할 수 있습니다.
- **AI 설명 생성**: Google Gemini AI API를 연동하여 복잡한 개발 용어를 초보자 눈높이에 맞춰 자동으로 설명해줍니다.
- **관리자 전용 페이지**: 용어 등록, 수정, 삭제 및 AI 자동 생성을 관리할 수 있는 별도의 관리자 인터페이스를 제공합니다.
- **보안 강화**: 모든 관리용 API는 `X-API-KEY` 인증을 거치며, 중요 스크립트는 CLI 환경에서만 실행 가능합니다.
- **테마 시스템**: 다크, 라이트, 그레이 및 제미나이 전용 테마를 지원합니다.
- **반응형 디자인**: 모바일과 데스크톱 어디서나 최적화된 사용자 경험을 제공합니다.

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | PHP 8.x | 서버 로직 및 API 구현 (PDO 사용) |
| **Database** | MySQL / MariaDB | 용어 데이터 및 통계 관리 (SQL 덤프 제공) |
| **AI** | Gemini Pro API | 인공지능 기반 용어 설명 자동 생성 |
| **Frontend** | Vanilla JS / CSS | 라이브러리 없는 순수 웹 기술로 구현 |

## 📐 Architecture & Ratio (Splash Modal)

스플래시 모달은 다음의 시각적 비율을 준수합니다:
- **Tech Stack : Developer : Year = 7:2:1**

## 💻 설치 및 실행 (로컬 환경)

1. **저장소 클론**
   ```bash
   git clone https://github.com/jvisualschool/vibe-term.git
   cd vibe-term
   ```

2. **환경 설정**
   - `server/config.example.php` 파일을 `server/config.php`로 복사합니다.
   - `server/config.php`에 DB 정보, Gemini API 키, `API_SECRET` 값을 설정합니다.

3. **데이터베이스 구축**
   - MySQL에 `VIBETERM` 데이터베이스를 생성합니다.
   - 제공된 `vibeterm.sql` 파일을 가져오기(Import)하여 테이블 및 초기 데이터를 구축합니다.
   ```bash
   mysql -u [user] -p VIBETERM < vibeterm.sql
   ```

4. **웹 서버 구동**
   - Apache 또는 Nginx의 웹 루트에 프로젝트를 배치하거나, `php -S localhost:8000` 명령어로 실행합니다.

## 🔗 Live Demo
[https://jvibeschool.org/VIBETERM/](https://jvibeschool.org/VIBETERM/)

## 👤 Developer
- **Jinho Jung** ([jvisualschool@gmail.com](mailto:jvisualschool@gmail.com))

## 📄 License
This project is licensed under the MIT License.
