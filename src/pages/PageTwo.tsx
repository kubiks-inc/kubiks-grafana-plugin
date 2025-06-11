import React, { useState } from 'react';
import { Button } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { ServiceDrawer, ServiceCard } from '../components/ServiceDrawer';

function PageTwo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sample service data to demonstrate the scrolling fix
  const sampleServices: ServiceCard[] = [
    {
      id: '1',
      title: 'Web API Service',
      description: 'Main API service handling web requests',
      status: 'running',
    },
    {
      id: '2',
      title: 'Database Service',
      description: 'PostgreSQL database instance',
      status: 'running',
    },
    {
      id: '3',
      title: 'Redis Cache',
      description: 'In-memory cache for session management',
      status: 'running',
    },
    {
      id: '4',
      title: 'Message Queue',
      description: 'RabbitMQ service for async processing',
      status: 'pending',
    },
    {
      id: '5',
      title: 'File Storage',
      description: 'S3-compatible object storage service',
      status: 'stopped',
    },
    {
      id: '6',
      title: 'Monitoring Service',
      description: 'Prometheus metrics collection',
      status: 'running',
    },
    {
      id: '7',
      title: 'Logging Service',
      description: 'Centralized logging with ELK stack',
      status: 'running',
    },
    {
      id: '8',
      title: 'Authentication Service',
      description: 'OAuth2 authentication provider',
      status: 'running',
    },
    {
      id: '9',
      title: 'Notification Service',
      description: 'Email and SMS notification handler',
      status: 'pending',
    },
    {
      id: '10',
      title: 'Analytics Service',
      description: 'Data analytics and reporting engine',
      status: 'stopped',
    },
    {
      id: '11',
      title: 'Search Service',
      description: 'Elasticsearch search indexing',
      status: 'running',
    },
    {
      id: '12',
      title: 'Backup Service',
      description: 'Automated backup and restore system',
      status: 'running',
    },
  ];

  return (
    <PluginPage>
      <div data-testid={testIds.pageTwo.container}>
        <p>This is page two.</p>
        <p>Click the button below to open the Service Drawer with fixed scrolling:</p>
        <Button onClick={() => setIsDrawerOpen(true)}>
          Open Service Drawer
        </Button>
        
        <ServiceDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          services={sampleServices}
        />
      </div>
    </PluginPage>
  );
}

export default PageTwo;
