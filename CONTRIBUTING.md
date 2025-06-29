# Contributing to Kubiks Service Map Panel

Thank you for your interest in contributing to the Kubiks Service Map Panel! We welcome contributions from the community.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes with clear, descriptive messages
7. Push your changes to your fork
8. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (version specified in .nvmrc)
- Go (for backend development)
- Docker (for testing)

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build backend plugin binaries:
   ```bash
   mage -v
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm run test
   ```

## Code Style

- Follow the existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure your code passes all linting checks:
  ```bash
  npm run lint
  ```

## Testing

- Write tests for new features and bug fixes
- Ensure all existing tests continue to pass
- Run the full test suite before submitting:
  ```bash
  npm run test:ci
  ```

## Pull Request Guidelines

- Keep pull requests focused on a single feature or bug fix
- Include a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if necessary

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment details (Grafana version, browser, OS)
- Screenshots or logs if applicable

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## Questions?

If you have questions about contributing, please:

- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to the maintainers

Thank you for contributing to making Kubiks Service Map Panel better!