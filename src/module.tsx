import React, { Suspense, lazy } from 'react';
import { AppPlugin, type AppRootProps } from '@grafana/data';
import { LoadingPlaceholder } from '@grafana/ui';
import type { AppConfigProps } from './components/AppConfig/AppConfig';
import { PanelPlugin } from '@grafana/data';
import { ServiceMapPanel } from './panels/ServiceMapPanel';
import { ServiceMapEditor } from './components/ServiceMapEditor';
import './styles.css';

const LazyApp = lazy(() => import('./components/App/App'));
const LazyAppConfig = lazy(() => import('./components/AppConfig/AppConfig'));

const App = (props: AppRootProps) => (
  <Suspense fallback={<LoadingPlaceholder text="" />}>
    <LazyApp {...props} />
  </Suspense>
);

const AppConfig = (props: AppConfigProps) => (
  <Suspense fallback={<LoadingPlaceholder text="" />}>
    <LazyAppConfig {...props} />
  </Suspense>
);

export const plugin = new PanelPlugin(ServiceMapPanel).setPanelOptions((builder) => {
  return builder.addCustomEditor({
    id: 'services',
    path: 'services',
    name: 'Service list',
    description: 'Define which services to include',
    editor: ServiceMapEditor,
    defaultValue: [],
  });
});