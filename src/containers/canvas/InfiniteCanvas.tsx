import React from 'react';
import '@xyflow/react/dist/style.css';
import { ReactFlow, Controls, Background } from '@xyflow/react';

export const InfiniteCanvas = () => {
    return (
        <div style={{ height: '100%' }}>
          <ReactFlow>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      );
};