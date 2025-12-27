<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>바이브코딩 백과사전 | 개발 용어집</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="style2.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="header-icon" onclick="openSplashModal()" style="cursor: pointer;">
                <img src="dictionary1.svg" alt="icon" class="icon icon1">
                <img src="dictionary2.svg" alt="icon" class="icon icon2">
            </div>
            <div class="header-left">
                <h1>바이브코딩 백과사전</h1>
                <p class="subtitle">비전공자 바이브코더를 위한 개발 용어집</p>
            </div>
            <div class="theme-selector">
                <button class="theme-btn" data-theme="dark" title="다크"></button>
                <button class="theme-btn" data-theme="light" title="라이트"></button>
                <button class="theme-btn" data-theme="gray" title="그레이"></button>
                <button class="theme-btn" data-theme="gemini" title="제미나이"></button>
            </div>
        </header>

        <div class="search-section">
            <input type="text" id="searchInput" placeholder="용어 검색..." autocomplete="off">
        </div>

        <div class="category-tabs" id="categoryTabs">
            <button class="tab-btn active" data-category="">전체</button>
        </div>

        <div id="termsList" class="terms-list">
            <!-- 용어 목록이 여기에 렌더링됨 -->
        </div>

        <div id="pagination" class="pagination"></div>

        <footer class="site-footer">
            <div class="footer-stats">
                <span><i class="fas fa-layer-group"></i> PHP · MySQL · Gemini AI</span>
                <span class="divider">|</span>
                <span><i class="fas fa-robot"></i> API <strong id="apiUsage">-</strong></span>
                <span class="divider">|</span>
                <span><i class="fas fa-coins"></i> 토큰 <strong id="tokenUsage">-</strong></span>
                <span class="divider">|</span>
                <span><i class="fas fa-calendar-check"></i> <strong id="lastUpdate">-</strong></span>
            </div>
            <p class="footer-copy">&copy; 2026 바이브코딩 백과사전 by Jinho Jung</p>
        </footer>
    </div>



    <!-- 스플래시 모달 -->
    <div id="splashModal" class="modal splash-modal" onclick="closeSplashModal()">
        <div class="modal-content splash-content" onclick="event.stopPropagation()">
            <button class="splash-close" onclick="closeSplashModal()">&times;</button>
            <div class="splash-body">
                <div class="splash-image-container">
                    <img src="splash.jpg" alt="Splash Image" class="splash-image">
                </div>
                <div class="splash-info">
                    <h2 class="splash-title">바이브코딩 백과사전</h2>
                    <p class="splash-subtitle">비전공자 바이브코더를 위한 개발 용어집</p>
                    <div class="splash-details">
                        <div class="detail-item tech-stack">
                            <span class="detail-label">Tech Stack</span>
                            <div class="detail-value">
                                <a href="https://www.php.net/" target="_blank" class="tech-tag">PHP</a>
                                <a href="https://www.mysql.com/" target="_blank" class="tech-tag">MySQL</a>
                                <a href="https://gemini.google.com/" target="_blank" class="tech-tag">Gemini AI</a>
                                <span class="tech-tag">Vanilla JS/CSS</span>
                            </div>
                        </div>
                        <div class="detail-item developer">
                            <span class="detail-label">Developer</span>
                            <a href="mailto:jvisualschool@gmail.com" class="detail-value">Jinho Jung</a>
                        </div>
                        <div class="detail-item year">
                            <span class="detail-label">Year</span>
                            <span class="detail-value">2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="toast" class="toast"></div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
