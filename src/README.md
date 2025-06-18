# Kubiks Service Map Panel

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/kubiks-kubiks-panel&label=Marketplace&prefix=v&color=F47A20)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org/)

A powerful service map visualization panel for monitoring and observing distributed systems and microservices architecture in Grafana. Kubiks transforms your observability data into interactive, real-time service dependency graphs that help you understand system relationships, identify bottlenecks, and troubleshoot issues quickly.

![Service Map Overview](https://raw.githubusercontent.com/kubiks-inc/kubiks-grafana-plugin/main/src/img/screenshot.png)

## 🌟 Features

### Interactive Service Maps
- **Real-time visualization** of microservices architecture and dependencies
- **Interactive nodes** with drill-down capabilities for detailed service information
- **Dynamic layouts** with multiple arrangement options (tree, grid, force-directed)
- **Infinite canvas** with zoom and pan capabilities for large-scale architectures

### Flexible Data Integration
- **Multi-query support** - combine data from multiple Grafana queries
- **Node graph compatibility** - works with Grafana's node graph data format
- **Custom data mapping** - flexible field mapping for various data sources
- **Real-time updates** - automatically refreshes as your data changes

### Rich Visualization Options
- **Customizable elements** - configure nodes, connections, and groups
- **Embedded panels** - integrate other Grafana panels directly into service nodes
- **Status indicators** - visual health and performance indicators
- **Connection details** - hover and click interactions for relationship insights

### Advanced Configuration
- **Service Map Builder** - intuitive drag-and-drop configuration interface
- **Element templates** - reusable configurations for consistent styling
- **Variable mapping** - dynamic content based on dashboard variables
- **Layout persistence** - maintains your preferred arrangement across sessions

## 📋 Requirements

- **Grafana** >= 10.4.0
- **Node.js** >= 22 (for development)
- Data sources that provide service topology information (e.g., Jaeger, Zipkin, Prometheus with service discovery)

## 🚀 Getting Started

### Installation

1. **From Grafana Plugin Catalog** (Recommended)
   ```bash
   # Install via Grafana CLI
   grafana-cli plugins install kubiks-kubiks-panel
   
   # Restart Grafana
   sudo systemctl restart grafana-server
   ```

2. **Manual Installation**
   ```bash
   # Download and extract to Grafana plugins directory
   cd /var/lib/grafana/plugins
   wget https://github.com/kubiks-inc/kubiks-grafana-plugin/releases/latest/download/kubiks-kubiks-panel.zip
   unzip kubiks-kubiks-panel.zip
   sudo systemctl restart grafana-server
   ```

### Basic Setup

1. **Create a new panel** in your Grafana dashboard
2. **Select "Kubiks Service Map"** from the panel type dropdown
3. **Configure your data sources** to provide service topology data
4. **Set up the service map configuration** using the Service Map Builder

## ⚙️ Configuration

### Data Source Setup

Your queries should return data in one of these formats:

#### Node Graph Format
```
Fields: id, title, subtitle, arc__success, arc__errors, mainstat, secondarystat
```

#### Custom Query Format  
```
Fields: service_name, [custom_fields...]
Labels: service_name, status, version, etc.
```

### Service Map Builder

![Service Map Builder](https://raw.githubusercontent.com/kubiks-inc/kubiks-grafana-plugin/main/src/img/configuration-page.png)

The Service Map Builder provides an intuitive interface to configure your service map:

1. **Add Elements**: Click "Add Element" to create new services, groups, or connections
2. **Configure Properties**: Set element names, types, and data sources
3. **Define Layout**: Specify how each element should be displayed
4. **Set Up Details**: Configure detailed views for drill-down information

### Element Types

#### 🔧 Elements (Services/Components)
- **Name**: Unique identifier for the service
- **Type**: Set to "element"
- **Source**: Query reference or node graph data
- **Layout**: Visual configuration for the node display
- **Details**: Additional information shown in the detail panel

#### 📁 Groups  
- **Name**: Group identifier
- **Type**: Set to "group"  
- **Layout**: Visual styling for group containers
- **Details**: Group-level information and statistics

#### 🔗 Connections
- **Name**: Connection identifier
- **Type**: Set to "connection"
- **Source**: Query providing source/target relationships
- **Layout**: Visual styling for edges/connections

### Layout Configuration

![Element Configuration](https://raw.githubusercontent.com/kubiks-inc/kubiks-grafana-plugin/main/src/img/configuration-details.png)

Each element supports various layout items:

- **Title**: Primary service name display
- **Text**: Static or dynamic text content
- **Tags**: Categorical labels (environment, version, etc.)
- **Key-Value**: Structured information pairs
- **Progress**: Progress bars for metrics
- **Status**: Health/status indicators
- **Icons**: Visual service type indicators
- **Links**: Clickable URLs for external resources

### Panel Integration

![Panel Configuration](https://raw.githubusercontent.com/kubiks-inc/kubiks-grafana-plugin/main/src/img/configuration-panel.png)

Embed other Grafana panels directly into your service nodes:

1. **Panel Type**: Select "panel" as the layout item type
2. **Dashboard UID**: Reference to the source dashboard
3. **Panel ID**: ID of the panel to embed
4. **Variable Mapping**: Map service attributes to panel variables

#### Variable Mapping Example
```javascript
{
  "panelVariable": "service",
  "queryRef": "A", 
  "field": "service_name"
}
```

## 📊 Data Source Examples

### Prometheus with Service Discovery
```promql
# Services query
up{job=~".*"}

# Connections query  
rate(http_requests_total[5m]) by (source_service, target_service)
```

### Jaeger Traces
```sql
# Services query
SELECT DISTINCT service_name, operation_name 
FROM traces 
WHERE start_time > now() - interval '1 hour'

# Dependencies query
SELECT source_service, target_service, call_count
FROM service_dependencies
WHERE start_time > now() - interval '1 hour'  
```

### Custom JSON API
```json
{
  "nodes": [
    {
      "id": "service-a",
      "title": "Service A", 
      "subtitle": "API Gateway",
      "mainstat": "99.9%",
      "secondarystat": "45ms"
    }
  ],
  "edges": [
    {
      "source": "service-a",
      "target": "service-b"
    }
  ]
}
```

## 🎛️ Panel Options

### Layout Types
- **Tree**: Hierarchical arrangement (default)
- **Grid**: Organized grid layout
- **Force**: Physics-based force-directed layout

### Interaction Features
- **Node Selection**: Click nodes to view detailed information
- **Connection Inspection**: Hover over edges to see relationship metrics
- **Context Menus**: Right-click for additional actions
- **Zoom Controls**: Mouse wheel and pan gestures
- **Full-Screen Mode**: Expand for detailed exploration

## 🔧 Advanced Configuration

### Custom Styling
Use CSS classes and inline styles to customize appearance:

```css
.kubiks-service-node {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.kubiks-connection-edge {
  stroke-width: 2px;
  stroke-dasharray: 5,5;
}
```

### Dynamic Variables
Reference dashboard variables in your configuration:

```javascript
{
  "type": "text",
  "value": "$service_version",
  "label": "Version"
}
```

### Health Status Integration
Configure status indicators based on metrics:

```javascript
{
  "type": "status", 
  "field": "health_status",
  "source": {
    "queryRef": "health_check"
  }
}
```

## 🛠️ Development

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/kubiks-inc/kubiks-grafana-plugin.git
cd kubiks-grafana-plugin

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Project Structure
```
src/
├── components/          # React components
├── containers/          # Container components  
├── lib/                # Utility libraries
├── panels/             # Panel implementations
├── store/              # State management
└── styles.css          # Global styles
```

### Technology Stack
- **React** 18.2+ with TypeScript
- **@xyflow/react** for interactive diagrams
- **Zustand** for state management  
- **TailwindCSS** for styling
- **D3** and **Dagre** for layout algorithms

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/kubiks-inc/kubiks-grafana-plugin/blob/main/CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm run test`)
6. Submit a pull request

## 📚 Documentation

- [Plugin Documentation](https://kubiks.ai/docs)
- [API Reference](https://kubiks.ai/docs/api)
- [Examples Repository](https://github.com/kubiks-inc/kubiks-examples)
- [Video Tutorials](https://kubiks.ai/tutorials)

## 🐛 Troubleshooting

### Common Issues

**Panel doesn't display data**
- Verify your queries return the expected data format
- Check the browser console for error messages
- Ensure field mappings match your data structure

**Performance issues with large graphs**
- Enable node simplification for better performance
- Consider using data filtering to reduce node count
- Adjust refresh intervals for less frequent updates

**Layout problems**
- Try different layout algorithms (tree, grid, force)
- Adjust canvas zoom and pan settings
- Clear browser cache and reload

### Getting Help

- [GitHub Issues](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues)
- [Community Discord](https://discord.gg/kubiks)
- [Support Email](mailto:support@kubiks.ai)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

**[Kubiks](https://kubiks.ai)** - Complete Visibility in the Clouds.
