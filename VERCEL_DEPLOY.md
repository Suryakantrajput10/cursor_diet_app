# Deploy to Vercel - Step by Step Guide

## Prerequisites

1. **GitHub Account** (you already have this ✅)
2. **Vercel Account** - Sign up at https://vercel.com (free)

## Deployment Steps

### Step 1: Install Dependencies Locally (Optional - for testing)

```bash
npm install
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your GitHub repository**:
   - Select `Suryakantrajput10/cursor_diet_app`
   - Click "Import"
5. **Configure Project**:
   - Framework Preset: **Other** (or leave as default)
   - Root Directory: `./` (default)
   - Build Command: `npm run build:web`
   - Output Directory: `web-build`
   - Install Command: `npm install`
6. **Click "Deploy"**
7. **Wait for deployment** (2-5 minutes)
8. **Get your live URL** - Vercel will provide a URL like: `https://cursor-diet-app.vercel.app`

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **No** (first time)
   - Project name: `cursor-diet-app` (or your choice)
   - Directory: `./`
   - Override settings? **No**

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

## After Deployment

Your app will be live at: `https://your-project-name.vercel.app`

### Features Available on Web:
- ✅ Daily Diet Checklist
- ✅ Streak Tracking
- ✅ Water Intake Tracker
- ✅ History Calendar View
- ✅ Reports & Analytics
- ✅ Settings & Diet Plans
- ✅ Mood Tracking

### Limitations on Web:
- ⚠️ Notifications may not work (browser limitations)
- ⚠️ Some mobile-specific features may behave differently

## Updating Your App

Every time you push to GitHub, Vercel will automatically redeploy:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Vercel automatically builds and deploys the new version

## Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Make sure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18 by default)

### App Not Loading
- Check browser console for errors
- Verify `web-build` directory exists after build
- Check Vercel deployment logs

### Styles Not Working
- Clear browser cache
- Check if CSS is being loaded correctly

## Quick Commands Reference

```bash
# Test build locally
npm run build:web

# Deploy to Vercel (first time)
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls
```

## Support

- Vercel Docs: https://vercel.com/docs
- Expo Web: https://docs.expo.dev/workflow/web/
