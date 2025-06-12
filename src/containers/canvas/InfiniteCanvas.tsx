import React from 'react';
import '@xyflow/react/dist/style.css';
import { ReactFlow, Controls, Background } from '@xyflow/react';

export const InfiniteCanvas = ({data}: {data: any}) => {
    console.log(data);
    return (
        <div style={{ height: '100%' }}>
          <ReactFlow>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      );
};