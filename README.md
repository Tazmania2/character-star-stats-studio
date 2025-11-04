# Character Star Stats Studio

A modern web application for creating, configuring, and visualizing Character Star Stats gamification configurations using the Funifier API. Character Star Stats is a gamification technique that divides player accomplishments into different areas represented in a star-shaped diagram, where each area can have multiple progression levels.

![Character Star Stats Studio](public/screenshot.png)

## Features

- **Visual Star Diagram**: Real-time visualization of areas and levels in an interactive star-shaped chart
- **Area Management**: Create, view, and delete gamification areas
- **Level Configuration**: Define progression levels with positions and point requirements
- **Player Evaluation**: Assess player progress across all areas with visual indicators
- **Import/Export**: Backup and migrate configurations between environments
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Touch Support**: Full touch interaction support for mobile devices

## Technology Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **D3.js** - Data visualization for star charts
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API communication

## Prerequisites

- Node.js 18+ and npm/yarn
- Access to a Funifier API instance (default: https://service2.funifier.com)
- Valid Funifier API bearer token

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd character-star-stats-studio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

### API Server URL

The application connects to the Funifier API. By default, it uses `https://service2.funifier.com`. You can configure a different server URL during authentication.

### Authentication

On first launch, you'll be prompted to enter:
- **Server URL**: Your Funifier API endpoint (e.g., `https://service2.funifier.com`)
- **Bearer Token**: Your API authentication token

These credentials are stored securely in your browser's localStorage and persist across sessions.

## Usage

### Creating Areas

1. Click the **"Create Area"** button in the sidebar
2. Enter a unique Area ID (lowercase, hyphens allowed, e.g., `combat-skills`)
3. Enter a display title (e.g., `Combat Skills`)
4. Click **"Create Area"**

### Creating Levels

1. Select an area from the list
2. Click **"Create Level"** in the Levels section
3. Fill in the form:
   - **Area**: Select the parent area
   - **Level Name**: Display name (e.g., `Beginner`)
   - **Position**: Order within the area (0-based)
   - **Minimum Points**: Points required to reach this level
4. Click **"Create Level"**

### Visualizing the Star

The main canvas displays a star-shaped visualization where:
- Each point represents an area
- The length of each spoke represents the number of levels in that area
- Hover over points to see area details
- Click on points to select and view levels

### Evaluating Players

1. Navigate to the **Player Evaluation** section in the sidebar
2. Enter a player ID
3. Click **"Evaluate"**
4. View the player's progress across all areas:
   - Current level in each area
   - Completion percentage
   - Points needed to reach the next level
5. The visualization will overlay the player's progress on the star chart

### Exporting Configuration

1. Click **"Export Configuration"** in the header
2. A JSON file will be downloaded with all areas and levels
3. Filename format: `character-stats-YYYY-MM-DD.json`

### Importing Configuration

1. Click **"Import Configuration"** in the header
2. Select a previously exported JSON file
3. Confirm the import (warning: may overwrite existing data)
4. Review the import summary showing successes and failures

## API Integration

The application integrates with the Funifier API v3 endpoints:

### Areas
- `GET /v3/characterstarstats` - List all areas
- `GET /v3/characterstarstats/area/:id` - Get area details
- `POST /v3/characterstarstats/area` - Create new area
- `DELETE /v3/characterstarstats/area/:id` - Delete area

### Levels
- `GET /v3/characterstarstats/level` - List levels (with optional area filter)
- `GET /v3/characterstarstats/level/:id` - Get level details
- `POST /v3/characterstarstats/level` - Create new level
- `DELETE /v3/characterstarstats/level/:id` - Delete level

### Player Evaluation
- `GET /v3/characterstarstats/player/:id` - Evaluate player progress

All requests include the bearer token in the `Authorization` header:
```
Authorization: Bearer <your-token>
```

## Project Structure

```
character-star-stats-studio/
├── src/
│   ├── components/          # React components
│   │   ├── AreaForm.tsx
│   │   ├── AreaList.tsx
│   │   ├── AuthenticationForm.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ExportButton.tsx
│   │   ├── ImportButton.tsx
│   │   ├── LevelForm.tsx
│   │   ├── LevelList.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PlayerEvaluationPanel.tsx
│   │   ├── StarVisualization.tsx
│   │   └── Toast.tsx
│   ├── contexts/            # React contexts
│   │   ├── AppContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── services/            # API services
│   │   └── FunifierAPIService.ts
│   ├── types/               # TypeScript types
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── errors.ts
│   │   ├── index.ts
│   │   └── models.ts
│   ├── utils/               # Utility functions
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The production-ready files will be in the `dist/` directory

3. Preview the production build:
```bash
npm run preview
```

4. Deploy the `dist/` directory to your hosting service

## Deployment

### Deploy to Vercel (Recommended)

The application is fully configured for Vercel deployment via GitHub:

**Quick Start:**
1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy automatically (~2 minutes)

**📚 Deployment Guides:**
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Quick overview and steps
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - GitHub repository setup
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

### Other Hosting Options

The built application is a static site and can be deployed to:
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **AWS S3 + CloudFront**: Upload `dist` to S3 bucket
- **Any static hosting**: Upload the `dist` folder

## Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## Troubleshooting

### Authentication Errors
- Verify your bearer token is valid
- Check that the server URL is correct
- Ensure you have network connectivity to the Funifier API

### Import Failures
- Verify the JSON file structure matches the export format
- Check for duplicate area IDs
- Ensure all required fields are present

### Visualization Not Displaying
- Ensure at least one area exists
- Check browser console for errors
- Try refreshing the page

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Add tests for new features
5. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [Your Repository URL]
- Documentation: [Your Docs URL]
- Funifier API Docs: https://docs.funifier.com

## Acknowledgments

- Built with [React](https://react.dev/)
- Visualizations powered by [D3.js](https://d3js.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Integrates with [Funifier API](https://funifier.com/)
