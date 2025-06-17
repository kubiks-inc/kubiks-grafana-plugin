# Publishing Guide - Grafana Plugin Catalog Submission

This guide walks you through the process of publishing the Kubiks Service Map Plugin to the official Grafana Plugin Catalog.

## 📋 Prerequisites

Before submitting your plugin, ensure you have:

### 1. Grafana Cloud Account
- Create an account at [grafana.com/signup](https://grafana.com/signup)
- Verify your email address
- Complete your profile information

### 2. Plugin ID Verification
- The plugin ID in `src/plugin.json` must match your Grafana Cloud account slug
- Current ID: `kubiks-kubiks-panel`
- Your account slug should be `kubiks` for this to work

### 3. API Key Generation
- Log into your Grafana Cloud account
- Navigate to **Administration** → **API Keys**
- Create a new API key with **PluginPublisher** role
- Save this key securely - you'll need it for signing

### 4. Repository Setup
- Ensure your repository is public on GitHub
- Add the API key as a repository secret named `GRAFANA_API_KEY`
- Verify all workflows are properly configured

## 🔧 Plugin Signing Setup

### 1. Add Repository Secret
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GRAFANA_API_KEY`
5. Value: Your Grafana Cloud API key
6. Click **Add secret**

### 2. Update Release Workflow
The release workflow at `.github/workflows/release.yml` needs to be updated to enable signing:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

permissions: read-all

jobs:
  release:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false

      - uses: grafana/plugin-actions/build-plugin@main
        with:
          # Enable plugin signing
          policy_token: ${{ secrets.GRAFANA_API_KEY }}
```

## 🚀 Release Process

### 1. Prepare Release
Before creating a release, ensure:

- [ ] All tests pass (`npm run test:ci`)
- [ ] Build succeeds (`npm run build`)
- [ ] E2E tests pass (`npm run e2e`)
- [ ] Documentation is updated
- [ ] Version is bumped in `package.json`
- [ ] CHANGELOG.md is updated

### 2. Create Version Tag
```bash
# Update version (choose appropriate level)
npm version patch  # For bug fixes (0.3.1 → 0.3.2)
npm version minor  # For new features (0.3.1 → 0.4.0)
npm version major  # For breaking changes (0.3.1 → 1.0.0)

# Push with tags
git push origin main --follow-tags
```

### 3. GitHub Actions Build
The release workflow will automatically:
- Build the plugin frontend and backend
- Run tests and validations
- Sign the plugin with your API key
- Create a draft release with assets
- Generate SHA1 checksums

### 4. Review Draft Release
1. Go to your repository's **Releases** page
2. Find the draft release created by GitHub Actions
3. Review the generated release notes
4. Check that signing completed successfully
5. Verify the `.zip` and `.zip.sha1` files are present

## 📝 Grafana Catalog Submission

### 1. Validate Plugin
Before submitting, check the **Validate plugin** step in the release workflow for any warnings that need attention. Common issues include:

- Missing or invalid screenshots
- Incomplete plugin metadata
- Documentation gaps
- Security vulnerabilities
- Performance issues

### 2. Publish Release
1. Edit the draft release
2. Adjust release notes as needed
3. Click **Publish Release**
4. Wait for the assets to be publicly available

### 3. Submit to Grafana
1. Navigate to [grafana.com/auth/sign-in/](https://grafana.com/auth/sign-in/)
2. Sign into your Grafana Cloud account
3. Click **My Plugins** in the admin navigation
4. Click the **Submit Plugin** button

### 4. Plugin Submission Form
Fill in the form with:

**Plugin URL**: Paste the `.zip` asset link from your GitHub release
```
https://github.com/kubiks-inc/kubiks-grafana-plugin/releases/download/v0.3.1/kubiks-panel-0.3.1.zip
```

**SHA1**: Paste the `.zip.sha1` link from your GitHub release
```
https://github.com/kubiks-inc/kubiks-grafana-plugin/releases/download/v0.3.1/kubiks-panel-0.3.1.zip.sha1
```

**Additional Information**:
- Plugin description and features
- Screenshots and demo links
- Documentation links
- Support contact information

## ✅ Validation Checklist

Before submission, verify:

### Plugin Quality
- [ ] Plugin builds without errors
- [ ] All automated tests pass
- [ ] Manual testing completed
- [ ] Performance tested with realistic data
- [ ] Security review completed

### Documentation
- [ ] README.md is comprehensive and up-to-date
- [ ] PLUGIN_DOCUMENTATION.md provides detailed usage guides
- [ ] CHANGELOG.md documents all changes
- [ ] Code is well-commented
- [ ] Configuration examples are provided

### Metadata
- [ ] `plugin.json` contains accurate information
- [ ] Version numbers follow semantic versioning
- [ ] Screenshots showcase key features
- [ ] Logo is high-quality and appropriate
- [ ] Links are working and relevant

### Compliance
- [ ] Plugin follows Grafana design guidelines
- [ ] No security vulnerabilities detected
- [ ] License is clearly specified
- [ ] No copyright violations
- [ ] Plugin signing completed successfully

## 🔍 Review Process

### Grafana Team Review
After submission, the Grafana team will:

1. **Technical Review**: Code quality, security, performance
2. **UX Review**: User experience and design consistency
3. **Documentation Review**: Completeness and clarity
4. **Testing**: Functional testing across different scenarios

### Timeline
- **Initial Review**: 1-2 weeks
- **Feedback/Revisions**: As needed
- **Final Approval**: 1-2 weeks after revision submission
- **Publication**: Usually within 24 hours of approval

### Common Feedback
Be prepared to address:
- Documentation improvements
- UI/UX refinements
- Performance optimizations
- Security considerations
- Accessibility compliance

## 🚨 Troubleshooting

### Common Issues

#### Signing Failures
```bash
Error: Failed to sign plugin
```
**Solutions**:
- Verify `GRAFANA_API_KEY` is correctly set
- Check API key has `PluginPublisher` role
- Ensure plugin ID matches account slug
- Verify workflow permissions

#### Build Failures
```bash
Error: Build failed with exit code 1
```
**Solutions**:
- Run `npm run build` locally to identify issues
- Check Node.js version compatibility
- Verify all dependencies are properly installed
- Review TypeScript compilation errors

#### Validation Warnings
**Common warnings and solutions**:
- **Missing screenshots**: Add high-quality images to `src/img/`
- **Large bundle size**: Optimize dependencies and code splitting
- **Security issues**: Update vulnerable dependencies
- **Performance issues**: Optimize render cycles and data processing

#### Asset Links Not Working
If the `.zip` and `.sha1` links in the release are not working:
1. Ensure the release is published (not draft)
2. Check that GitHub Actions completed successfully
3. Verify files were uploaded correctly
4. Wait a few minutes for CDN propagation

## 📞 Support and Resources

### Getting Help
- **Grafana Community**: [community.grafana.com](https://community.grafana.com)
- **Plugin Development Docs**: [grafana.com/developers](https://grafana.com/developers)
- **GitHub Issues**: For plugin-specific questions
- **Grafana Slack**: #plugin-development channel

### Useful Links
- [Plugin Publishing Guidelines](https://grafana.com/legal/plugins/#plugin-publishing-and-signing-criteria)
- [Plugin Signature Levels](https://grafana.com/legal/plugins/#what-are-the-different-classifications-of-plugins)
- [Plugin Development Guide](https://grafana.com/developers/plugin-tools/)
- [Grafana Design System](https://developers.grafana.com/ui)

## 🎉 Post-Publication

### After Approval
Once your plugin is approved and published:

1. **Announce**: Share on social media, blog, community forums
2. **Monitor**: Watch for user feedback and issues
3. **Support**: Respond to questions and bug reports
4. **Iterate**: Plan future improvements based on user feedback
5. **Maintain**: Keep the plugin updated with new Grafana versions

### Ongoing Maintenance
- Monitor plugin usage and performance
- Address security updates promptly
- Maintain compatibility with new Grafana versions
- Respond to community feedback
- Plan and implement new features

---

## 📄 Sample Release Notes Template

For your GitHub release, use this template:

```markdown
# Kubiks v0.3.1 - Service Map Visualization Panel

## 🎉 What's New
- Enhanced layout algorithms for better service positioning
- Dashboard panel integration with variable mapping
- Improved performance for large topologies

## 🐛 Bug Fixes
- Fixed canvas positioning issues
- Resolved memory leaks in ReactFlow
- Corrected status color coding

## 📦 Installation
Add this panel to your Grafana instance from the Plugin Catalog or download manually.

## 🔗 Links
- **Documentation**: [Plugin Guide](./PLUGIN_DOCUMENTATION.md)
- **Support**: [GitHub Issues](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues)
- **Website**: [kubiks.ai](https://kubiks.ai)

---

**For Grafana Plugin Catalog Submission:**
- Plugin URL: [Download ZIP](https://github.com/kubiks-inc/kubiks-grafana-plugin/releases/download/v0.3.1/kubiks-panel-0.3.1.zip)
- SHA1 Checksum: [Download SHA1](https://github.com/kubiks-inc/kubiks-grafana-plugin/releases/download/v0.3.1/kubiks-panel-0.3.1.zip.sha1)
```

---

*This guide ensures your plugin meets all requirements for successful submission to the Grafana Plugin Catalog. Follow each step carefully and don't hesitate to reach out for help if needed!*