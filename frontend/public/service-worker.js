import { precacheAndRoute } from 'workbox-precaching';
import { openDB } from 'idb';

// Predpomni vire
precacheAndRoute(self.__WB_MANIFEST);

// IndexedDB setup
const DB_NAME = 'habit-tracker-db';
const STORE_NAME = 'queued-requests';
const VERSION = 1;

async function initDB() {
    return openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
}

async function getQueuedRequests() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
}

async function clearQueuedRequest(id) {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
}

// Počisti stare predpomnilnike
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== 'habit-tracker-cache-v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Upravljaj zahteve
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ message: 'Offline, request queued' }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Sinhronizacija
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-habits') {
        event.waitUntil(syncRequests());
    }
});

async function syncRequests() {
    const token = 'placeholder-token'; // To moraš prilagoditi
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