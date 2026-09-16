// dashboard.js - User dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to view your dashboard.');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    renderDashboardStats(user);
    renderMyItems(user);
    renderClaimRequests(user);
});

function renderDashboardStats(user) {
    const items = getItems().filter(i => i.userId === user.id);
    const claims = getClaims();
    const myItemIds = items.map(i => i.id);
    const pendingClaims = claims.filter(c => myItemIds.includes(c.itemId) && c.status === 'pending');
    const returnedCount = items.filter(i => i.status === 'returned').length;

    const statsContainer = document.getElementById('dashboardStats');
    statsContainer.innerHTML = `
        <div class="dash-stat">
            <div class="dash-stat-number">${items.filter(i => i.type === 'lost' && i.status !== 'returned').length}</div>
            <div class="stat-label">My Lost Items</div>
        </div>
        <div class="dash-stat">
            <div class="dash-stat-number">${items.filter(i => i.type === 'found' && i.status !== 'returned').length}</div>
            <div class="stat-label">My Found Items</div>
        </div>
        <div class="dash-stat">
            <div class="dash-stat-number">${pendingClaims.length}</div>
            <div class="stat-label">Pending Claims</div>
        </div>
        <div class="dash-stat">
            <div class="dash-stat-number">${returnedCount}</div>
            <div class="stat-label">Returned</div>
        </div>
    `;
}

function renderMyItems(user) {
    const items = getItems().filter(i => i.userId === user.id);
    const lostItems = items.filter(i => i.type === 'lost');
    const foundItems = items.filter(i => i.type === 'found');

    renderItemList('myLostItems', lostItems, 'lost');
    renderItemList('myFoundItems', foundItems, 'found');
}

function renderItemList(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (items.length === 0) {
        const reportType = type === 'lost' ? 'lost' : 'found';
        container.innerHTML = `
            <div class="empty-state">
                <p>You haven't reported any ${type} items yet.</p>
                <a href="report.html?type=${reportType}" class="btn btn-outline">Report ${type === 'lost' ? 'Lost' : 'Found'} Item</a>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dashboard-item';
        const statusClass = item.status === 'returned' ? 'returned' : item.type;
        const statusText = item.status === 'returned' ? 'RETURNED' : item.type.toUpperCase();
        const icon = getCategoryIcon(item.category);
        div.innerHTML = `
            <div class="dashboard-item-header">
                <span class="item-icon">${icon}</span>
                <div>
                    <strong>${item.itemName}</strong>
                    <span class="item-type ${statusClass}">${statusText}</span>
                </div>
            </div>
            <p class="dashboard-item-meta">${item.location} · ${item.date}</p>
            ${item.matchScore ? `<span class="match-badge">${item.matchScore}% match</span>` : ''}
            <a href="details.html?id=${item.id}" class="btn btn-outline btn-sm">View</a>
        `;
        container.appendChild(div);
    });
}

function renderClaimRequests(user) {
    const container = document.getElementById('claimRequests');
    if (!container) return;

    const items = getItems().filter(i => i.userId === user.id);
    const myItemIds = items.map(i => i.id);
    const claims = getClaims().filter(c => myItemIds.includes(c.itemId));
    const users = getUsers();

    if (claims.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No claim requests yet. When someone claims your found item, it will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    claims.forEach(claim => {
        const item = items.find(i => i.id === claim.itemId);
        const claimant = users.find(u => u.id === claim.claimantId);
        if (!item) return;

        const div = document.createElement('div');
        div.className = 'dashboard-item claim-item';
        div.innerHTML = `
            <p><strong>${item.itemName}</strong></p>
            <p class="dashboard-item-meta">Claimed by ${claimant ? claimant.name : 'Unknown'} · ${new Date(claim.claimDate).toLocaleDateString()}</p>
            <span class="claim-status claim-${claim.status}">${claim.status.toUpperCase()}</span>
            <div class="claim-actions"></div>
        `;

        const actions = div.querySelector('.claim-actions');
        if (claim.status === 'pending') {
            const approveBtn = document.createElement('button');
            approveBtn.className = 'btn btn-primary btn-sm';
            approveBtn.textContent = 'Approve';
            approveBtn.addEventListener('click', () => updateClaimStatus(claim.id, 'approved'));

            const rejectBtn = document.createElement('button');
            rejectBtn.className = 'btn btn-outline btn-sm';
            rejectBtn.textContent = 'Reject';
            rejectBtn.addEventListener('click', () => updateClaimStatus(claim.id, 'rejected'));

            actions.appendChild(approveBtn);
            actions.appendChild(rejectBtn);
        } else if (claim.status === 'approved' && item.status !== 'returned') {
            const returnBtn = document.createElement('button');
            returnBtn.className = 'btn btn-primary btn-sm';
            returnBtn.textContent = 'Mark as Returned';
            returnBtn.addEventListener('click', () => markItemReturned(item.id, claim.id));
            actions.appendChild(returnBtn);
        }

        container.appendChild(div);
    });
}

function updateClaimStatus(claimId, status) {
    const claims = getClaims();
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    claim.status = status;
    setClaims(claims);
    showToast(status === 'approved' ? 'Claim approved!' : 'Claim rejected.');
    renderDashboardStats(getCurrentUser());
    renderClaimRequests(getCurrentUser());
}

function markItemReturned(itemId, claimId) {
    const items = getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    item.status = 'returned';
    setItems(items);

    const claims = getClaims();
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
        claim.status = 'completed';
        setClaims(claims);
    }

    showToast('Item marked as returned!');
    renderDashboardStats(getCurrentUser());
    renderMyItems(getCurrentUser());
    renderClaimRequests(getCurrentUser());
}