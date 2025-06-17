import { PanelPlugin } from '@grafana/data';
import { ServiceMapPanel } from './panels/ServiceMapPanel';
import { ServiceMapEditor } from './components/ServiceMapEditor';
import './styles.css';

export const plugin = new PanelPlugin(ServiceMapPanel).setPanelOptions((builder) => {
  return builder.addCustomEditor({
    id: 'service-map-editor',
    path: 'elements',
    name: 'Service Map Configuration',
    description: 'Configure the service map',
    editor: ServiceMapEditor,
    defaultValue: [],
  });
});