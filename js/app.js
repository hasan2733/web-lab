// app.js - Shared functionality: auth, navigation, toast, smart matching

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateAllMatchScores();
    setupAuthUI();
    setupHamburger();
    setupAuthModal();
    updateNavAuth();
});

// ===== CATEGORY ICONS & ITEM CARDS =====
function getCategoryIcon(category) {
    const initials = {
        'Electronics': 'E',
        'Documents': 'D',
        'Accessories': 'A',
        'Bags': 'B',
        'Keys': 'K',
        'Other': 'O'
    };
    return initials[category] || 'O';
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    const typeClass = item.type === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'returned' ? 'RETURNED' : item.type.toUpperCase();
    const statusClass = item.status === 'returned' ? 'returned' : typeClass;
    const icon = getCategoryIcon(item.category);
    const matchBadge = item.matchScore && item.matchScore >= 40
        ? `<span class="match-badge">${item.matchScore}% match</span>`
        : '';

    card.innerHTML = `
        <div class="item-card-header">
            <span class="item-type ${statusClass}">${statusText}</span>
            <span>${item.date}</span>
        </div>
        <div class="item-card-body">
            <span class="item-icon">${icon}</span>
            <div>
                <h3>${item.itemName}</h3>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                ${matchBadge}
            </div>
        </div>
        <a href="details.html?id=${item.id}" class="btn btn-outline">View Details</a>
    `;
    return card;
}

// ===== NAV AUTH UI =====
function setupAuthUI() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;
    const currentUser = getCurrentUser();
    if (currentUser) {
        navAuth.innerHTML = `
            <span style="color:#4b5563;">Signed in as ${currentUser.name}</span>
            <button class="btn btn-outline" id="logoutBtn" style="padding:0.4rem 0.8rem;">Logout</button>
        `;
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                clearCurrentUser();
                window.location.reload();
            });
        }
    } else {
        navAuth.innerHTML = `
            <button class="btn btn-outline" id="loginBtn">Login</button>
            <button class="btn btn-primary" id="signupBtn">Sign Up</button>
        `;
        document.getElementById('loginBtn')?.addEventListener('click', () => openAuthModal('login'));
        document.getElementById('signupBtn')?.addEventListener('click', () => openAuthModal('signup'));
    }
}

function updateNavAuth() {
    setupAuthUI();
}

// ===== HAMBURGER =====
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ===== AUTH MODAL =====
let authMode = 'login'; // 'login' or 'signup'

function openAuthModal(mode = 'login') {
    authMode = mode;
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.getElementById('authModalTitle').textContent = mode === 'login' ? 'Welcome Back' : 'Create Account';
    document.getElementById('authModalSubtitle').textContent = mode === 'login' ? 'Sign in to continue' : 'Join FindIt to report items';
    document.getElementById('authNameField').style.display = mode === 'signup' ? 'block' : 'none';
    document.getElementById('authSubmitBtn').textContent = mode === 'login' ? 'Sign In' : 'Sign Up';
    document.getElementById('authToggleText').innerHTML = mode === 'login' 
        ? 'New here? <a href="#" id="authToggleLink">Create an account</a>' 
        : 'Already have an account? <a href="#" id="authToggleLink">Sign in</a>';
    document.getElementById('authToggleLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        openAuthModal(mode === 'login' ? 'signup' : 'login');
    });
}

function setupAuthModal() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('authModalClose');
    const form = document.getElementById('authForm');
    if (!modal || !form) return;

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const name = document.getElementById('authName').value;

        let users = getUsers();
        if (authMode === 'signup') {
            // Check if user exists
            const existing = users.find(u => u.email === email);
            if (existing) {
                showToast('User already exists. Please login.');
                return;
            }
            const newUser = {
                id: 'user' + Date.now(),
                name: name || email.split('@')[0],
                email,
                password
            };
            users.push(newUser);
            setUsers(users);
            setCurrentUser(newUser);
            showToast('Account created successfully!');
            modal.style.display = 'none';
            updateNavAuth();
        } else {
            // login
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                setCurrentUser(user);
                showToast('Welcome back, ' + user.name + '!');
                modal.style.display = 'none';
                updateNavAuth();
            } else {
                showToast('Invalid credentials. Please try again.');
            }
        }
    });

    // Setup auth toggle link
    document.getElementById('authToggleLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        openAuthModal(authMode === 'login' ? 'signup' : 'login');
    });
}

// ===== TOAST =====
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== SMART MATCHING =====
function calculateMatchScore(lostItem, foundItem) {
    let score = 0;
    const totalWeight = 100;

    // Category match (20%)
    if (lostItem.category && foundItem.category && lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
        score += 20;
    }

    // Color match (20%)
    if (lostItem.color && foundItem.color && lostItem.color.toLowerCase() === foundItem.color.toLowerCase()) {
        score += 20;
    }

    // Location match (25%)
    if (lostItem.location && foundItem.location) {
        const loc1 = lostItem.location.toLowerCase();
        const loc2 = foundItem.location.toLowerCase();
        if (loc1 === loc2) {
            score += 25;
        } else if (loc1.includes(loc2) || loc2.includes(loc1)) {
            score += 15;
        }
    }

    // Date similarity (20%)
    if (lostItem.date && foundItem.date) {
        const date1 = new Date(lostItem.date);
        const date2 = new Date(foundItem.date);
        const diffDays = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) score += 20;
        else if (diffDays <= 3) score += 15;
        else if (diffDays <= 7) score += 10;
    }

    // Keyword similarity (15%) - compare item names and descriptions
    const text1 = (lostItem.itemName + ' ' + lostItem.description).toLowerCase();
    const text2 = (foundItem.itemName + ' ' + foundItem.description).toLowerCase();
    const words1 = text1.split(/\W+/).filter(w => w.length > 2);
    const words2 = text2.split(/\W+/).filter(w => w.length > 2);
    const common = words1.filter(w => words2.includes(w));
    if (common.length > 0) {
        score += Math.min(15, common.length * 3);
    }

    return Math.min(score, 100);
}

// Find potential matches for a given lost item among found items
function findMatchesForItem(lostItem, allItems) {
    const foundItems = allItems.filter(item => item.type === 'found' && item.status !== 'returned');
    const matches = [];
    foundItems.forEach(foundItem => {
        const score = calculateMatchScore(lostItem, foundItem);
        if (score >= 40) { // threshold
            matches.push({
                item: foundItem,
                score: score
            });
        }
    });
    matches.sort((a, b) => b.score - a.score);
    return matches;
}

// Update all match scores in the data (could be called periodically)
function updateAllMatchScores() {
    const items = getItems();
    const lostItems = items.filter(item => item.type === 'lost' && item.status !== 'returned');
    lostItems.forEach(lostItem => {
        const matches = findMatchesForItem(lostItem, items);
        if (matches.length > 0) {
            lostItem.bestMatch = matches[0].item.id;
            lostItem.matchScore = matches[0].score;
        } else {
            lostItem.bestMatch = null;
            lostItem.matchScore = null;
        }
    });
    setItems(items);
}