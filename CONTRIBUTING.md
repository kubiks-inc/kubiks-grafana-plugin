# Contributing to Kubiks

Thank you for your interest in contributing to Kubiks! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions of all kinds:
- 🐛 **Bug reports and fixes**
- ✨ **New features and enhancements**
- 📖 **Documentation improvements**
- 🧪 **Tests and quality improvements**
- 🎨 **UI/UX improvements**
- 🔧 **Performance optimizations**

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Node.js 22+**
- **Go 1.21+** (for backend changes)
- **Git**
- **Docker** (optional, for testing)
- Basic knowledge of **TypeScript/React** and **Grafana plugin development**

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kubiks-grafana-plugin.git
   cd kubiks-grafana-plugin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Run Test Environment**
   ```bash
   npm run server
   ```

5. **Access Grafana**
   - Open http://localhost:3000
   - Login: admin/admin
   - Navigate to panel editor and select "Kubiks"

## 📋 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Changes
- Write clean, documented code
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run unit tests
npm run test:ci

# Run linting
npm run lint

# Run E2E tests
npm run e2e

# Build to ensure no errors
npm run build
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new layout algorithm"
# or
git commit -m "fix: resolve canvas positioning issue"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes

### 5. Push and Create PR
```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots/GIFs for UI changes
- Testing instructions

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Canvas/          # Canvas and visualization components
│   ├── LayoutItemsConfig/ # Configuration UI components
│   └── ...
├── containers/          # Page-level containers
├── lib/                # Core logic and utilities
│   ├── model/          # TypeScript interfaces and types
│   ├── canvas/         # Canvas layout algorithms
│   └── ...
├── panels/             # Panel implementations
├── store/              # State management (Zustand)
├── utils/              # Helper functions
└── styles.css          # Global styles

pkg/                    # Go backend
├── main.go            # Backend entry point
└── plugin/           # Plugin implementation

.github/workflows/     # CI/CD pipelines
docs/                 # Additional documentation
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for new functions and components
- Use Jest and React Testing Library
- Aim for good coverage of business logic

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:ci
```

### E2E Tests
- Add E2E tests for new user workflows
- Use Playwright for browser automation
- Test critical user journeys

```bash
npm run e2e
```

### Manual Testing
- Test in different browsers
- Verify with different data sources
- Check responsive design
- Test accessibility

## 🎨 Code Style

### TypeScript/React
- Use TypeScript for all new code
- Follow React functional component patterns
- Use hooks appropriately
- Write self-documenting code with good variable names

### Styling
- Use TailwindCSS classes for styling
- Follow existing component patterns
- Ensure responsive design
- Test with Grafana's light and dark themes

### Backend (Go)
- Follow Go best practices
- Write clear, idiomatic Go code
- Include error handling
- Add appropriate logging

## 📖 Documentation

### Code Documentation
- Add JSDoc comments for functions and components
- Document complex logic and algorithms
- Include examples in comments where helpful

### User Documentation
- Update README.md for new features
- Add examples to PLUGIN_DOCUMENTATION.md
- Create guides for complex features
- Update troubleshooting sections

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details**:
   - Grafana version
   - Browser and version
   - Plugin version
   - Data source type
5. **Screenshots or recordings** if applicable
6. **Configuration details** (sanitized)

Use our [Bug Report Template](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues/new?template=bug_report.md).

## ✨ Feature Requests

For feature requests, please include:

1. **Problem description** - what problem does this solve?
2. **Proposed solution** - how should it work?
3. **Use cases** - who would benefit and how?
4. **Alternative solutions** - what other approaches exist?
5. **Implementation ideas** - any technical considerations?

Use our [Feature Request Template](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues/new?template=feature_request.md).

## 🔍 Code Review Process

### For Contributors
- Respond to feedback promptly
- Make requested changes in separate commits
- Ask questions if feedback is unclear
- Be open to suggestions and improvements

### For Reviewers
- Be respectful and constructive
- Focus on code quality and user experience
- Suggest improvements with explanations
- Test the changes locally when possible

## 📦 Release Process

### Version Numbers
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow
1. **Create release branch** from `main`
2. **Update version** in `package.json`
3. **Update CHANGELOG.md** with new changes
4. **Create PR** for release branch
5. **Merge and tag** release
6. **GitHub Actions** handles build and publishing

## 🏷️ Issues and Labels

We use labels to categorize issues:

- **Type**: `bug`, `feature`, `documentation`, `question`
- **Priority**: `low`, `medium`, `high`, `critical`
- **Status**: `help wanted`, `good first issue`, `in progress`
- **Component**: `canvas`, `backend`, `ui`, `performance`

## 🌟 Recognition

Contributors are recognized in:
- **Release notes** for significant contributions
- **README credits** for major features
- **Special thanks** in documentation

## 🤔 Questions and Support

Need help? We're here to assist:

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Discord/Slack**: [Community channels] (if available)
- **Email**: For security issues or private matters

## 📜 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. Please:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

## 🙏 Thank You

Every contribution, no matter how small, makes Kubiks better for everyone. Thank you for being part of our community!

---

*This contributing guide is adapted from best practices in the open-source community. If you have suggestions for improvements, please let us know!*