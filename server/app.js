const API_BASE = 'api';
const API_SECRET = 'vibe-secret-key-2026';
let currentPage = 1;
let currentCategory = '';
let deleteTargetId = null;

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

    document.getElementById('addNewBtn').addEventListener('click', () => openModal());
    document.getElementById('termForm').addEventListener('submit', handleSubmit);
    document.getElementById('aiBtn').addEventListener('click', generateAIDescription);
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

// 용어 렌더링
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
                <div class="term-actions" onclick="event.stopPropagation()">
                    <button onclick="openModal(${term.id})">수정</button>
                    <button class="delete-btn" onclick="openDeleteModal(${term.id}, '${escapeHtml(term.term)}')">삭제</button>
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
            ` : '<p class="no-desc">설명 없음 - 수정 버튼을 눌러 AI 설명을 생성하세요</p>'}
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


// 모달 열기
async function openModal(id = null) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('termForm');

    form.reset();
    document.getElementById('termId').value = '';

    if (id) {
        title.textContent = '용어 수정';
        // 기존 데이터 로드
        const card = document.querySelector(`.term-card[data-id="${id}"]`);
        if (card) {
            document.getElementById('termId').value = id;
            document.getElementById('termInput').value = card.querySelector('.term-name').textContent;
            const desc = card.querySelector('.term-desc');
            document.getElementById('descInput').value = desc ? desc.textContent : '';
        }
    } else {
        title.textContent = '새 용어 추가';
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// 스플래시 모달 관련
function openSplashModal() {
    document.getElementById('splashModal').classList.add('active');
}

function closeSplashModal() {
    document.getElementById('splashModal').classList.remove('active');
}

// 폼 제출
async function handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('termId').value;
    const term = document.getElementById('termInput').value.trim();
    const description = document.getElementById('descInput').value.trim();

    if (!term) {
        showToast('용어를 입력해주세요.', 'error');
        return;
    }

    const endpoint = id ? 'update_term.php' : 'add_term.php';
    const payload = { term, description };
    if (id) payload.id = parseInt(id);

    try {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_SECRET
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.status === 'success') {
            showToast(data.message, 'success');
            closeModal();
            loadTerms();
        } else {
            showToast(data.message, 'error');
        }
    } catch (e) {
        showToast('저장 실패', 'error');
    }
}

// AI 설명 생성
async function generateAIDescription() {
    const term = document.getElementById('termInput').value.trim();
    const btn = document.getElementById('aiBtn');
    const descInput = document.getElementById('descInput');

    if (!term) {
        showToast('먼저 용어를 입력해주세요.', 'error');
        return;
    }

    btn.disabled = true;
    btn.textContent = '생성 중...';

    try {
        const res = await fetch(`${API_BASE}/generate_desc.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_SECRET
            },
            body: JSON.stringify({ term })
        });

        const data = await res.json();

        if (data.status === 'success') {
            descInput.value = data.description;
            showToast('AI 설명이 생성되었습니다!', 'success');
        } else {
            const errorMsg = JSON.stringify(data, null, 2);
            console.error('AI Error:', data);
            prompt('AI 오류 - 아래 내용을 복사하세요:', errorMsg);
        }
    } catch (e) {
        showToast('AI 생성 실패', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'AI 설명 생성';
    }
}

// 삭제 모달
function openDeleteModal(id, name) {
    deleteTargetId = id;
    document.getElementById('deleteTermName').textContent = `"${name}"`;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteTargetId = null;
}

async function confirmDelete() {
    if (!deleteTargetId) return;

    try {
        const res = await fetch(`${API_BASE}/delete_term.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_SECRET
            },
            body: JSON.stringify({ id: deleteTargetId })
        });

        const data = await res.json();

        if (data.status === 'success') {
            showToast('삭제되었습니다.', 'success');
            closeDeleteModal();
            loadTerms();
        } else {
            showToast(data.message, 'error');
        }
    } catch (e) {
        showToast('삭제 실패', 'error');
    }
}

// 유틸리티
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
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
    // 사용자 요청에 따라 '2026년 1월' 형식으로 변경
    return '2026년 1월';
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function toggleExpand(btn) {
    const card = btn.closest('.term-card');
    const wrap = card.querySelector('.term-desc-wrap');
    const full = card.querySelector('.term-desc-full');

    if (full.style.display === 'none') {
        wrap.style.display = 'none';
        full.style.display = 'block';
    } else {
        wrap.style.display = 'flex';
        full.style.display = 'none';
    }
}

function handleCardClick(event, card) {
    // 링크 클릭은 무시
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
        // 제목(#으로 시작)이나 빈 줄은 건너뛰기
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

            // 토큰 사용량 표시
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


// 테마 관련 - 4가지 테마 지원
const THEMES = ['dark', 'light', 'gray', 'gemini'];

function initTheme() {
    const saved = localStorage.getItem('theme');
    const theme = THEMES.includes(saved) ? saved : 'dark';
    setTheme(theme);

    // 테마 버튼 이벤트 등록
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });
}

function setTheme(theme) {
    // 모든 테마 클래스 제거
    document.body.classList.remove(...THEMES);

    // 새 테마 적용 (dark는 기본이므로 클래스 추가 안 함)
    if (theme !== 'dark') {
        document.body.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
    updateThemeUI(theme);
}

function updateThemeUI(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}


// 아이콘 애니메이션
function initIconAnimation() {
    const iconContainer = document.querySelector('.header-icon');
    if (!iconContainer) return;

    setInterval(() => {
        iconContainer.classList.toggle('swap');
    }, 3000);
}


// 카테고리 목록 로드
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/get_categories.php`);
        const data = await res.json();

        if (data.status === 'success') {
            renderCategoryTabs(data.categories, data.total);
        }
    } catch (e) {
        console.error('Categories load failed:', e);
    }
}

// 카테고리 탭 렌더링
function renderCategoryTabs(categories, total) {
    const container = document.getElementById('categoryTabs');
    let html = `<button class="tab-btn active" data-category="">전체 <span class="tab-count">${total}</span></button>`;

    categories.forEach(cat => {
        html += `<button class="tab-btn" data-category="${escapeHtml(cat.category)}">${escapeHtml(cat.category)} <span class="tab-count">${cat.count}</span></button>`;
    });

    container.innerHTML = html;

    // 탭 클릭 이벤트
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
