# How to Preview Your App Locally (Before Vercel Deployment)

## Step 1: Install Node.js (Required)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Choose Windows Installer (.msi)

2. **Install Node.js:**
   - Run the downloaded installer
   - Click "Next" through the installation
   - Make sure "Add to PATH" is checked (should be by default)
   - Click "Install"
   - **Restart your computer or terminal** after installation

3. **Verify Installation:**
   Open a NEW terminal/command prompt and run:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0 and 9.6.7)

## Step 2: Install Project Dependencies

Open terminal in your project folder (`diet_todo_list`) and run:

```bash
npm install
```

This will install all required packages. Wait for it to complete (may take 2-5 minutes).

## Step 3: Start the Web Preview

Run this command:

```bash
npm run web
```

OR

```bash
npx expo start --web
```

## Step 4: View in Browser

After running the command:

1. **Wait for compilation** (30-60 seconds)
2. **Your browser will automatically open** to:
   ```
   http://localhost:19006
   ```
   OR
   ```
   http://localhost:8081
   ```

3. **If browser doesn't open automatically:**
   - Look at the terminal output
   - You'll see a message like: "Web is waiting on http://localhost:19006"
   - Copy that URL and paste it in your browser

## What You'll See

- ✅ Full app interface
- ✅ All features working (checklist, streaks, calendar, etc.)
- ✅ Responsive design (works on desktop/tablet/mobile view)

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Restart terminal after installing Node.js
- Or restart your computer

### Port already in use
- Close other applications using port 19006 or 8081
- Or run: `npx expo start --web --port 3000`

### Build errors
- Make sure you're in the project folder
- Try: `npm install` again
- Check if all files are present

### Browser shows blank page
- Wait for compilation to finish (check terminal)
- Hard refresh: `Ctrl + F5` or `Ctrl + Shift + R`
- Check browser console for errors (F12)

## Quick Commands Reference

```bash
# Install dependencies (first time only)
npm install

# Start web preview
npm run web

# Or use Expo directly
npx expo start --web

# Stop the server
Press Ctrl + C in the terminal
```

## Alternative: Use Expo Go on Phone

If you want to see it on your phone instead:

1. Install **Expo Go** app on your phone
2. Run: `npm start` (instead of `npm run web`)
3. Scan the QR code with Expo Go app
4. Make sure phone and computer are on same WiFi

## Next Steps

Once you've previewed and are happy with how it looks:
1. Deploy to Vercel (see VERCEL_DEPLOY.md)
2. Get a public URL to share with others
