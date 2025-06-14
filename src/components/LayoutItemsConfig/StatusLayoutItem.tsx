import React from 'react';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';

export const StatusLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    return (
        <BaseLayoutItem {...props}>
            {/* Status type doesn't need additional configuration */}
        </BaseLayoutItem>
    );
}; 