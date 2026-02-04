# Debug Blank Page Issue

## What to Check

### 1. Open Browser Console (F12)
Press F12 in your browser and check the Console tab for any red error messages.

Common errors you might see:
- `Cannot find module`
- `React is not defined`
- `NavigationContainer` errors
- `AsyncStorage` errors

### 2. Check Network Tab
In browser DevTools (F12), go to Network tab and refresh the page. Look for:
- Failed requests (red)
- Missing JavaScript files
- 404 errors

### 3. Check if Files Are Loading
Look for these files loading:
- `index.html`
- `main.js` or `bundle.js`
- `_expo/static/js/...`

## Quick Fixes to Try

### Fix 1: Hard Refresh
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check Vercel Build Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on the latest deployment
5. Check "Build Logs" for any errors

## Common Causes

1. **JavaScript Errors**: Check browser console (F12)
2. **Missing Dependencies**: Check build logs
3. **React Native Web Compatibility**: Some RN components don't work on web
4. **AsyncStorage Issues**: Web uses localStorage, might need polyfill
5. **Navigation Issues**: React Navigation might need web-specific config

## Share Error Details

If you see errors in the console, please share:
1. The exact error message
2. Which file it's coming from
3. Screenshot of the console

This will help me fix the exact issue!
