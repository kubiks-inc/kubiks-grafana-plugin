import React from 'react';
import { css } from '@emotion/css';
import { Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';
import { getIconOptions, getIconUrlWithFallback } from '../../utils/iconMapper';

export const IconLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);
    const iconOptions = getIconOptions();

    return (
        <BaseLayoutItem {...props}>
            <div className={styles.iconSelectorContainer}>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Icon</label>
                    <Select
                        value={layoutItem.value?.data?.toString() || ''}
                        options={iconOptions.map(icon => ({
                            label: icon.label,
                            value: icon.value
                        }))}
                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                            source: undefined,
                            value: { data: option.value || '' }
                        })}
                        width={25}
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
            </div>
        </BaseLayoutItem>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    iconSelectorContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
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