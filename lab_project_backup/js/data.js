// data.js - Sample data and localStorage management

const STORAGE_KEYS = {
    users: 'findit_users',
    items: 'findit_items',
    claims: 'findit_claims',
    currentUser: 'findit_current_user',
    dataVersion: 'findit_data_version'
};

const DATA_VERSION = '2';

function getSampleItems() {
    return [
        {
            id: 'item1',
            type: 'lost',
            itemName: 'Black Wallet',
            category: 'Accessories',
            description: 'Leather wallet with ID cards and some cash.',
            location: 'Library',
            date: '2026-09-05',
            time: '14:30',
            color: 'Black',
            brand: 'Fossil',
            uniqueFeatures: 'Scratch near the logo, contains a photo of family.',
            contactPref: 'email',
            identifiable: 'Contains a driver license with name "John Doe"',
            photo: null,
            status: 'lost',
            userId: 'user1',
            createdAt: new Date('2026-09-05T14:30:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item2',
            type: 'found',
            itemName: 'Black Wallet',
            category: 'Accessories',
            description: 'Found on a table near the entrance.',
            location: 'Library',
            date: '2026-09-05',
            time: '16:00',
            color: 'Black',
            brand: 'Fossil',
            uniqueFeatures: 'Has a scratch near the logo.',
            contactPref: 'message',
            identifiable: 'Contains multiple cards',
            photo: null,
            status: 'found',
            userId: 'user2',
            createdAt: new Date('2026-09-05T16:00:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item3',
            type: 'lost',
            itemName: 'Laptop Charger',
            category: 'Electronics',
            description: 'HP laptop charger, 65W, black color.',
            location: 'Academic Building',
            date: '2026-09-04',
            time: '10:00',
            color: 'Black',
            brand: 'HP',
            uniqueFeatures: 'Tape wrapped around the cable near the connector.',
            contactPref: 'email',
            identifiable: 'The tape is yellow',
            photo: null,
            status: 'lost',
            userId: 'user3',
            createdAt: new Date('2026-09-04T10:00:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item4',
            type: 'found',
            itemName: 'Casio Calculator',
            category: 'Electronics',
            description: 'Scientific calculator found in Lab.',
            location: 'Lab',
            date: '2026-09-04',
            time: '13:00',
            color: 'Black',
            brand: 'Casio',
            uniqueFeatures: 'Name sticker on back: "A. Rahman"',
            contactPref: 'message',
            identifiable: 'Sticker with name',
            photo: null,
            status: 'found',
            userId: 'user4',
            createdAt: new Date('2026-09-04T13:00:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item5',
            type: 'lost',
            itemName: 'ID Card',
            category: 'Documents',
            description: 'Student ID card lost near cafeteria.',
            location: 'Cafeteria',
            date: '2026-09-03',
            time: '12:30',
            color: 'White',
            brand: 'University',
            uniqueFeatures: 'Photo on card, name "Sarah Khan"',
            contactPref: 'email',
            identifiable: 'Student ID number 20231234',
            photo: null,
            status: 'returned',
            userId: 'user5',
            createdAt: new Date('2026-09-03T12:30:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item6',
            type: 'found',
            itemName: 'Blue Backpack',
            category: 'Bags',
            description: 'Nike backpack with laptop compartment, found near parking lot.',
            location: 'Parking',
            date: '2026-09-06',
            time: '09:15',
            color: 'Blue',
            brand: 'Nike',
            uniqueFeatures: 'Keychain with a red car charm attached.',
            contactPref: 'email',
            identifiable: 'Name tag inside says "Mike"',
            photo: null,
            status: 'found',
            userId: 'user1',
            createdAt: new Date('2026-09-06T09:15:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item7',
            type: 'lost',
            itemName: 'Blue Backpack',
            category: 'Bags',
            description: 'Lost my Nike backpack with textbooks inside.',
            location: 'Parking',
            date: '2026-09-06',
            time: '08:00',
            color: 'Blue',
            brand: 'Nike',
            uniqueFeatures: 'Red car keychain on zipper.',
            contactPref: 'message',
            identifiable: 'Has a calculus textbook inside',
            photo: null,
            status: 'lost',
            userId: 'user3',
            createdAt: new Date('2026-09-06T08:00:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item8',
            type: 'found',
            itemName: 'Car Keys',
            category: 'Keys',
            description: 'Set of car keys with a Toyota key fob found in cafeteria.',
            location: 'Cafeteria',
            date: '2026-09-07',
            time: '11:45',
            color: 'Silver',
            brand: 'Toyota',
            uniqueFeatures: 'Blue lanyard with university logo.',
            contactPref: 'email',
            identifiable: 'Three keys on ring, one is a house key',
            photo: null,
            status: 'returned',
            userId: 'user2',
            createdAt: new Date('2026-09-07T11:45:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item9',
            type: 'lost',
            itemName: 'AirPods Case',
            category: 'Electronics',
            description: 'White AirPods Pro case, no earbuds inside.',
            location: 'Library',
            date: '2026-09-08',
            time: '15:20',
            color: 'White',
            brand: 'Apple',
            uniqueFeatures: 'Small dent on the corner.',
            contactPref: 'message',
            identifiable: 'Engraved initials "JD" inside',
            photo: null,
            status: 'returned',
            userId: 'user1',
            createdAt: new Date('2026-09-08T15:20:00').toISOString(),
            matchScore: null
        },
        {
            id: 'item10',
            type: 'found',
            itemName: 'USB Flash Drive',
            category: 'Electronics',
            description: '32GB SanDisk USB drive found in computer lab.',
            location: 'Lab',
            date: '2026-09-09',
            time: '16:30',
            color: 'Red',
            brand: 'SanDisk',
            uniqueFeatures: 'Has a sticker with a cat drawing.',
            contactPref: 'email',
            identifiable: 'Folder named "Thesis Draft" on drive',
            photo: null,
            status: 'found',
            userId: 'user4',
            createdAt: new Date('2026-09-09T16:30:00').toISOString(),
            matchScore: null
        }
    ];
}

function getSampleUsers() {
    return [
        { id: 'user1', name: 'John Doe', email: 'john@campus.edu', password: 'password' },
        { id: 'user2', name: 'Jane Smith', email: 'jane@campus.edu', password: 'password' },
        { id: 'user3', name: 'Ali Khan', email: 'ali@campus.edu', password: 'password' },
        { id: 'user4', name: 'Sara Lee', email: 'sara@campus.edu', password: 'password' },
        { id: 'user5', name: 'Sarah Khan', email: 'sarah@campus.edu', password: 'password' }
    ];
}

function getSampleClaims() {
    return [
        {
            id: 'claim1',
            itemId: 'item6',
            claimantId: 'user3',
            claimDate: new Date('2026-09-06T14:00:00').toISOString(),
            status: 'pending',
            verificationAnswers: { brand: 'Nike', feature: 'red car keychain' }
        },
        {
            id: 'claim2',
            itemId: 'item2',
            claimantId: 'user5',
            claimDate: new Date('2026-09-05T18:00:00').toISOString(),
            status: 'approved',
            verificationAnswers: { brand: 'Fossil', feature: 'scratch' }
        }
    ];
}

function initializeData() {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.dataVersion);
    if (storedVersion !== DATA_VERSION) {
        localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(getSampleItems()));
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(getSampleUsers()));
        localStorage.setItem(STORAGE_KEYS.claims, JSON.stringify(getSampleClaims()));
        localStorage.setItem(STORAGE_KEYS.dataVersion, DATA_VERSION);
        return;
    }

    if (!localStorage.getItem(STORAGE_KEYS.items)) {
        localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(getSampleItems()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.users)) {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(getSampleUsers()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.claims)) {
        localStorage.setItem(STORAGE_KEYS.claims, JSON.stringify(getSampleClaims()));
    }
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getItems() {
    return getData(STORAGE_KEYS.items);
}

function setItems(items) {
    setData(STORAGE_KEYS.items, items);
}

function getUsers() {
    return getData(STORAGE_KEYS.users);
}

function setUsers(users) {
    setData(STORAGE_KEYS.users, users);
}

function getClaims() {
    return getData(STORAGE_KEYS.claims);
}

function setClaims(claims) {
    setData(STORAGE_KEYS.claims, claims);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.currentUser));
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
}