# Kubiks Service Map Panel

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/kubiks-kubiks-panel&label=Marketplace&prefix=v&color=F47A20)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org/)

A comprehensive service map visualization panel that transforms complex distributed systems into intuitive, interactive diagrams. Kubiks provides a **single pane of glass** for monitoring your entire infrastructure - from microservices and databases to CDNs, load balancers, and cloud components - all visualized in real-time with deep observability integration.

![Service Map Overview](https://raw.githubusercontent.com/kubiks-inc/kubiks-grafana-plugin/main/src/img/servicemap.png)

## 🌟 Key Features & Capabilities

### Interactive Service Maps
- **Real-time visualization** of your complete system architecture and dependencies
- **Interactive nodes** with one-click access to detailed service information, metrics, and logs
- **Dynamic layouts** with multiple arrangement options (tree, grid, force-directed)

### Comprehensive Data Integration
- **Multi-query support** - combine data from any Grafana-supported data sources and custom APIs
- **Standards-compliant** - works with industry-standard observability formats and protocols
- **Node graph compatibility** - seamlessly works with Grafana's node graph data format
- **Custom data mapping** - flexible field mapping for proprietary monitoring systems
- **Real-time updates** - automatically refreshes as your infrastructure evolves

### Embedded Observability Panels
- **Integrated dashboards** - embed any Grafana panel directly into service nodes
- **Contextual metrics** - CPU, memory, error rates, and custom KPIs displayed inline
- **Dynamic linking** - automatic links to logs, traces, metrics, and any external tools
- **Variable propagation** - seamlessly pass service context to embedded panels

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

### Metrics Data Sources
```
# Services discovery from any metrics system
Query services and their metrics from your configured data sources
```

### Distributed Tracing
```
# Service topology from tracing data
Query service relationships and dependencies from your tracing systems
```

### Custom APIs
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

## Interaction Features

- **Node Selection**: Click nodes to view detailed information
- **Connection Inspection**: Hover over edges to see relationship metrics
- **Context Menus**: Right-click for additional actions
- **Zoom Controls**: Mouse wheel and pan gestures
- **Full-Screen Mode**: Expand for detailed exploration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/kubiks-inc/kubiks-grafana-plugin/blob/main/CONTRIBUTING.md) for details.

### Getting Help & Support

- [GitHub Issues](https://github.com/kubiks-inc/kubiks-grafana-plugin/issues) - Bug reports and feature requests

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

**[Kubiks](https://kubiks.ai)** - Complete Visibility in the Clouds.