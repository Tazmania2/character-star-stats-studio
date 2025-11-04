# Deployment Guide - Vercel

This guide walks you through deploying Character Star Stats Studio to Vercel via GitHub.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Git installed locally
- Your code pushed to a GitHub repository

## Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git repository (if not already done)
cd character-star-stats-studio
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Character Star Stats Studio"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 2: Connect Vercel to GitHub

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository from the list
   - If you don't see it, click **"Adjust GitHub App Permissions"** to grant access

## Step 3: Configure Project Settings

Vercel will auto-detect the Vite framework. Verify these settings:

### Build & Development Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Root Directory
- Leave as `.` (root) or set to `character-star-stats-studio` if it's in a subdirectory

### Node.js Version
- **Node.js Version**: 18.x or higher (recommended: 20.x)

## Step 4: Environment Variables (Optional)

If you want to set a default API URL, add environment variables:

1. In the Vercel project settings, go to **"Environment Variables"**
2. Add variables if needed:
   - `VITE_API_URL` = `https://service2.funifier.com` (optional)

**Note**: The app handles authentication at runtime, so no sensitive tokens should be stored in environment variables.

## Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build the project
   - Deploy to a production URL
3. Wait for deployment to complete (usually 1-2 minutes)

## Step 6: Access Your Deployment

Once deployed, you'll get:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: Automatic for each pull request
- **Custom Domain**: Optional (configure in project settings)

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

## Custom Domain (Optional)

To use your own domain:

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your domain (e.g., `stats.yourdomain.com`)
4. Follow the DNS configuration instructions
5. Vercel will automatically provision SSL certificates

## Vercel Configuration

The `vercel.json` file in the project root configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

The `rewrites` section ensures client-side routing works correctly.

## Build Optimization

The production build is automatically optimized:
- ✅ Minified JavaScript and CSS
- ✅ Tree-shaking to remove unused code
- ✅ Code splitting for faster loading
- ✅ Asset optimization (images, fonts)
- ✅ Gzip compression
- ✅ CDN distribution worldwide

## Monitoring and Analytics

### Vercel Analytics (Optional)

Enable analytics to track:
- Page views
- User interactions
- Performance metrics
- Core Web Vitals

To enable:
1. Go to project settings → **"Analytics"**
2. Click **"Enable Analytics"**
3. Add the analytics script (Vercel provides instructions)

### Vercel Speed Insights (Optional)

Track real-world performance:
1. Install the package:
```bash
npm install @vercel/speed-insights
```

2. Add to your app:
```typescript
// src/main.tsx
import { SpeedInsights } from '@vercel/speed-insights/react';

// Add to your root component
<SpeedInsights />
```

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard:
- Look for TypeScript errors
- Check for missing dependencies
- Verify Node.js version compatibility

**Common fixes:**
```bash
# Locally test the build
npm run build

# Check for type errors
npm run lint
```

### 404 Errors on Refresh

If you get 404 errors when refreshing pages:
- Verify `vercel.json` has the rewrites configuration
- Check that the file is in the project root

### Slow Build Times

To speed up builds:
- Enable Vercel's build cache (automatic)
- Optimize dependencies
- Use `npm ci` instead of `npm install` (Vercel does this automatically)

### API Connection Issues

If the app can't connect to Funifier API:
- Check CORS settings on the API server
- Verify the API URL is correct
- Ensure the bearer token is valid
- Check browser console for errors

## Rollback

To rollback to a previous deployment:
1. Go to **"Deployments"** in Vercel dashboard
2. Find the working deployment
3. Click **"..."** → **"Promote to Production"**

## CI/CD Integration

Vercel automatically provides CI/CD:
- ✅ Automatic builds on push
- ✅ Preview deployments for PRs
- ✅ Instant rollbacks
- ✅ Zero-downtime deployments

## Security Best Practices

1. **Never commit sensitive data**
   - Bearer tokens are entered at runtime
   - No API keys in code or environment variables

2. **Use HTTPS only**
   - Vercel provides automatic SSL
   - Enforce HTTPS in production

3. **Enable security headers**
   - Add to `vercel.json` if needed:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

## Performance Tips

1. **Enable caching** - Vercel automatically caches static assets
2. **Use CDN** - Vercel's Edge Network is enabled by default
3. **Optimize images** - Use WebP format when possible
4. **Lazy load components** - Already implemented with React.lazy
5. **Monitor Core Web Vitals** - Use Vercel Speed Insights

## Cost

Vercel offers:
- **Free tier**: Perfect for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic SSL
  - Preview deployments

- **Pro tier**: For production apps
  - More bandwidth
  - Advanced analytics
  - Team collaboration
  - Priority support

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions

## Next Steps

After deployment:
1. ✅ Test the production URL
2. ✅ Verify authentication works
3. ✅ Test all features (create areas, levels, evaluate players)
4. ✅ Share the URL with your team
5. ✅ Set up a custom domain (optional)
6. ✅ Enable analytics (optional)

---

**Congratulations!** 🎉 Your Character Star Stats Studio is now live on Vercel!
