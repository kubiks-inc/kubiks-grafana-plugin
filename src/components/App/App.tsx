import React from 'react';
import { AppRootProps } from '@grafana/data';

interface Props extends AppRootProps {}

const App: React.FC<Props> = (props) => {
  return (
    <div>
      <h1>Kubiks Plugin</h1>
      <p>This is the main app component for the Kubiks plugin.</p>
    </div>
  );
};

export default App;
