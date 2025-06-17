import React from 'react';
import { css } from '@emotion/css';
import { Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';

export const ParentIdLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, elements, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);

    // Get group elements for parentId dropdown
    const groupElements = elements.filter(el => el.type === 'group').map(el => ({
        label: el.name,
        value: el.name
    }));

    return (
        <BaseLayoutItem {...props}>
            <div className={styles.parentIdSelectorContainer}>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Parent Group</label>
                    <Select
                        value={layoutItem.value?.data?.toString() || ''}
                        options={groupElements}
                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                            source: undefined,
                            sourceType: 'value',
                            value: { data: option.value || '' }
                        })}
                        width={25}
                        placeholder="Select parent group"
                        isClearable
                    />
                </div>
            </div>
        </BaseLayoutItem>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    parentIdSelectorContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
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
