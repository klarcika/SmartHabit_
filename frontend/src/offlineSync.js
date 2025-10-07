import { openDB } from 'idb';

const DB_NAME = 'habit-tracker-db';
const STORE_NAME = 'queued-requests';
const VERSION = 1;

// Initialize IndexedDB
async function initDB() {
    return openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
}

// Queue a request when offline
async function queueRequest(requestData) {
    const db = await initDB();
    await db.add(STORE_NAME, requestData);
}

// Get all queued requests
async function getQueuedRequests() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
}

// Clear a queued request after syncing
async function clearQueuedRequest(id) {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
}

// Sync queued requests with the backend
async function syncRequests(getToken) {
    const token = await getToken();
    const queuedRequests = await getQueuedRequests();

    for (const request of queuedRequests) {
        try {
            if (request.method === 'POST') {
                await fetch(request.url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request.body),
                });
            } else if (request.method === 'PUT') {
                await fetch(request.url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request.body),
                });
            } else if (request.method === 'DELETE') {
                await fetch(request.url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
            await clearQueuedRequest(request.id);
        } catch (error) {
            console.error('Failed to sync request:', error);
            break;
        }
    }
}

export { queueRequest, syncRequests };