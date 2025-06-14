import React from 'react';
import { css } from '@emotion/css';
import { Button, Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { LayoutItem } from '../../lib/model/view';

interface BaseLayoutItemComponentProps extends BaseLayoutItemProps {
    children?: React.ReactNode;
    showTypeSelector?: boolean;
}

const layoutTypeOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Parent ID', value: 'parentId' },
    { label: 'Text', value: 'text' },
    { label: 'Tags', value: 'tags' },
    { label: 'Key-Value', value: 'keyValue' },
    { label: 'Progress', value: 'progress' },
    { label: 'Inversed Progress', value: 'inversed_progress' },
    { label: 'Blocks', value: 'blocks' },
    { label: 'Link', value: 'link' },
    { label: 'Icon', value: 'icon' },
    { label: 'Status', value: 'status' },
    { label: 'Panel', value: 'panel' },
];

export const BaseLayoutItem: React.FC<BaseLayoutItemComponentProps> = ({
    layoutItem,
    elementIndex,
    layoutIndex,
    onUpdateLayoutItem,
    onRemoveLayoutItem,
    children,
    showTypeSelector = true
}) => {
    const styles = useStyles2(getStyles);

    return (
        <div className={styles.layoutItem}>
            <div className={styles.layoutItemHeader}>
                {showTypeSelector && (
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Field Type</label>
                        <Select
                            value={layoutItem.type}
                            options={layoutTypeOptions}
                            onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                type: option.value as LayoutItem['type']
                            })}
                            width={15}
                            placeholder="Field Type"
                        />
                    </div>
                )}
                {children}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveLayoutItem(elementIndex, layoutIndex)}
                    className={styles.removeButton}
                >
                    Remove
                </Button>
            </div>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    layoutItem: css`
        background: ${theme.colors.background.canvas};
        padding: ${theme.spacing(1.5)};
        margin-bottom: ${theme.spacing(1)};
        border-radius: ${theme.shape.radius.default};
        border: 1px solid ${theme.colors.border.weak};
    `,
    layoutItemHeader: css`
        display: flex;
        gap: ${theme.spacing(1)};
        align-items: flex-end;
        flex-wrap: wrap;
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
    removeButton: css`
        height: 32px;
        align-self: flex-end;
    `,
}); 