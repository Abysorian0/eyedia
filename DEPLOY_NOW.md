# 🚀 COMPLETE THIS IN NETLIFY NOW

You're at: <https://app.netlify.com/start/repos/rcsbivmc-hub%2Feye-n-me>

---

## STEP 1: Configure Build Settings

On the Netlify page, fill in these **EXACT** values:

### Site settings

**Site name:** (choose any name, like `ideaflow-app` or leave auto-generated)

### Build settings

**Branch to deploy:**  

```
main
```

**Base directory:**  

```
(Leave this EMPTY)
```

**Build command:**  

```
npm run build
```

**Publish directory:**  

```
dist
```

**Functions directory:**  

```
netlify/functions
```

### Click "Deploy site" button

---

## STEP 2: Add Environment Variable (CRITICAL!)

⚠️ **Without this, the app will NOT work!**

After the first deploy completes:

1. In your deployed site, go to **Site settings** (in left sidebar)
2. Click **Environment variables** (in left sidebar)
3. Click **Add a variable** button
4. Enter:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyCO9_eqIKBQDgM0k1hm78gwyMxQAotqZJI`
   - **Scopes:** Check "Same value for all deploy contexts"
5. Click **Create variable**

---

## STEP 3: Redeploy

After adding the environment variable:

1. Go to **Deploys** tab (top navigation)
2. Click **Trigger deploy** button (top right)
3. Select **Deploy site**
4. Wait for build to complete (~2-3 minutes)

---

## ✅ YOU'RE DONE

Your app will be live at:
`https://[your-site-name].netlify.app`

**Test it:**

- ✅ Open on mobile → "Add to Home Screen"
- ✅ Login with: <rcs.bivmc@gmail.com> / 042774
- ✅ Create an idea (voice or typed)
- ✅ Test deep search feature (Pro users only)

---

## 📱 For Google Play (Next Step)

After confirming the PWA works, we can package it for Play Store using:

- **Trusted Web Activity (TWA)** via Bubblewrap
- This wraps your PWA into an Android app (.apk)
- Can be uploaded to Google Play Store

Let me know when the Netlify deployment is complete!
