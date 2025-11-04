# GitHub Setup Guide

Quick guide to get your code on GitHub and ready for Vercel deployment.

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website
1. Go to https://github.com/new
2. Repository name: `character-star-stats-studio`
3. Description: "A modern web application for Character Star Stats gamification"
4. Choose Public or Private
5. **Do NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### Option B: Via GitHub CLI
```bash
gh repo create character-star-stats-studio --public --source=. --remote=origin
```

## Step 2: Initialize Git (if not already done)

```bash
cd character-star-stats-studio

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Character Star Stats Studio"
```

## Step 3: Connect to GitHub

```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/character-star-stats-studio.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

If you're on `master` branch instead of `main`:
```bash
git branch -M main
git push -u origin main
```

## Step 4: Verify on GitHub

1. Go to your repository URL: `https://github.com/YOUR_USERNAME/character-star-stats-studio`
2. Verify all files are present
3. Check that README.md displays correctly
4. Ensure `.gitignore` is working (no `node_modules` or `dist` folders)

## Step 5: Set Up Branch Protection (Optional)

For team projects:
1. Go to repository **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass (if using CI)
   - ✅ Require branches to be up to date

## Step 6: Configure GitHub Actions (Optional)

The repository includes CI workflows:
- `.github/workflows/ci.yml` - Runs on every push/PR
- `.github/workflows/deploy.yml` - Deploys to Vercel (requires secrets)

### For CI Only (Recommended)
No additional setup needed. The CI workflow will run automatically.

### For Automated Vercel Deployment
Add these secrets in GitHub:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `VERCEL_TOKEN` - Get from Vercel account settings
   - `VERCEL_ORG_ID` - Get from Vercel project settings
   - `VERCEL_PROJECT_ID` - Get from Vercel project settings

## Step 7: Update Repository Information

Update these files with your actual GitHub URL:

### package.json
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/character-star-stats-studio.git"
  },
  "author": "Your Name"
}
```

### README.md
Update the deploy button:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/character-star-stats-studio)
```

## Common Git Commands

### Daily Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Working with Branches
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

### Undoing Changes
```bash
# Discard local changes
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Troubleshooting

### Authentication Issues

**HTTPS (recommended):**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/character-star-stats-studio.git
```
Use GitHub Personal Access Token when prompted for password.

**SSH:**
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/character-star-stats-studio.git
```
Requires SSH key setup.

### Large Files
If you accidentally committed large files:
```bash
# Remove from git but keep locally
git rm --cached filename

# Add to .gitignore
echo "filename" >> .gitignore

# Commit
git commit -m "Remove large file"
```

### Merge Conflicts
```bash
# Pull latest changes
git pull

# Fix conflicts in files (look for <<<<<<, ======, >>>>>>)
# Edit files to resolve conflicts

# Add resolved files
git add .

# Complete merge
git commit -m "Resolve merge conflicts"
```

## Best Practices

### Commit Messages
Use clear, descriptive commit messages:
- ✅ "Add player evaluation feature"
- ✅ "Fix: Resolve authentication bug"
- ✅ "Update: Improve responsive design"
- ❌ "Update"
- ❌ "Fix stuff"
- ❌ "WIP"

### Commit Frequency
- Commit often with logical changes
- Each commit should be a complete, working state
- Don't commit broken code to main branch

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch (optional)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

## Security

### Never Commit
- ❌ API tokens or secrets
- ❌ Environment files with sensitive data
- ❌ Private keys
- ❌ User data
- ❌ node_modules folder
- ❌ Build artifacts (dist folder)

### Use .gitignore
The project includes a `.gitignore` file that excludes:
- node_modules
- dist
- .env files
- IDE files
- OS files

## Next Steps

After pushing to GitHub:
1. ✅ Verify repository is accessible
2. ✅ Check that CI workflow runs (if configured)
3. ✅ Proceed to Vercel deployment
4. ✅ Share repository with team members

## Resources

- **GitHub Docs**: https://docs.github.com
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **GitHub CLI**: https://cli.github.com
- **Git Book**: https://git-scm.com/book/en/v2

---

**Ready for Vercel?** Continue to [DEPLOYMENT.md](DEPLOYMENT.md)
