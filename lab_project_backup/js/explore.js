// explore.js - Explore page with filters, search, pagination

let currentPage = 1;
const itemsPerPage = 6;

document.addEventListener('DOMContentLoaded', function() {
    loadFiltersFromURL();
    setupEventListeners();
    renderItems();
});

function loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const filter = urlParams.get('filter');
    const category = urlParams.get('category');
    if (search) document.getElementById('searchInput').value = search;
    if (filter === 'lost' || filter === 'found') {
        document.getElementById('statusFilter').value = filter;
    }
    if (category) document.getElementById('categoryFilter').value = category;
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', debounce(() => { currentPage = 1; renderItems(); }, 300));
    document.getElementById('statusFilter').addEventListener('change', () => { currentPage = 1; renderItems(); });
    document.getElementById('categoryFilter').addEventListener('change', () => { currentPage = 1; renderItems(); });
    document.getElementById('locationFilter').addEventListener('change', () => { currentPage = 1; renderItems(); });
    document.getElementById('dateFilter').addEventListener('change', () => { currentPage = 1; renderItems(); });
    document.getElementById('sortFilter').addEventListener('change', () => { currentPage = 1; renderItems(); });
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function getActiveFilters() {
    const filters = [];
    const search = document.getElementById('searchInput').value.trim();
    const status = document.getElementById('statusFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const location = document.getElementById('locationFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    if (search) filters.push({ type: 'search', label: `Search: "${search}"`, clear: () => { document.getElementById('searchInput').value = ''; } });
    if (status !== 'all') filters.push({ type: 'status', label: `Status: ${status}`, clear: () => { document.getElementById('statusFilter').value = 'all'; } });
    if (category !== 'all') filters.push({ type: 'category', label: `Category: ${category}`, clear: () => { document.getElementById('categoryFilter').value = 'all'; } });
    if (location !== 'all') filters.push({ type: 'location', label: `Location: ${location}`, clear: () => { document.getElementById('locationFilter').value = 'all'; } });
    if (dateFilter !== 'any') filters.push({ type: 'date', label: `Date: ${dateFilter}`, clear: () => { document.getElementById('dateFilter').value = 'any'; } });

    return filters;
}

function renderFilterTags() {
    const container = document.getElementById('filterTags');
    if (!container) return;
    const filters = getActiveFilters();
    container.innerHTML = '';

    filters.forEach(f => {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.innerHTML = `${f.label} <span>&times;</span>`;
        tag.addEventListener('click', () => {
            f.clear();
            currentPage = 1;
            renderItems();
        });
        container.appendChild(tag);
    });
}

function getFilteredItems() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const location = document.getElementById('locationFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let items = getItems();

    if (searchText) {
        items = items.filter(item =>
            item.itemName.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText) ||
            (item.brand && item.brand.toLowerCase().includes(searchText)) ||
            (item.location && item.location.toLowerCase().includes(searchText)) ||
            (item.category && item.category.toLowerCase().includes(searchText))
        );
    }

    if (status !== 'all') {
        if (status === 'returned') {
            items = items.filter(i => i.status === 'returned');
        } else {
            items = items.filter(i => i.type === status && i.status !== 'returned');
        }
    }

    if (category !== 'all') {
        items = items.filter(i => i.category === category);
    }

    if (location !== 'all') {
        items = items.filter(i => i.location === location);
    }

    if (dateFilter !== 'any') {
        const now = new Date();
        items = items.filter(i => {
            const itemDate = new Date(i.date);
            if (dateFilter === 'today') {
                return itemDate.toDateString() === now.toDateString();
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 7);
                return itemDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(now);
                monthAgo.setMonth(now.getMonth() - 1);
                return itemDate >= monthAgo;
            }
            return true;
        });
    }

    if (sortBy === 'date') {
        items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'name') {
        items.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (sortBy === 'match') {
        items.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return items;
}

function renderItems() {
    const filtered = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    if (currentPage > totalPages) currentPage = 1;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    const container = document.getElementById('exploreGrid');
    container.innerHTML = '';

    renderFilterTags();

    if (filtered.length === 0) {
        document.getElementById('resultsCount').textContent = '0 items found';
        container.innerHTML = '<div class="empty-state"><p>No items found. Try clearing filters or broadening your search.</p><button class="btn btn-outline" id="emptyClearBtn">Clear Filters</button></div>';
        document.getElementById('emptyClearBtn')?.addEventListener('click', clearFilters);
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    document.getElementById('resultsCount').textContent = `Showing ${start + 1}-${Math.min(end, filtered.length)} of ${filtered.length} items`;

    pageItems.forEach(item => {
        container.appendChild(createItemCard(item));
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderItems();
        });
        pagination.appendChild(btn);
    }
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('dateFilter').value = 'any';
    document.getElementById('sortFilter').value = 'date';
    currentPage = 1;
    renderItems();
}