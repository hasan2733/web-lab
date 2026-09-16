// index.js - Home page functionality

document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadRecentItems();
    loadLocationChart();
    loadSuccessStories();
    setupHeroSearch();
    setupFaqAccordion();
    setupCategoryChips();
});

function loadStats() {
    const items = getItems();
    const lostCount = items.filter(i => i.type === 'lost').length;
    const foundCount = items.filter(i => i.type === 'found').length;
    const returnedCount = items.filter(i => i.status === 'returned').length;
    const matchCount = items.filter(i => i.matchScore && i.matchScore > 0).length;

    animateCounter('statLost', lostCount);
    animateCounter('statFound', foundCount);
    animateCounter('statReturned', returnedCount);
    animateCounter('statMatches', matchCount);
}

function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(interval);
        } else {
            el.textContent = current;
        }
    }, 40);
}

function loadRecentItems() {
    const items = getItems();
    const lostItems = items.filter(i => i.type === 'lost' && i.status !== 'returned')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    const foundItems = items.filter(i => i.type === 'found' && i.status !== 'returned')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

    const lostGrid = document.getElementById('recentLostGrid');
    const foundGrid = document.getElementById('recentFoundGrid');
    lostGrid.innerHTML = '';
    foundGrid.innerHTML = '';

    if (lostItems.length === 0) {
        lostGrid.innerHTML = '<div class="empty-state"><p>No lost items reported yet.</p></div>';
    } else {
        lostItems.forEach(item => lostGrid.appendChild(createItemCard(item)));
    }

    if (foundItems.length === 0) {
        foundGrid.innerHTML = '<div class="empty-state"><p>No found items reported yet.</p></div>';
    } else {
        foundItems.forEach(item => foundGrid.appendChild(createItemCard(item)));
    }
}

function loadLocationChart() {
    const items = getItems();
    const locations = {};
    items.forEach(item => {
        const loc = item.location;
        if (loc) locations[loc] = (locations[loc] || 0) + 1;
    });
    const sorted = Object.entries(locations).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
    const chartContainer = document.getElementById('locationChart');
    chartContainer.innerHTML = '';

    if (sorted.length === 0) {
        chartContainer.innerHTML = '<div class="empty-state"><p>No location data yet.</p></div>';
        return;
    }

    sorted.forEach(([loc, count]) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.innerHTML = `
            <div class="chart-label">${loc}</div>
            <div class="chart-track">
                <div class="chart-fill" style="width:${(count / maxCount) * 100}%">${count}</div>
            </div>
        `;
        chartContainer.appendChild(bar);
    });
}

function loadSuccessStories() {
    const items = getItems().filter(i => i.status === 'returned');
    const container = document.getElementById('successStories');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No returned items yet. Be the first to reunite someone with their belongings!</p></div>';
        return;
    }

    items.slice(0, 3).forEach(item => {
        const div = document.createElement('div');
        div.className = 'success-card';
        const icon = getCategoryIcon(item.category);
        div.innerHTML = `
            <h3>${icon} ${item.itemName}</h3>
            <p>Returned to owner after being reported at ${item.location}.</p>
        `;
        container.appendChild(div);
    });
}

function setupHeroSearch() {
    const searchBtn = document.getElementById('heroSearchBtn');
    const searchInput = document.getElementById('heroSearchInput');
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `explore.html?search=${encodeURIComponent(query)}`;
        }
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });
}

function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

function setupCategoryChips() {
    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            window.location.href = `explore.html?category=${encodeURIComponent(category)}`;
        });
    });
}