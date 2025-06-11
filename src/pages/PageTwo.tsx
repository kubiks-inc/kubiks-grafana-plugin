import React from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';

function PageTwo() {
  return (
    <PluginPage>
      <div data-testid={testIds.pageTwo.container}>
        <p className="text-8xl">Hello world!</p>
      </div>
    </PluginPage>
  );
}

export default PageTwo;
