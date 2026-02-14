# Netlify Deployment Steps

## ✅ Step 1: GitHub Push - COMPLETE

Your code is now on GitHub: <https://github.com/Abysorian0/eyedia>

---

## 🚀 Step 2: Deploy to Netlify

### Option A: Automatic Setup (Recommended)

1. **Go to Netlify**: <https://app.netlify.com>
2. **Sign up/Login** with your GitHub account (rcsbivmc-hub)
3. **Click "Add new site"** → "Import an existing project"
4. **Connect to GitHub** and select: `Abysorian0/eyedia`
5. **Build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Click "Deploy"**

### Option B: Manual Deploy (Quick Test)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

---

## ⚙️ Step 3: Set Environment Variables

**CRITICAL:** After deployment, you MUST add your API key:

1. Go to **Site Settings** → **Environment Variables**
2. Click **Add a variable**
3. Add this:

   ```
   Key: GEMINI_API_KEY
   Value: AIzaSyCO9_eqIKBQDgM0k1hm78gwyMxQAotqZJI
   ```

4. Click **Save**
5. Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## 📱 Step 4: Test Your PWA

After deployment completes, you'll get a URL like:
`https://your-app-name.netlify.app`

**Test Installation:**

- **Mobile**: Open URL → "Add to Home Screen"
- **Desktop**: Look for install icon in browser

---

## 🎯 App Admin Credentials

**For your app's admin panel:**

- Email: <rcs.bivmc@gmail.com>
- Password: 042774

These credentials are for:

- Logging into the IdeaFlow app
- Accessing admin features
- Managing users

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [ ] Netlify site created
- [ ] GEMINI_API_KEY environment variable set
- [ ] Site redeployed after adding env var
- [ ] PWA tested on mobile
- [ ] Admin access verified

---

## 🆘 Need Help?

If you need me to walk you through any step, just let me know!
