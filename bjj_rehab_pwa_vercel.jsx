// Ready-to-deploy Vite + PWA + SPA for Pixel 7a

// ===========================
// Step 1: package.json
// ===========================
{
  "name": "bjj-rehab-companion",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^3.1.0"
  },
  "engines": {
    "node": "20.x"
  }
}

// ===========================
// Step 2: vite.config.js
// ===========================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './'
});

// ===========================
// Step 3: vercel.json (for SPA routing)
// ===========================
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

// ===========================
// Step 4: public/manifest.json
// ===========================
{
  "name": "BJJ Joint Longevity Rehab",
  "short_name": "BJJ Rehab",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f9fafb",
  "theme_color": "#111827",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

// ===========================
// Step 5: public/service-worker.js
// ===========================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("bjj-rehab-cache").then((cache) => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ===========================
// Step 6: src/main.jsx
// ===========================
import React from 'react';
import ReactDOM from 'react-dom/client';
import BJJRehabCompanion from './BJJRehabCompanion.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BJJRehabCompanion />
  </React.StrictMode>
);

// ===========================
// Step 7: Deployment Steps
// ===========================
// 1. Push this folder to GitHub
// 2. Go to https://vercel.com → New Project → Import GitHub repo
// 3. Build Command: npm run build
// 4. Output Directory: dist
// 5. Deploy
// 6. Open URL in Chrome → Install app on Pixel 7a