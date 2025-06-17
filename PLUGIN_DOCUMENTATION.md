# Kubiks - Service Map Visualization Panel for Grafana

A powerful service map visualization panel for monitoring and observing distributed systems and microservices architecture in Grafana.

## Overview

Kubiks is a Grafana panel plugin that transforms time-series and node graph data into interactive service maps. It provides a visual representation of your distributed systems, allowing you to understand service relationships, monitor health status, and explore detailed metrics through an intuitive drag-and-drop interface.

## Key Features

### 🗺️ Interactive Service Maps
- **Dynamic Visualization**: Automatically generates service maps from your Grafana data sources
- **Multiple Layout Algorithms**: Choose from tree, grid, or force-directed (D3) layouts
- **Infinite Canvas**: Pan, zoom, and explore large service topologies with ease
- **Real-time Updates**: Live monitoring with automatic data refresh

### 🎨 Configurable Elements
- **Flexible Element Types**: Support for services, connections, and grouped elements
- **Custom Layout Items**: Rich configuration for displaying metrics, status, tags, and more
- **Visual Customization**: Custom icons, colors, and styling options
- **Progressive Disclosure**: Simplified views at different zoom levels

### 📊 Rich Data Integration
- **Multi-Source Support**: Works with any Grafana data source
- **Query Correlation**: Link elements to specific queries and fields
- **Dashboard Integration**: Embed panels and link to other dashboards
- **Variable Mapping**: Dynamic dashboard variables based on selected services

### 🔍 Advanced Interactions
- **Service Details**: Click elements to view detailed information in slide-out panels
- **Connection Analysis**: Hover over connections to see traffic metrics and error rates
- **Context Menus**: Right-click for additional actions and navigation
- **Search & Filter**: Find and highlight specific services quickly

## Architecture

### Core Components

#### 1. **Service Map Panel** (`src/panels/ServiceMapPanel.tsx`)
The main panel component that renders the infinite canvas and manages the overall layout.

#### 2. **Element System** (`src/lib/model/view.ts`)
- **Elements**: Define services, connections, or groups
- **Layout Items**: Configure what data to display (progress bars, text, tags, etc.)
- **Records**: Runtime instances of elements with actual data

#### 3. **Canvas Engine** (`src/containers/Canvas/InfiniteCanvas.tsx`)
Built on ReactFlow, provides:
- Infinite scrolling and zooming
- Node positioning and layout algorithms
- Drag and drop interactions
- Context menus and selections

#### 4. **State Management** (`src/store/viewStore.ts`)
Zustand-based store managing:
- View configuration and layout
- Filtered records and selections
- UI state (drawers, popups, edit mode)
- Data fetching and caching

### Layout System

The plugin supports multiple layout algorithms:

1. **Tree Layout**: Hierarchical arrangement using Dagre
2. **Grid Layout**: Organized grid-based positioning
3. **Force Layout**: Physics-based positioning using D3-force

## Configuration Guide

### Element Configuration

Elements are the building blocks of your service map. Each element defines:

```typescript
interface Element {
  name: string;
  type: 'group' | 'element' | 'connection';
  source?: string;        // Query reference
  layout?: LayoutItem[];  // What to show in the map
  details?: LayoutItem[]; // What to show in detail view
}
```

### Layout Items

Layout items define what information to display for each element:

#### Available Layout Item Types:

1. **Title** (`title`): Display element name
2. **Status** (`status`): Show status badges with color coding
3. **Progress** (`progress`): Progress bars for metrics like CPU usage
4. **Inversed Progress** (`inversed_progress`): For metrics where higher is worse
5. **Text** (`text`): Simple text fields
6. **Tags** (`tags`): Key-value pairs displayed as badges
7. **Key-Value** (`keyValue`): Structured data display
8. **Blocks** (`blocks`): Grid of sub-components (e.g., pods)
9. **Links** (`link`): External links and actions
10. **Icons** (`icon`): Custom service icons
11. **Panels** (`panel`): Embedded dashboard panels

#### Source Types:

- **Value**: Static values
- **Query**: Dynamic values from Grafana queries
- **Dashboard**: Embedded dashboard panels with variable mapping

### Query Integration

The plugin correlates data using a join key (default: `service_name`). Elements are matched to query results based on this key, allowing dynamic service maps that reflect your actual infrastructure.

#### Example Query Structure:
```sql
SELECT 
  time,
  service_name,
  cpu_usage,
  memory_usage,
  status
FROM metrics
WHERE $__timeFilter(time)
```

## Usage Instructions

### 1. Basic Setup

1. **Create a New Panel**: Add a new panel to your dashboard
2. **Select Panel Type**: Choose "Kubiks" from the visualization options
3. **Configure Data Source**: Connect to your monitoring data source
4. **Define Queries**: Create queries that return service metrics

### 2. Element Configuration

1. **Add Elements**: Click "Add Element" in the panel editor
2. **Set Element Type**: Choose between 'element', 'connection', or 'group'
3. **Configure Source**: Link to a query reference ID
4. **Design Layout**: Add layout items to define what's displayed

### 3. Layout Item Configuration

For each layout item:
1. **Choose Type**: Select from available layout item types
2. **Set Source**: Choose value, query, or dashboard source
3. **Map Fields**: Connect to specific query fields
4. **Style Options**: Configure labels, icons, and formatting

### 4. Advanced Features

#### Dashboard Integration
- Embed panels with variable mapping
- Link services to detailed dashboards
- Pass context variables dynamically

#### Custom Styling
- Upload custom service icons
- Configure status color schemes
- Customize layout and spacing

#### Performance Optimization
- Enable simplified views for large topologies
- Configure progressive detail loading
- Optimize query refresh intervals

## Data Requirements

### Minimum Requirements
- Time-series data with timestamps
- Service identifier field (`service_name` by default)
- At least one metric field

### Recommended Data Structure
```json
{
  "fields": [
    {
      "name": "time",
      "type": "time"
    },
    {
      "name": "value", 
      "type": "number",
      "labels": {
        "service_name": "api-service",
        "status": "healthy",
        "environment": "production"
      }
    }
  ]
}
```

### Connection Data (for Network Topology)
```json
{
  "fields": [
    {"name": "source", "values": ["service-a", "service-b"]},
    {"name": "target", "values": ["service-b", "service-c"]},
    {"name": "rps", "values": [100, 50]},
    {"name": "error_rate", "values": [0.01, 0.02]}
  ]
}
```

## Best Practices

### 1. **Start Simple**
- Begin with basic elements showing service names and status
- Add complexity gradually as needed
- Test with small datasets first

### 2. **Optimize Performance**
- Limit the number of visible elements (50-100 max)
- Use appropriate refresh intervals
- Enable simplified views for overview dashboards

### 3. **Design for Users**
- Use consistent color schemes for status
- Provide meaningful service names and descriptions
- Include relevant context in tooltips and details

### 4. **Data Quality**
- Ensure consistent service naming across queries
- Include status information where possible
- Validate query results return expected fields

## Troubleshooting

### Common Issues

#### Elements Not Appearing
- Check query results contain the join key field
- Verify element source matches query refId
- Ensure data is within selected time range

#### Layout Items Not Showing Data
- Confirm field names match query results
- Check source type configuration (value/query/dashboard)
- Verify data types are compatible

#### Performance Issues
- Reduce number of elements
- Increase refresh intervals
- Enable simplified view mode
- Optimize underlying queries

#### Styling Problems
- Check icon URLs are accessible
- Verify CSS classes are properly applied
- Test with default themes first

## Development & Contribution

### Project Structure
```
src/
├── components/        # React components
│   ├── Canvas/       # Visualization components
│   └── LayoutItemsConfig/ # Configuration UI
├── containers/       # Page-level containers
├── lib/             # Core logic and models
├── panels/          # Panel implementations
├── store/           # State management
└── utils/           # Helper functions
```

### Building the Plugin

```bash
# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build

# Run tests
npm run test:ci

# Lint code
npm run lint:fix
```

### Backend Development

The plugin includes a Go backend for advanced data processing:

```bash
# Build backend binaries
mage -v

# List available commands
mage -l
```

## Publishing to Grafana Catalog

### Prerequisites
1. **Grafana Cloud Account**: Sign up at https://grafana.com/signup
2. **Plugin Signing**: Configure `GRAFANA_API_KEY` in repository secrets
3. **Plugin Validation**: Ensure all validations pass

### Release Process
1. **Create Release Tag**: `git tag v1.0.0 && git push --tags`
2. **GitHub Actions**: Automated build and signing process
3. **Draft Release**: Review and publish the generated release
4. **Submit to Grafana**: Follow submission guidelines in release notes

### Validation Checklist
- [ ] Plugin builds successfully
- [ ] All tests pass
- [ ] Documentation is complete
- [ ] Screenshots are updated
- [ ] Plugin metadata is accurate
- [ ] Signing process completes without errors

## Support & Resources

- **Documentation**: [Plugin README](./README.md)
- **Issues**: [GitHub Issues](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues)
- **Website**: [kubiks.ai](https://kubiks.ai)
- **Sponsor**: [GitHub Sponsors](https://github.com/sponsors/kubiks-inc)

## License

This plugin is licensed under the Apache License 2.0. See [LICENSE](./LICENSE) for details.

---

*Built with ❤️ by the Kubiks team for the Grafana community.*