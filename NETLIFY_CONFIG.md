# Netlify Deployment Configuration

## 🚀 You're at: <https://app.netlify.com/start/repos/rcsbivmc-hub%2Feye-n-me>

---

## ⚙️ BUILD SETTINGS (Enter these in Netlify)

**Base directory:**

```
(leave empty)
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

---

## 🔑 ENVIRONMENT VARIABLES (Critical!)

After clicking "Deploy site", immediately add this:

1. Go to: **Site settings** → **Environment variables** → **Add a variable**
2. Add:

   ```
   Key: GEMINI_API_KEY
   Value: AIzaSyCO9_eqIKBQDgM0k1hm78gwyMxQAotqZJI
   ```

3. **Click Save**
4. **Trigger a new deploy**: Deploys → Trigger deploy → Deploy site

---

## ✅ Deployment Steps

1. **Configure build settings** (see above)
2. **Click "Deploy [repository name]"**
3. **Wait for initial build** (~2-3 minutes)
4. **Add GEMINI_API_KEY** environment variable
5. **Redeploy** the site
6. **Test your PWA** at the provided Netlify URL

---

## 📱 After Deployment

You'll get a URL like:

- `https://your-site-name.netlify.app`

**Test:**

- Open URL on mobile → "Add to Home Screen"
- Test admin login with: <rcs.bivmc@gmail.com> / 042774
- Try creating an idea (voice or typed)
- Test the deep search feature

---

## 🔧 Advanced Settings (Optional)

**Custom Domain:**

- Site settings → Domain management → Add custom domain

**Build Hooks:**

- Site settings → Build & deploy → Build hooks

---

## ⚠️ Important Notes

- First build may fail if GEMINI_API_KEY is not set
- After adding env vars, ALWAYS redeploy
- PWA features only work on HTTPS (Netlify provides this automatically)
- Service worker only activates on production deployment

---

## 🆘 Troubleshooting

**Build fails?**

- Check build logs for errors
- Verify build command is `npm run build`
- Ensure publish directory is `dist`

**API calls fail?**

- Verify GEMINI_API_KEY is set correctly
- Check Functions deploy logs
- Redeploy after adding env vars

**PWA not installable?**

- Must be accessed via HTTPS
- Clear browser cache
- Check manifest.webmanifest loads correctly
