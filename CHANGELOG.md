# Changelog

All notable changes to the Kubiks Service Map Panel plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2024-12-13

### 🎉 New Features
- **Enhanced Layout Algorithms**: Improved tree, grid, and force-directed layout positioning
- **Dashboard Panel Integration**: Embed Grafana panels directly in service map elements
- **Variable Mapping**: Dynamic dashboard variables based on selected services
- **Connection Details**: Enhanced connection analysis with traffic metrics and error rates
- **Service Drawer**: Comprehensive slide-out panel for detailed service information

### 🚀 Improvements
- **Performance Optimization**: Better handling of large service topologies (100+ nodes)
- **Progressive Disclosure**: Simplified views at different zoom levels
- **Infinite Canvas**: Smoother panning and zooming experience
- **Responsive Design**: Better mobile and tablet support
- **Query Correlation**: Improved data matching using join keys

### 🐛 Bug Fixes
- Fixed layout positioning issues with grouped elements
- Resolved memory leaks in ReactFlow canvas
- Corrected status color coding inconsistencies
- Fixed drag-and-drop configuration in layout items
- Improved error handling for missing data fields

### 🔧 Technical Changes
- Upgraded to ReactFlow v12.6.4
- Updated Grafana dependencies to v11.5.3
- Migrated to TailwindCSS v4.1.8
- Enhanced TypeScript type definitions
- Improved test coverage with Playwright E2E tests

### 📚 Documentation
- Added comprehensive plugin documentation
- Created configuration guides and examples
- Improved inline code comments
- Added troubleshooting guides

## [0.3.0] - 2024-11-15

### 🎉 New Features
- **Multi-Layout Support**: Added tree, grid, and force-directed layout algorithms
- **Custom Icons**: Support for custom service icons and visual theming
- **Real-time Updates**: Live data refresh with configurable intervals
- **Context Menus**: Right-click actions for enhanced navigation
- **Search & Filter**: Find and highlight specific services in large maps

### 🚀 Improvements
- **State Management**: Migrated to Zustand for better performance
- **Component Architecture**: Modular component system for extensibility
- **Data Processing**: Enhanced query result processing and caching
- **UI/UX**: Improved visual design and interaction patterns

### 🐛 Bug Fixes
- Fixed edge rendering issues in complex topologies
- Resolved data binding problems with dynamic queries
- Corrected canvas viewport positioning
- Fixed layout item configuration persistence

## [0.2.5] - 2024-10-20

### 🚀 Improvements
- **Element Configuration**: Enhanced drag-and-drop interface for layout items
- **Data Source Integration**: Better support for multiple data source types
- **Performance**: Optimized rendering for medium-sized topologies (50+ nodes)
- **Accessibility**: Improved keyboard navigation and screen reader support

### 🐛 Bug Fixes
- Fixed progress bar calculations for inversed metrics
- Resolved connection line positioning issues
- Corrected status badge color mapping
- Fixed memory usage in long-running sessions

### 🔧 Technical Changes
- Updated build pipeline with better error handling
- Enhanced developer experience with hot reloading
- Improved code organization and modularity

## [0.2.0] - 2024-09-15

### 🎉 New Features
- **Layout Items System**: Configurable display elements (progress bars, text, tags, etc.)
- **Connection Visualization**: Network topology with source/target relationships
- **Status Indicators**: Health status with color-coded badges
- **Element Grouping**: Logical grouping of related services

### 🚀 Improvements
- **Data Model**: Enhanced element and record structure
- **Canvas Interactions**: Better mouse and touch interactions
- **Configuration UI**: Improved panel editor with live preview
- **Error Handling**: Better error messages and recovery

### 🐛 Bug Fixes
- Fixed initial canvas positioning
- Resolved data refresh timing issues
- Corrected element sizing calculations
- Fixed configuration validation

## [0.1.5] - 2024-08-10

### 🚀 Improvements
- **Backend Integration**: Added Go backend for data processing
- **Query Processing**: Enhanced query result transformation
- **Canvas Performance**: Optimized rendering for better frame rates
- **Configuration Validation**: Added input validation and error messages

### 🐛 Bug Fixes
- Fixed canvas zoom limits
- Resolved element overlap issues
- Corrected data field mapping
- Fixed configuration persistence

## [0.1.0] - 2024-07-01

### 🎉 Initial Release
- **Basic Service Map**: Simple node visualization from query data
- **ReactFlow Integration**: Canvas-based interactive interface
- **Element Configuration**: Basic element setup with query binding
- **Grafana Integration**: Panel plugin architecture with data source support
- **Layout Engine**: Initial automatic layout positioning

### 🏗️ Architecture
- TypeScript/React frontend
- Grafana Plugin SDK integration
- Basic state management
- Canvas rendering with ReactFlow

---

## 🔮 Upcoming Features

### v0.4.0 (Planned)
- **Advanced Filtering**: Complex filtering and search capabilities
- **Export Functionality**: Export maps as images or configuration
- **Template System**: Reusable element and layout templates
- **Alerting Integration**: Visual alert states and notifications
- **Multi-Dashboard Support**: Cross-dashboard service maps

### v0.5.0 (Future)
- **Collaboration Features**: Shared maps and team collaboration
- **Animation System**: Animated connections and state changes
- **Advanced Analytics**: Service dependency analysis
- **API Integration**: REST API for external integrations
- **Plugin Ecosystem**: Extensions and custom layout items

---

## 📝 Notes

### Breaking Changes
- **v0.3.0**: Changed element configuration structure (migration guide available)
- **v0.2.0**: Updated data model requires configuration updates

### Compatibility
- **Grafana**: Requires v10.4.0 or higher
- **Node.js**: Requires v22 or higher for development
- **Browsers**: Modern browsers with ES2020 support

### Support
- Report issues on [GitHub Issues](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues)
- Join discussions on [GitHub Discussions](https://github.com/kubiks-inc/kubiks-grafana-plugin/discussions)
- Get help on [Grafana Community](https://community.grafana.com/)

---

*For detailed migration guides and breaking change documentation, see our [Documentation](./PLUGIN_DOCUMENTATION.md).*
