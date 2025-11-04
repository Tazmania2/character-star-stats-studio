# Quick Start Guide

Get up and running with Character Star Stats Studio in 5 minutes!

## Step 1: Installation

```bash
# Clone the repository
git clone <repository-url>
cd character-star-stats-studio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will open at `http://localhost:5173`

## Step 2: Authentication

On first launch, you'll see the authentication screen:

1. **Server URL**: Enter your Funifier API endpoint
   - Default: `https://service2.funifier.com`
   - Or use your custom instance URL

2. **Bearer Token**: Enter your API authentication token
   - Get this from your Funifier account settings
   - Format: Long alphanumeric string

3. Click **"Connect"**

Your credentials are saved locally and you won't need to enter them again unless you logout.

## Step 3: Create Your First Area

1. Click **"Create Area"** in the sidebar
2. Enter an Area ID: `combat-skills` (lowercase, hyphens only)
3. Enter a title: `Combat Skills`
4. Click **"Create Area"**

The area appears in the list and on the star visualization!

## Step 4: Add Levels to Your Area

1. Click on your newly created area to select it
2. Click **"Create Level"** in the Levels section
3. Fill in the form:
   - **Area**: `Combat Skills` (auto-selected)
   - **Level Name**: `Beginner`
   - **Position**: `0` (first level)
   - **Minimum Points**: `0` (starting level)
4. Click **"Create Level"**

Repeat to add more levels:
- Level: `Intermediate`, Position: `1`, Min Points: `100`
- Level: `Advanced`, Position: `2`, Min Points: `250`
- Level: `Expert`, Position: `3`, Min Points: `500`

## Step 5: Create More Areas

Add variety to your gamification system:

**Social Skills**
- ID: `social-skills`
- Levels: Shy (0 pts), Friendly (50 pts), Popular (150 pts)

**Technical Skills**
- ID: `technical-skills`
- Levels: Novice (0 pts), Competent (200 pts), Master (600 pts)

Watch the star visualization grow as you add more areas!

## Step 6: Evaluate a Player

1. Scroll to **Player Evaluation** in the sidebar
2. Enter a player ID (e.g., `player-123`)
3. Click **"Evaluate"**

You'll see:
- Current level in each area
- Progress percentage
- Points needed for next level
- Visual overlay on the star chart

## Step 7: Export Your Configuration

1. Click **"Export Configuration"** in the header
2. A JSON file downloads automatically
3. Save it as a backup or to migrate to another environment

## Step 8: Import Configuration (Optional)

To restore or migrate:
1. Click **"Import Configuration"**
2. Select your exported JSON file
3. Confirm the import
4. Review the summary

## Common Tasks

### Editing a Level
1. Select the area containing the level
2. Click the edit icon (pencil) next to the level
3. Modify the fields
4. Click **"Update Level"**

### Deleting Items
- Click the trash icon next to any area or level
- Confirm the deletion in the dialog
- **Warning**: Deleting an area may delete its levels

### Viewing the Visualization
- Hover over area points to see details
- Click points to select areas
- The star grows with more levels
- Player progress shows as a green overlay

## Tips for Success

✅ **Start Simple**: Create 2-3 areas with 3-4 levels each to start

✅ **Logical Progression**: Ensure minimum points increase with position

✅ **Meaningful Names**: Use clear, descriptive names for areas and levels

✅ **Regular Backups**: Export your configuration regularly

✅ **Test with Players**: Use the evaluation feature to verify progression

## Keyboard Shortcuts

- `Esc` - Close any open modal or dialog
- Click outside modals to close them

## Mobile Usage

The studio is fully responsive:
- Tap the menu icon (☰) to toggle the sidebar
- Tap area points on the visualization to select them
- All forms work with touch input
- Swipe to scroll through long lists

## Troubleshooting

**Can't connect?**
- Verify your server URL is correct
- Check your bearer token is valid
- Ensure you have internet connectivity

**Visualization not showing?**
- Create at least one area first
- Refresh the page
- Check browser console for errors

**Import failed?**
- Verify the JSON file format
- Check for duplicate IDs
- Review the error messages in the import summary

## Next Steps

- Read the full [README.md](README.md) for detailed features
- Check [API_INTEGRATION.md](API_INTEGRATION.md) for API details
- Explore the responsive design on different devices
- Set up your production deployment

## Need Help?

- GitHub Issues: [Your Repository URL]
- Documentation: [Your Docs URL]
- Funifier Support: https://docs.funifier.com

---

**Congratulations!** 🎉 You're now ready to create engaging gamification experiences with Character Star Stats Studio.
