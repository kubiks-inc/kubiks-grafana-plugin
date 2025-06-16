import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { Element, LayoutItem } from '../../lib/model/view';
import { BaseLayoutItemProps } from './types';
import { IconLayoutItem } from './IconLayoutItem';
import { ParentIdLayoutItem } from './ParentIdLayoutItem';
import { TitleLayoutItem } from './TitleLayoutItem';
import { StatusLayoutItem } from './StatusLayoutItem';
import { SourceModeLayoutItem } from './SourceModeLayoutItem';

interface LayoutItemsConfigProps {
    element: Element;
    elementIndex: number;
    elements: Element[];
    queries: string[];
    data: DataFrame[];
    onUpdateLayoutItem: (elementIndex: number, layoutIndex: number, updates: Partial<LayoutItem>) => void;
    onAddLayoutItem: (elementIndex: number) => void;
    onRemoveLayoutItem: (elementIndex: number, layoutIndex: number) => void;
}

export const LayoutItemsConfig: React.FC<LayoutItemsConfigProps> = ({
    element,
    elementIndex,
    elements,
    queries,
    data,
    onUpdateLayoutItem,
    onAddLayoutItem,
    onRemoveLayoutItem
}) => {
    const styles = useStyles2(getStyles);

    const renderLayoutItem = (layoutItem: LayoutItem, layoutIndex: number) => {
        const baseProps: BaseLayoutItemProps = {
            layoutItem,
            elementIndex,
            layoutIndex,
            element,
            elements,
            queries,
            data,
            onUpdateLayoutItem,
            onRemoveLayoutItem
        };

        switch (layoutItem.type) {
            case 'icon':
                return <IconLayoutItem key={layoutIndex} {...baseProps} />;
            case 'parentId':
                return <ParentIdLayoutItem key={layoutIndex} {...baseProps} />;
            case 'title':
                return <TitleLayoutItem key={layoutIndex} {...baseProps} />;
            case 'status':
                return <StatusLayoutItem key={layoutIndex} {...baseProps} />;
            case 'text':
            case 'tags':
            case 'keyValue':
            case 'progress':
            case 'inversed_progress':
            case 'blocks':
            case 'link':
            case 'panel':
            default:
                return <SourceModeLayoutItem key={layoutIndex} {...baseProps} />;
        }
    };

    return (
        <div className={styles.layoutSection}>
            <h4 className={styles.sectionTitle}>Layout Fields</h4>
            <p className={styles.sectionDescription}>
                Configure what fields are displayed in this element's service map node
            </p>
            {(element.layout || []).map((layoutItem, layoutIndex) =>
                renderLayoutItem(layoutItem, layoutIndex)
            )}
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onAddLayoutItem(elementIndex)}
            >
                Add Layout Field
            </Button>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    layoutSection: css`
        margin-top: ${theme.spacing(1.5)};
    `,
    sectionTitle: css`
        margin: 0;
        margin-bottom: ${theme.spacing(1)};
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    sectionDescription: css`
        margin: 0;
        margin-bottom: ${theme.spacing(1)};
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        line-height: 1.4;
    `,
}); 