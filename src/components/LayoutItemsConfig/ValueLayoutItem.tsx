import React from 'react';
import { css } from '@emotion/css';
import { Input, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';

export const ValueLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);

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
                <label className={styles.inputLabel}>Value</label>
                <Input
                    value={layoutItem.value?.data?.toString() || ''}
                    onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                        value: { data: e.currentTarget.value }
                    })}
                    placeholder="Enter value"
                    width={20}
                />
            </div>
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