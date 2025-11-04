# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved (`npm run lint`)
- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in development
- [ ] All components render correctly
- [ ] Forms validate properly

### Testing
- [ ] Test authentication flow
- [ ] Test area creation and deletion
- [ ] Test level creation and deletion
- [ ] Test player evaluation
- [ ] Test import/export functionality
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test with slow network connection

### Configuration
- [ ] Update `package.json` with correct repository URL
- [ ] Update `package.json` with correct author information
- [ ] Verify `vercel.json` configuration
- [ ] Check `.gitignore` excludes sensitive files
- [ ] Review `.vercelignore` for deployment optimization

### Documentation
- [ ] README.md is up to date
- [ ] API_INTEGRATION.md is accurate
- [ ] QUICKSTART.md is clear
- [ ] DEPLOYMENT.md has correct instructions
- [ ] All placeholder URLs are updated

### Security
- [ ] No API tokens or secrets in code
- [ ] No sensitive data in environment variables
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] CORS configured correctly on API server
- [ ] Authentication flow is secure

## GitHub Setup

### Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or accessible to Vercel
- [ ] Branch protection rules set (optional)
- [ ] README displays correctly on GitHub

### GitHub Actions (Optional)
- [ ] CI workflow configured (`.github/workflows/ci.yml`)
- [ ] Workflow runs successfully
- [ ] Build artifacts generated

## Vercel Setup

### Project Configuration
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Root directory: `character-star-stats-studio` (or `.` if at root)
- [ ] Node.js version: 20.x

### Environment Variables
- [ ] No sensitive variables needed (authentication is runtime)
- [ ] Optional: `VITE_API_URL` set if needed

### Domain Configuration (Optional)
- [ ] Custom domain added
- [ ] DNS configured
- [ ] SSL certificate provisioned

## First Deployment

### Deploy
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Deployment successful

### Verification
- [ ] Visit production URL
- [ ] Test authentication with real API
- [ ] Create a test area
- [ ] Create test levels
- [ ] Test player evaluation
- [ ] Test import/export
- [ ] Check responsive design on mobile
- [ ] Verify all links work
- [ ] Check browser console for errors

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No layout shift (CLS)
- [ ] Interactive quickly (FID)
- [ ] Images load properly
- [ ] Fonts render correctly

## Post-Deployment

### Monitoring
- [ ] Enable Vercel Analytics (optional)
- [ ] Enable Speed Insights (optional)
- [ ] Set up error tracking (optional)
- [ ] Monitor build times

### Documentation
- [ ] Update README with production URL
- [ ] Share deployment URL with team
- [ ] Document any deployment issues
- [ ] Create user guide if needed

### Maintenance
- [ ] Set up automatic deployments (already configured)
- [ ] Plan for updates and rollbacks
- [ ] Monitor API usage
- [ ] Track user feedback

## Rollback Plan

If something goes wrong:
- [ ] Know how to rollback in Vercel dashboard
- [ ] Have previous working deployment URL
- [ ] Can quickly revert code changes
- [ ] Team knows who to contact

## Success Criteria

Deployment is successful when:
- ✅ Application loads without errors
- ✅ Authentication works with real API
- ✅ All CRUD operations function correctly
- ✅ Visualization renders properly
- ✅ Mobile experience is smooth
- ✅ Performance is acceptable
- ✅ No console errors
- ✅ Team can access and use the app

## Common Issues

### Build Fails
- Check Node.js version
- Verify all dependencies installed
- Review build logs in Vercel
- Test build locally first

### 404 on Refresh
- Verify `vercel.json` rewrites configuration
- Check SPA routing setup

### API Connection Issues
- Verify CORS settings on API
- Check API URL is correct
- Ensure bearer token format is correct

### Slow Performance
- Enable Vercel Edge Network (automatic)
- Optimize images
- Check bundle size
- Use code splitting

## Notes

- Vercel automatically handles SSL certificates
- Deployments are atomic (zero downtime)
- Preview deployments created for PRs
- Production deploys on push to main branch

---

**Ready to deploy?** Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide!
