import React from 'react';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';

export const TitleLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    return (
        <BaseLayoutItem {...props}>
            {/* Title type doesn't need additional configuration */}
        </BaseLayoutItem>
    );
}; 
