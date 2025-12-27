const API_BASE = 'api';
let currentPage = 1;
let currentCategory = '';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 테마 초기화
    initTheme();

    // 아이콘 애니메이션 시작
    initIconAnimation();

    // marked.js 설정 - 줄바꿈 처리
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    loadTerms();
    loadStats();
    loadCategories();

    document.getElementById('searchInput').addEventListener('input', debounce(() => {
        currentPage = 1;
        loadTerms();
    }, 300));
});

// 용어 목록 로드
async function loadTerms() {
    const search = document.getElementById('searchInput').value;
    const container = document.getElementById('termsList');

    container.innerHTML = '<div class="loading"><span class="spinner"></span> 로딩 중...</div>';

    try {
        let url = `${API_BASE}/get_terms.php?search=${encodeURIComponent(search)}&page=${currentPage}`;
        if (currentCategory) {
            url += `&category=${encodeURIComponent(currentCategory)}`;
        }
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'success') {
            renderTerms(data.data);
            renderPagination(data.totalPages);
        } else {
            container.innerHTML = '<div class="empty-state"><p>오류가 발생했습니다.</p></div>';
        }
    } catch (e) {
        container.innerHTML = '<div class="empty-state"><p>서버 연결 실패</p></div>';
    }
}

// 용어 렌더링 (공인용 - 수정/삭제 버튼 없음)
function renderTerms(terms) {
    const container = document.getElementById('termsList');

    if (!terms.length) {
        container.innerHTML = '<div class="empty-state"><p>등록된 용어가 없습니다.</p></div>';
        return;
    }

    container.innerHTML = terms.map(term => {
        const firstLine = getFirstContentLine(term.description);
        const hasMore = term.description && term.description.includes('\n');
        return `
        <div class="term-card" data-id="${term.id}" data-category="${escapeHtml(term.category || '')}" onclick="handleCardClick(event, this)">
            <div class="term-header">
                <div class="term-title-wrap">
                    ${term.category ? `<span class="term-category">${escapeHtml(term.category)}</span>` : ''}
                    <span class="term-name">${escapeHtml(term.term)}</span>
                </div>
            </div>
            ${term.description ? `
                <div class="term-desc-wrap">
                    <div class="term-desc-preview markdown-body">${marked.parse(firstLine)}</div>
                    ${hasMore ? `<i class="fas fa-chevron-down expand-icon"></i>` : ''}
                </div>
                <div class="term-desc-full" style="display:none;">
                    <div class="term-desc-full-header">
                        <i class="fas fa-chevron-up collapse-icon"></i>
                    </div>
                    <div class="markdown-body">${marked.parse(term.description)}</div>
                </div>
            ` : '<p class="no-desc">설명이 준비 중입니다.</p>'}
        </div>
    `}).join('');
}

// 페이지네이션
function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    html += `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>이전</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<button disabled>...</button>';
        }
    }

    html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>다음</button>`;
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    loadTerms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 스플래시 모달 관련
function openSplashModal() {
    document.getElementById('splashModal').classList.add('active');
}

function closeSplashModal() {
    document.getElementById('splashModal').classList.remove('active');
}

// 유틸리티
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return '2026년 1월';
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function handleCardClick(event, card) {
    if (event.target.tagName === 'A') return;
    const wrap = card.querySelector('.term-desc-wrap');
    const full = card.querySelector('.term-desc-full');
    if (!wrap || !full) return;
    if (full.style.display === 'none') {
        wrap.style.display = 'none';
        full.style.display = 'block';
    } else {
        wrap.style.display = 'flex';
        full.style.display = 'none';
    }
}

function getFirstContentLine(desc) {
    if (!desc) return '';
    const lines = desc.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line && !line.startsWith('#') && !line.startsWith('---')) {
            return line;
        }
    }
    return lines[0] || '';
}

async function loadStats() {
    try {
        const res = await fetch(`${API_BASE}/get_stats.php`);
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('apiUsage').textContent = `${data.apiUsage}회 호출`;
            document.getElementById('lastUpdate').textContent = formatDate(data.lastUpdate);
            if (data.tokens && data.tokens.total > 0) {
                const totalTokens = data.tokens.total;
                const formatted = totalTokens >= 1000 ? `${(totalTokens / 1000).toFixed(1)}K` : totalTokens;
                document.getElementById('tokenUsage').textContent = formatted;
            } else {
                document.getElementById('tokenUsage').textContent = '0';
            }
        }
    } catch (e) {
        console.error('Stats load failed:', e);
    }
}

const THEMES = ['dark', 'light', 'gray', 'gemini'];
function initTheme() {
    const saved = localStorage.getItem('theme');
    const theme = THEMES.includes(saved) ? saved : 'dark';
    setTheme(theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
}

function setTheme(theme) {
    document.body.classList.remove(...THEMES);
    if (theme !== 'dark') document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    updateThemeUI(theme);
}

function updateThemeUI(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function initIconAnimation() {
    const iconContainer = document.querySelector('.header-icon');
    if (!iconContainer) return;
    setInterval(() => {
        iconContainer.classList.toggle('swap');
    }, 3000);
}

async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/get_categories.php`);
        const data = await res.json();
        if (data.status === 'success') renderCategoryTabs(data.categories, data.total);
    } catch (e) {
        console.error('Categories load failed:', e);
    }
}

function renderCategoryTabs(categories, total) {
    const container = document.getElementById('categoryTabs');
    let html = `<button class="tab-btn active" data-category="">전체 <span class="tab-count">${total}</span></button>`;
    categories.forEach(cat => {
        html += `<button class="tab-btn" data-category="${escapeHtml(cat.category)}">${escapeHtml(cat.category)} <span class="tab-count">${cat.count}</span></button>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            currentPage = 1;
            loadTerms();
        });
    });
}

