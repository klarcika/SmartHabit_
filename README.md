# 📱 SmartHabit

**SmartHabit** je progresivna spletna aplikacija (PWA) za sledenje navadam. Uporabnikom omogoča dodajanje, urejanje, iskanje in brisanje navad. Deluje tudi brez povezave – podatki se lokalno shranijo in ob ponovni povezavi samodejno sinhronizirajo z backend strežnikom.

---

## ✨ Funkcionalnosti

- ✅ Prikaz, dodajanje, urejanje in brisanje navad preko REST API-ja
- 🔍 Iskanje po seznamu navad
- 🔔 Obvestila o uspehu in napakah (vključno z obvestili operacijskega sistema)
- 🌐 Offline podpora (uporaba `localStorage`)
- 🔄 Samodejna sinhronizacija ob ponovni vzpostavitvi povezave
- ⌨️ Bližnjice s tipkovnico:
  - `Ctrl + N` – odpri obrazec za novo navado
  - `Ctrl + F` – fokus na iskalnik
- 🖼️ Leno nalaganje slik (`lazy loading`)
- 💾 Service Worker za predpomnitev statičnih datotek
- 📲 Manifest z ikonami in nastavitvami PWA

---

## 📁 Struktura projekta
```bash
📁 frontend/
│
├── index.html
├── components/
│ ├── home.html
│ └── user.html
├── js/
│ ├── main.js
│ ├── offline-sync.js
│ ├── notifications.js
│ ├── recommendations.js
│ └── user.js
├── css/
│ └── style.css
├── icons/
│ ├── icon.jpg
│ ├── baloon.jpg
│ ├── flower.jpg
│ └── balorangeoon.jpg
├── manifest.json
└── serviceWorker.js
```
------

## 🛠️ Zagon aplikacije

### 1. Backend (npr. z json-server)

```bash
json-server --watch db.json --port 3001
```
### 2. Frontend (npr. Live server ali http server)
```bash
npx http-server . -p 5500
```
### Odpri aplikacijo v brskalniku
```bash
http://localhost:5500/pages/home.html
```
## 🌐 Progressive Web App
- Manifest (manifest.json) vsebuje vse potrebne podatke o aplikaciji
- Ikone za namestitev na napravo
- Aplikacija se lahko doda na začetni zaslon (mobilni ali namizni sistem)
- Service Worker predpomni pomembne statične datoteke za delovanje brez povezave

## 📦 Delovanje brez povezave
- Če ni povezave z internetom, se navade shranijo v localStorage
- Ob ponovni vzpostavitvi povezave se podatki avtomatsko pošljejo na backend

## 🔔 Obvestila
- Aplikacija uporablja Notification API
- Sistem prikaže obvestila o uspešnih/napak operacijah (če ima dovoljenje)

## 📌 TODO (opcijsko)
 - Dodajanje potisnih obvestil (push notifications) prek service workerja in ustreznih API endpointov
 - Bolj napredna validacija obrazcev
 - Povezava z IndexedDB (namesto localStorage)

## 🧪 Tehnologije
- HTML, CSS, JavaScript (vanilla)
- REST API (json-server)
- localStorage
- Service Worker
- Manifest (PWA)
- Browser Notifications
### Avtorji
...
Projekt za: Spletne tehnologije – šolsko leto 2024/25
Klara Kirbiš, Elena Ugwoegbulam Bežan, Vivien Štampfer
