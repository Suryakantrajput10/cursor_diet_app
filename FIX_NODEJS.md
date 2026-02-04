# Fix: Node.js Not Recognized After Installation

## Quick Fix (Most Common)

**Close and reopen your PowerShell/terminal window**, then try again.

The terminal needs to be restarted to recognize the newly installed Node.js.

## Step-by-Step Fix

### Option 1: Restart Terminal (Easiest)

1. **Close this PowerShell window completely**
2. **Open a NEW PowerShell window**
3. Navigate to your project:
   ```powershell
   cd C:\Users\Lenovo\Downloads\diet_todo_list
   ```
4. **Verify Node.js is working:**
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0 and 9.6.7)

### Option 2: Refresh PATH in Current Terminal

If you don't want to close the terminal, refresh the PATH:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then verify:
```powershell
node --version
npm --version
```

### Option 3: Check Node.js Installation

1. **Check if Node.js is installed:**
   - Press `Win + R`
   - Type: `C:\Program Files\nodejs\`
   - Press Enter
   - You should see `node.exe` and `npm.cmd` files

2. **If Node.js folder doesn't exist:**
   - Reinstall Node.js from https://nodejs.org/
   - Make sure to check "Add to PATH" during installation

3. **If Node.js folder exists but still not working:**
   - Manually add to PATH (see Option 4)

### Option 4: Manually Add to PATH (Advanced)

1. **Find Node.js installation path** (usually `C:\Program Files\nodejs\`)

2. **Add to PATH:**
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\nodejs\`
   - Click OK on all windows
   - **Restart PowerShell**

## After Node.js is Working

Once `node --version` and `npm --version` work, proceed with:

```powershell
# Navigate to project folder
cd C:\Users\Lenovo\Downloads\diet_todo_list

# Install dependencies
npm install

# Start web preview
npm run web
```

Then open: `http://localhost:19006` in your browser

## Still Not Working?

1. **Restart your computer** (sometimes required)
2. **Reinstall Node.js** and make sure "Add to PATH" is checked
3. **Check Node.js installation:**
   - Go to: `C:\Program Files\nodejs\`
   - If folder doesn't exist, installation failed
   - Reinstall from https://nodejs.org/
