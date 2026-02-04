# How to View/Run the Diet To-Do Tracker App

## Prerequisites

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Install it (includes npm)
   - Restart your terminal after installation

2. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

## Running the App

### Step 1: Install Dependencies
Open terminal in the project folder and run:
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm start
```

This will:
- Start Expo development server
- Show a QR code
- Open browser at `http://localhost:19002` (Expo DevTools)

### Step 3: View on Your Device

#### 📱 **On Your Phone (Recommended)**

1. **Install Expo Go App:**
   - **iOS**: https://apps.apple.com/app/expo-go/id982107779
   - **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Scan QR Code:**
   - **iOS**: Open Camera app → Scan QR code → Tap notification
   - **Android**: Open Expo Go app → Tap "Scan QR code"

3. **Make sure your phone and computer are on the same WiFi network**

#### 💻 **On Your Computer**

- **iOS Simulator** (Mac only): Press `i` in terminal
- **Android Emulator**: Press `a` in terminal (requires Android Studio)
- **Web Browser**: Press `w` in terminal (limited functionality)

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### "Cannot connect to Expo"
- Make sure phone and computer are on same WiFi
- Try using tunnel mode: `npm start -- --tunnel`

### Port already in use
- Kill the process using port 19000
- Or use: `npx expo start --port 8081`

## Quick Commands

```bash
# Install dependencies
npm install

# Start app
npm start

# Start with tunnel (if same WiFi doesn't work)
npm start -- --tunnel

# Clear cache and restart
npm start -- --clear
```

## Viewing Online (Future)

To make it accessible via URL, you would need to:
1. Build the app: `expo build:web` or `expo build:android/ios`
2. Deploy to Expo hosting or other platforms
3. This requires additional setup and accounts

For now, the easiest way is to run it locally and use Expo Go on your phone!
