# IdeaFlow - Mobile PWA Setup Guide

## 📱 App Overview

IdeaFlow is now a **Progressive Web App (PWA)** that can be installed on mobile devices and works offline!

### ✨ New Features

- 📲 **Installable**: Add to home screen on mobile/desktop
- 🔒 **Secure**: API keys protected server-side via Netlify Functions
- ⚡ **Fast**: Optimized bundle size (243KB → 72KB gzipped)
- 📴 **Offline**: Works without internet connection for cached content
- 🔄 **Auto-update**: Automatically notifies users of new versions

---

## 🚀 Deployment Instructions

### 1. Set Environment Variables in Netlify

Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**

Add the following variable:

```
GEMINI_API_KEY = your_actual_gemini_api_key_here
```

> ⚠️ **IMPORTANT**: The API key should ONLY be set in Netlify, NOT in your .env.local file in version control.

### 2. Deploy to Netlify

```bash
# Push changes to GitHub
git add .
git commit -m "Add PWA capabilities and mobile optimizations"
git push

# Netlify will automatically build and deploy
```

### 3. Test PWA Installation

**On Mobile (Chrome/Edge):**

1. Open your deployed app URL
2. Look for "Add to Home Screen" prompt
3. Or tap browser menu → "Install app"
4. Icon appears on home screen like a native app!

**On Desktop (Chrome/Edge):**

1. Look for install icon in address bar
2. Click to install
3. App opens in standalone window

---

## 🛠️ Local Development

### Setup

```bash
# Install dependencies
npm install

# Set your API key in .env.local (DO NOT COMMIT)
# Copy from .env.example and add your key
GEMINI_API_KEY=your_key_here

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing PWA Features Locally

1. **Build the app**: `npm run build`
2. **Serve locally**: `npm run preview`
3. **Open**: <http://localhost:4173>
4. **Test offline**:
   - Open Chrome DevTools → Application → Service Workers
   - Check "Offline" checkbox
   - Reload page - should still work!

---

## 📦 What Was Changed

### Security ✅

- ✅ Moved Gemini API calls to Netlify serverless functions
- ✅ API key now only exists server-side
- ✅ Added security headers (X-Frame-Options, CSP, etc.)
- ✅ Created `.env.example` template

### PWA Features ✅

- ✅ Created `manifest.webmanifest` for installability
- ✅ Implemented service worker with offline caching
- ✅ Added install prompt component
- ✅ Added update notification component
- ✅ Created offline fallback page

### Performance ✅

- ✅ Code splitting (React, icons, PayPal in separate chunks)
- ✅ Optimized caching strategies
- ✅ Reduced bundle size by 15% (283KB → 243KB)
- ✅ Added resource preconnect hints

### Mobile UX ✅

- ✅ iOS meta tags for proper display
- ✅ Theme color for mobile browsers
- ✅ Touch-optimized viewport settings
- ✅ Install prompts for better discoverability

---

## 📋 Icon Setup (TODO for Production)

The app currently uses SVG placeholders for icons. For production, you should:

1. **Create proper PNG icons** (192x192 and 512x512)
2. **Update paths** in:
   - `public/manifest.webmanifest`
   - `index.html` (favicon and apple-touch-icon)

**Recommended tool**: [PWA Asset Generator](https://www.npmjs.com/package/pwa-asset-generator)

```bash
npx pwa-asset-generator logo.svg ./public/icons
```

---

## 🔍 Testing Checklist

- [ ] App installs on mobile device
- [ ] Works offline after first load
- [ ] Update prompt appears when new version deployed
- [ ] Install prompt shows for new users
- [ ] API calls work (enhance idea, web search)
- [ ] No API key in client bundle
- [ ] PayPal integration still works
- [ ] Voice recording works on mobile
- [ ] All tabs/features functional

---

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
