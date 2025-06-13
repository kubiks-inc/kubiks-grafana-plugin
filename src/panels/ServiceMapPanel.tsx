import React from 'react';
import { PanelProps } from '@grafana/data';

interface Props extends PanelProps { }

// Helper function to safely stringify data with circular references
const safeStringify = (obj: any): string => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    }, 2);
};

export const ServiceMapPanel: React.FC<Props> = ({ width, height, data }) => {
    return (
        <div style={{
            width,
            height,
            overflow: 'auto',
            padding: '10px'
        }}>
            <h3>🗺️ Service Map Panel</h3>
            <pre style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
            }}>{safeStringify(data.series)}</pre>
        </div>
    );
};