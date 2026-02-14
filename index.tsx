
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      console.log('New content available, refresh to update');
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    immediate: true,
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
