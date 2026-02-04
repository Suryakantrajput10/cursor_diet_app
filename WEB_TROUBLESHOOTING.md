# Web Preview Troubleshooting Guide

## Current Status
✅ Node.js installed (v24.13.0)
✅ Dependencies installed
✅ Webpack bundler configured
🔄 Server starting...

## Method 1: Wait for Server (Current)

The server is starting. **Wait 1-2 minutes**, then:

1. **Check your terminal** for a message like:
   ```
   Web is waiting on http://localhost:19006
   ```

2. **Copy that exact URL** and paste in your browser

3. **If browser doesn't open automatically**, manually open:
   - Chrome/Edge: `http://localhost:19006`
   - Or check terminal for the exact port number

## Method 2: Build Static Files (Alternative)

If the dev server doesn't work, build static files:

```powershell
# Build static web files
npx expo export:web

# This creates a 'web-build' folder
# Then install a simple server
npm install -g http-server

# Serve the files
http-server web-build -p 3000 -o
```

Then open: `http://localhost:3000`

## Method 3: Use Python Server (If you have Python)

```powershell
# Build first
npx expo export:web

# Then serve (Python 3)
cd web-build
python -m http.server 3000
```

Open: `http://localhost:3000`

## Method 4: Check Terminal Output

**Look for these messages:**

✅ **Good:**
- "Starting Metro Bundler"
- "Web is waiting on..."
- "Compiled successfully"

❌ **Bad:**
- Red error messages
- "Port already in use"
- "Cannot find module"

## Common Issues & Fixes

### Issue: "Port already in use"
**Fix:** Use different port
```powershell
npx expo start --web --port 3000
```

### Issue: "Cannot find module"
**Fix:** Reinstall dependencies
```powershell
rm -rf node_modules
npm install
```

### Issue: Blank page in browser
**Fix:** 
1. Check browser console (F12) for errors
2. Hard refresh: `Ctrl + F5`
3. Clear browser cache

### Issue: Server won't start
**Fix:** Clear cache and restart
```powershell
npx expo start --web --clear
```

## Quick Test Commands

```powershell
# Test if Node.js works
node --version

# Test if npm works  
npm --version

# Test if Expo works
npx expo --version

# Start web server
npx expo start --web

# Build static files
npx expo export:web
```

## What URL Should Work?

After server starts, you should see one of these:
- `http://localhost:19006` (most common)
- `http://localhost:8081`
- `http://localhost:3000` (if you specify port)

## Still Not Working?

**Please share:**
1. What command you ran
2. What error message appears (copy/paste from terminal)
3. What happens when you open the URL in browser

This will help me fix the exact issue!
