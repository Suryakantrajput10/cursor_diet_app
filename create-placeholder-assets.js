// Script to create minimal placeholder assets for Vercel build
const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a minimal 1x1 pixel PNG favicon
// This is a valid PNG file (base64 encoded minimal PNG)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Create favicon.png
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), minimalPNG);
console.log('Created placeholder favicon.png');
