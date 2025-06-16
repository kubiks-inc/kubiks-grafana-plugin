import React from 'react';
import { css } from '@emotion/css';
import { Input, Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';
import { QueryLayoutItem } from './QueryLayoutItem';
import { ValueLayoutItem } from './ValueLayoutItem';
import { DashboardLayoutItem } from './DashboardLayoutItem';

const sourceModeOptions = [
    { label: 'Query', value: 'query' },
    { label: 'Value', value: 'value' },
];

export const SourceModeLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);

    // If sourceType is set and is not query, render specific component
    if (layoutItem.sourceType === 'value') {
        return <ValueLayoutItem {...props} />;
    }

    if (layoutItem.sourceType === 'dashboard') {
        return <DashboardLayoutItem {...props} />;
    }

    // Default to query or when sourceType is explicitly 'query'
    return (
        <BaseLayoutItem {...props}>
            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Label</label>
                <Input
                    value={layoutItem.label || ''}
                    onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                        label: e.currentTarget.value
                    })}
                    placeholder="Display label"
                    width={20}
                />
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Source Mode</label>
                <Select
                    value={layoutItem.sourceType || 'query'}
                    options={sourceModeOptions}
                    onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                        sourceType: option.value as 'query' | 'value',
                        ...(option.value === 'query' ? { value: undefined, source: undefined } :
                            option.value === 'value' ? { source: undefined } : {})
                    })}
                    width={12}
                    placeholder="Source Mode"
                />
            </div>
            {(layoutItem.sourceType === 'query' || !layoutItem.sourceType) && (
                <QueryLayoutItem {...props} />
            )}
        </BaseLayoutItem>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(0.5)};
    `,
    inputLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.secondary};
    `,
}); 