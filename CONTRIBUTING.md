# Contributing Guide

Thank you for considering contributing to Character Star Stats Studio! This guide will help you get started.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/character-star-stats-studio.git
   cd character-star-stats-studio
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

Follow these guidelines:
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build to verify
npm run build

# Test in browser
npm run dev
```

### 4. Commit Your Changes

Use clear commit messages:
```bash
git add .
git commit -m "feat: Add new feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design
- Test on mobile devices

### File Organization
```
src/
├── components/     # React components
├── contexts/       # React contexts
├── services/       # API services
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style
- [ ] All tests pass
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] Commit messages are clear

### PR Description
Include:
1. **What** - What changes were made
2. **Why** - Why these changes are needed
3. **How** - How to test the changes
4. **Screenshots** - For UI changes

Example:
```markdown
## Description
Added confirmation dialog before deleting areas

## Motivation
Users were accidentally deleting areas without confirmation

## Testing
1. Create an area
2. Click delete button
3. Verify confirmation dialog appears
4. Test both confirm and cancel actions

## Screenshots
[Add screenshots here]
```

### Review Process
1. Maintainer reviews your PR
2. Address any feedback
3. Once approved, PR will be merged
4. Your changes will be deployed automatically

## Reporting Bugs

### Before Reporting
- Check if bug already reported
- Verify it's reproducible
- Test on latest version

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives**
Other solutions considered

**Additional Context**
Mockups, examples, etc.
```

## Code Review

### As a Reviewer
- Be respectful and constructive
- Explain reasoning for suggestions
- Approve when ready
- Test changes locally if possible

### As a Contributor
- Respond to feedback promptly
- Ask questions if unclear
- Make requested changes
- Thank reviewers

## Testing

### Manual Testing
- Test all affected features
- Check responsive design
- Verify on different browsers
- Test error scenarios

### Automated Testing (Future)
When tests are added:
```bash
npm run test
```

## Documentation

### Update Documentation When
- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Updating dependencies

### Documentation Files
- `README.md` - Main documentation
- `API_INTEGRATION.md` - API details
- `QUICKSTART.md` - Getting started
- `DEPLOYMENT.md` - Deployment guide

## Community

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

### Getting Help
- Check documentation first
- Search existing issues
- Ask in discussions
- Be specific about your problem

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- Project documentation (for major features)

## Questions?

- Open an issue for questions
- Start a discussion for ideas
- Contact maintainers directly

---

**Thank you for contributing!** 🎉
