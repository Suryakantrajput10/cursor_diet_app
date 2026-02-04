# How to Start Web Server - Step by Step

## Quick Fix - Try This First

1. **Open a NEW PowerShell window** (close the old one)

2. **Navigate to project folder:**
   ```powershell
   cd C:\Users\Lenovo\Downloads\diet_todo_list
   ```

3. **Start the server:**
   ```powershell
   npx expo start --web
   ```

4. **Wait for compilation** (30-60 seconds)

5. **Look for this message in terminal:**
   ```
   Web is waiting on http://localhost:19006
   ```
   OR
   ```
   Metro waiting on exp://192.168.x.x:8081
   ```

6. **Copy the URL** and paste in browser

## If That Doesn't Work

### Option 1: Use Different Port
```powershell
npx expo start --web --port 3000
```
Then open: `http://localhost:3000`

### Option 2: Clear Cache and Start
```powershell
npx expo start --web --clear
```

### Option 3: Check for Errors
Look at the terminal output for any error messages in red. Common issues:
- Port already in use
- Missing dependencies
- Compilation errors

## What to Look For in Terminal

**Good signs:**
- ✅ "Starting Metro Bundler"
- ✅ "Web is waiting on http://localhost:XXXX"
- ✅ No red error messages

**Bad signs:**
- ❌ Red error messages
- ❌ "Port XXXX is already in use"
- ❌ "Cannot find module"

## Alternative: Build Static Files

If the dev server doesn't work, try building static files:

```powershell
npx expo export:web
```

This creates a `web-build` folder. Then you can:
1. Install a simple HTTP server: `npm install -g http-server`
2. Run: `http-server web-build -p 3000`
3. Open: `http://localhost:3000`

## Still Not Working?

Share the exact error message from the terminal, and I'll help fix it!
