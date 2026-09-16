// details.js - Item details page with verification

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    if (!itemId) {
        window.location.href = 'explore.html';
        return;
    }

    loadItemDetails(itemId);
    setupVerificationModal();
});

function getColorHex(colorName) {
    const colors = {
        'black': '#1f2933', 'white': '#f9fafb', 'blue': '#2563eb',
        'red': '#dc2626', 'silver': '#9ca3af', 'green': '#16a34a'
    };
    return colors[colorName?.toLowerCase()] || '#dce5e9';
}

function loadItemDetails(itemId) {
    const items = getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) {
        document.getElementById('itemDetailsContainer').innerHTML = '<div class="empty-state"><p>Item not found.</p><a href="explore.html" class="btn btn-outline">Back to Explore</a></div>';
        return;
    }

    const container = document.getElementById('itemDetailsContainer');
    const typeClass = item.type === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'returned' ? 'RETURNED' : item.type.toUpperCase();
    const statusClass = item.status === 'returned' ? 'returned' : typeClass;
    const icon = getCategoryIcon(item.category);
    const colorHex = getColorHex(item.color);

    let matchHtml = '';
    if (item.type === 'lost' && item.status !== 'returned') {
        const matches = findMatchesForItem(item, items);
        if (matches.length > 0) {
            matchHtml = `<div class="match-score">Best match: ${matches[0].score}% (${matches[0].item.itemName})</div>`;
        }
    }

    const relatedItems = items
        .filter(i => i.id !== item.id && (i.category === item.category || i.location === item.location))
        .slice(0, 3);

    let relatedHtml = '';
    if (relatedItems.length > 0) {
        relatedHtml = relatedItems.map(r => `
            <div class="related-item">
                <span>${getCategoryIcon(r.category)}</span>
                <a href="details.html?id=${r.id}">${r.itemName}</a>
                <p class="dashboard-item-meta">${r.location} · ${r.type}</p>
            </div>
        `).join('');
    } else {
        relatedHtml = '<p class="dashboard-item-meta">No related items found.</p>';
    }

    container.innerHTML = `
        <div class="breadcrumb"><a href="explore.html">← Back to Explore</a></div>
        <div class="details-layout">
            <div class="item-detail-card">
                <div class="item-detail-visual">
                    <span class="item-icon-large">${icon}</span>
                    <span>${item.category}</span>
                </div>
                <div class="item-detail-info">
                    <span class="item-type ${statusClass}">${statusText}</span>
                    <h2>${item.itemName}</h2>
                    ${matchHtml}
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Date:</strong> ${item.date}</p>
                    ${item.time ? `<p><strong>Time:</strong> ${item.time}</p>` : ''}
                    ${item.color ? `<p><strong>Color:</strong> ${item.color}<span class="color-swatch" style="background:${colorHex}"></span></p>` : ''}
                    ${item.brand ? `<p><strong>Brand:</strong> ${item.brand}</p>` : ''}
                    <p><strong>Description:</strong> ${item.description}</p>
                    ${item.uniqueFeatures ? `<p><strong>Unique Features:</strong> ${item.uniqueFeatures}</p>` : ''}

                    <div style="margin-top:1.5rem; display:flex; gap:1rem; flex-wrap:wrap;">
                        ${item.type === 'found' && item.status !== 'returned' ?
                            `<button class="btn btn-primary" id="claimBtn">This Might Be Mine</button>` : ''}
                        ${item.type === 'found' ?
                            `<button class="btn btn-outline" id="contactBtn">Contact Finder</button>` : ''}
                    </div>
                </div>
            </div>
            <aside class="related-items">
                <h3>Related Items</h3>
                ${relatedHtml}
            </aside>
        </div>
    `;

    if (item.type === 'found' && item.status !== 'returned') {
        document.getElementById('claimBtn').addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) {
                showToast('Please login to claim this item.');
                openAuthModal('login');
                return;
            }
            document.getElementById('verifyModal').style.display = 'flex';
        });
    }

    if (document.getElementById('contactBtn')) {
        document.getElementById('contactBtn').addEventListener('click', () => {
            showToast('Contact request sent to finder. They will reach out to you.');
        });
    }
}

function setupVerificationModal() {
    const modal = document.getElementById('verifyModal');
    const closeBtn = document.getElementById('verifyModalClose');
    const form = document.getElementById('verificationForm');
    if (!modal || !form) return;

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) return;

        const itemId = new URLSearchParams(window.location.search).get('id');
        const items = getItems();
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const brand = document.getElementById('verifyBrand').value;
        const feature = document.getElementById('verifyFeature').value;

        const brandMatch = item.brand && item.brand.toLowerCase() === brand.toLowerCase();
        const featureMatch = item.uniqueFeatures && item.uniqueFeatures.toLowerCase().includes(feature.toLowerCase());

        if (brandMatch || featureMatch) {
            const claims = getClaims();
            claims.push({
                id: 'claim' + Date.now(),
                itemId: item.id,
                claimantId: user.id,
                claimDate: new Date().toISOString(),
                status: 'pending',
                verificationAnswers: { brand, feature }
            });
            setClaims(claims);
            showToast('Verification passed. Your claim has been sent to the finder.');
            modal.style.display = 'none';
        } else {
            showToast('Verification failed. Your answers do not match the item details.');
        }
    });
}