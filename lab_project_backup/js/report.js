// report.js - Report item page functionality

document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to report an item.');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type === 'lost' || type === 'found') {
        document.getElementById(type + 'Radio').checked = true;
    }

    setupFormValidation();
    setupPhotoPreview();
    setupCharCounter();

    const form = document.getElementById('reportForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const user = getCurrentUser();
        if (!user) {
            showToast('Please login first.');
            return;
        }

        const reportType = document.querySelector('input[name="reportType"]:checked').value;
        const itemName = document.getElementById('itemName').value.trim();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();
        const location = document.getElementById('location').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const color = document.getElementById('color').value.trim();
        const brand = document.getElementById('brand').value.trim();
        const uniqueFeatures = document.getElementById('uniqueFeatures').value.trim();
        const photo = document.getElementById('photo').files[0];
        const contactPref = document.getElementById('contactPref').value;
        const identifiable = document.getElementById('identifiable').value.trim();

        const newItem = {
            id: 'item' + Date.now(),
            type: reportType,
            itemName,
            category,
            description,
            location,
            date,
            time,
            color,
            brand,
            uniqueFeatures,
            contactPref,
            identifiable,
            photo: photo ? photo.name : null,
            status: reportType,
            userId: user.id,
            createdAt: new Date().toISOString(),
            matchScore: null
        };

        const items = getItems();
        items.push(newItem);
        setItems(items);

        if (reportType === 'lost') {
            const matches = findMatchesForItem(newItem, items);
            if (matches.length > 0) {
                newItem.bestMatch = matches[0].item.id;
                newItem.matchScore = matches[0].score;
                const updatedItems = getItems();
                const idx = updatedItems.findIndex(i => i.id === newItem.id);
                if (idx !== -1) {
                    updatedItems[idx] = newItem;
                    setItems(updatedItems);
                }
                showToast(`Report submitted! We found a potential match (${matches[0].score}%).`);
            } else {
                showToast('Report submitted! We will notify you when a match is found.');
            }
        } else {
            showToast('Report submitted successfully!');
        }

        form.reset();
        document.getElementById('photoPreview').classList.remove('visible');
        document.getElementById('charCount').textContent = '0 / 500';
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    });
});

function setupFormValidation() {
    const requiredFields = ['itemName', 'category', 'description', 'location', 'date'];
    requiredFields.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('blur', () => validateField(id));
    });
}

function validateField(fieldId) {
    const el = document.getElementById(fieldId);
    const group = el.closest('.form-group');
    const errorEl = group.querySelector('.form-error');
    let isValid = true;
    let message = '';

    if (el.hasAttribute('required') && !el.value.trim()) {
        isValid = false;
        message = 'This field is required.';
    }

    if (fieldId === 'description' && el.value.length > 500) {
        isValid = false;
        message = 'Description must be 500 characters or less.';
    }

    group.classList.toggle('has-error', !isValid);
    if (errorEl) errorEl.textContent = message;

    return isValid;
}

function validateForm() {
    const fields = ['itemName', 'category', 'description', 'location', 'date'];
    return fields.every(id => validateField(id));
}

function setupPhotoPreview() {
    const photoInput = document.getElementById('photo');
    const preview = document.getElementById('photoPreview');

    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) {
            preview.classList.remove('visible');
            preview.src = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.add('visible');
        };
        reader.readAsDataURL(file);
    });
}

function setupCharCounter() {
    const textarea = document.getElementById('description');
    const counter = document.getElementById('charCount');

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / 500`;
        if (len > 500) {
            textarea.closest('.form-group').classList.add('has-error');
        } else {
            textarea.closest('.form-group').classList.remove('has-error');
        }
    });
}