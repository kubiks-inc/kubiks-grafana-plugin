import React from 'react';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Element, LayoutItem } from '../../lib/model/view';
import { BaseLayoutItemProps } from './types';
import { IconLayoutItem } from './IconLayoutItem';
import { ParentIdLayoutItem } from './ParentIdLayoutItem';
import { TitleLayoutItem } from './TitleLayoutItem';
import { StatusLayoutItem } from './StatusLayoutItem';
import { LinkLayoutItem } from './LinkLayoutItem';
import { PanelLayoutItem } from './PanelLayoutItem';
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
    onReorderLayoutItems: (elementIndex: number, sourceIndex: number, destinationIndex: number) => void;
}

export const LayoutItemsConfig: React.FC<LayoutItemsConfigProps> = ({
    element,
    elementIndex,
    elements,
    queries,
    data,
    onUpdateLayoutItem,
    onAddLayoutItem,
    onRemoveLayoutItem,
    onReorderLayoutItems
}) => {
    const styles = useStyles2(getStyles);

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        // If there's no destination or the item is dropped in the same position, do nothing
        if (!destination || (destination.index === source.index)) {
            return;
        }

        onReorderLayoutItems(elementIndex, source.index, destination.index);
    };

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
            case 'link':
                return <LinkLayoutItem key={layoutIndex} {...baseProps} />;
            case 'panel':
                return <PanelLayoutItem key={layoutIndex} {...baseProps} />;
            case 'text':
            case 'tags':
            case 'keyValue':
            case 'progress':
            case 'inversed_progress':
            case 'blocks':
            default:
                return <SourceModeLayoutItem key={layoutIndex} {...baseProps} />;
        }
    };

    return (
        <div className={styles.layoutSection}>
            <h4 className={styles.sectionTitle}>Layout Fields</h4>
            <p className={styles.sectionDescription}>
                Configure what fields are displayed in this element&apos;s service map node
            </p>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`layout-items-${elementIndex}`}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={snapshot.isDraggingOver ? styles.dragTarget : undefined}
                        >
                            {(element.layout || []).map((layoutItem, layoutIndex) => (
                                <Draggable
                                    key={`layout-item-${layoutIndex}`}
                                    draggableId={`layout-item-${elementIndex}-${layoutIndex}`}
                                    index={layoutIndex}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`${styles.draggableItem} ${snapshot.isDragging ? styles.dragging : ''
                                                }`}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className={styles.dragHandle}
                                            >
                                                ⋮⋮
                                            </div>
                                            <div className={styles.itemContent}>
                                                {renderLayoutItem(layoutItem, layoutIndex)}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
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
    dragTarget: css`
        background-color: ${theme.colors.emphasize(theme.colors.background.secondary, 0.03)};
        border-radius: ${theme.shape.radius.default};
        transition: background-color 0.2s ease;
    `,
    draggableItem: css`
        display: flex;
        align-items: flex-start;
        gap: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(1)};
        background: ${theme.colors.background.primary};
        border: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default};
        transition: all 0.2s ease;
        
        &:hover {
            border-color: ${theme.colors.border.strong};
        }
    `,
    dragging: css`
        transform: rotate(2deg);
        box-shadow: ${theme.shadows.z3};
        border-color: ${theme.colors.primary.border};
    `,
    dragHandle: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        min-height: 40px;
        cursor: grab;
        color: ${theme.colors.text.secondary};
        font-size: 14px;
        line-height: 1;
        letter-spacing: -1px;
        background: ${theme.colors.background.secondary};
        border-right: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default} 0 0 ${theme.shape.radius.default};
        
        &:hover {
            color: ${theme.colors.text.primary};
            background: ${theme.colors.emphasize(theme.colors.background.secondary, 0.03)};
        }
        
        &:active {
            cursor: grabbing;
        }
    `,
    itemContent: css`
        flex: 1;
        min-width: 0;
    `,
}); 
