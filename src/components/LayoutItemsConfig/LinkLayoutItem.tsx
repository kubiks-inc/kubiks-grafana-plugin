import React from 'react';
import { css } from '@emotion/css';
import { Input, Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';
import { getIconOptions, getIconUrlWithFallback } from '../../utils/iconMapper';
import { QueryLayoutItem } from './QueryLayoutItem';
import { DashboardLayoutItem } from './DashboardLayoutItem';

const sourceModeOptions = [
    { label: 'Query', value: 'query' },
    { label: 'Value', value: 'value' },
];

export const LinkLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);
    const iconOptions = getIconOptions();

    // If sourceType is dashboard, render dashboard-specific component
    if (layoutItem.sourceType === 'dashboard') {
        return (
            <BaseLayoutItem {...props}>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Source Mode</label>
                    <Select
                        value={layoutItem.sourceType || 'value'}
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
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Icon</label>
                    <Select
                        value={layoutItem.icon || ''}
                        options={iconOptions.map(icon => ({
                            label: icon.label,
                            value: icon.value
                        }))}
                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                            icon: option.value || ''
                        })}
                        width={20}
                        placeholder="Select icon"
                        isClearable
                        formatOptionLabel={(option) => {
                            const iconOption = iconOptions.find(icon => icon.value === option.value);
                            return (
                                <div className={styles.iconOption}>
                                    <img
                                        src={iconOption?.iconUrl || getIconUrlWithFallback(option.value || '')}
                                        alt={option.label}
                                        className={styles.iconPreview}
                                    />
                                    <span>{option.label}</span>
                                </div>
                            );
                        }}
                    />
                </div>
                <DashboardLayoutItem {...props} />
            </BaseLayoutItem>
        );
    }

    return (
        <BaseLayoutItem {...props}>
            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Label</label>
                <Input
                    value={layoutItem.label || ''}
                    onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                        label: e.currentTarget.value
                    })}
                    placeholder="Link text"
                    width={20}
                />
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Source Mode</label>
                <Select
                    value={layoutItem.sourceType || 'value'}
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
            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Icon</label>
                <Select
                    value={layoutItem.icon || ''}
                    options={iconOptions.map(icon => ({
                        label: icon.label,
                        value: icon.value
                    }))}
                    onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                        icon: option.value || ''
                    })}
                    width={20}
                    placeholder="Select icon"
                    isClearable
                    formatOptionLabel={(option) => {
                        const iconOption = iconOptions.find(icon => icon.value === option.value);
                        return (
                            <div className={styles.iconOption}>
                                <img
                                    src={iconOption?.iconUrl || getIconUrlWithFallback(option.value || '')}
                                    alt={option.label}
                                    className={styles.iconPreview}
                                />
                                <span>{option.label}</span>
                            </div>
                        );
                    }}
                />
            </div>
            {/* Show URL input for 'value' mode or default */}
            {(layoutItem.sourceType === 'value' || !layoutItem.sourceType) && (
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>URL</label>
                    <Input
                        value={layoutItem.value?.data?.toString() || ''}
                        onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                            value: { data: e.currentTarget.value }
                        })}
                        placeholder="https://example.com"
                        width={25}
                    />
                </div>
            )}
            {/* Show query selector for 'query' mode */}
            {layoutItem.sourceType === 'query' && (
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
    iconOption: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    iconPreview: css`
        width: 16px;
        height: 16px;
        object-fit: contain;
        flex-shrink: 0;
    `,
}); 
