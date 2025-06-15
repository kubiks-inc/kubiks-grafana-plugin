import React from 'react';
import { css } from '@emotion/css';
import { Input, Button, Select, useStyles2 } from '@grafana/ui';
import { DataQuery, GrafanaTheme2 } from '@grafana/data';
import { getQueryOptions, isValidQueryRef } from '../utils/queryUtils';
import { Element, LayoutItem } from '../lib/model/view';
import { LayoutItemsConfig } from './LayoutItemsConfig';

interface ElementsListProps {
    elements: Element[];
    queries?: DataQuery[];
    onChange: (elements: Element[]) => void;
}

export const ElementsList: React.FC<ElementsListProps> = ({ elements, queries = [], onChange }) => {
    const styles = useStyles2(getStyles);

    const handleNameChange = (index: number, event: React.FormEvent<HTMLInputElement>) => {
        const updated = [...elements];
        updated[index] = { ...updated[index], name: event.currentTarget.value };
        onChange(updated);
    };

    const handleTypeChange = (index: number, type: 'group' | 'element' | 'connection') => {
        const updated = [...elements];
        updated[index] = { ...updated[index], type };
        onChange(updated);
    };

    const handleSourceChange = (index: number, source: string) => {
        const updated = [...elements];
        updated[index] = { ...updated[index], source };
        onChange(updated);
    };

    const addElement = () => {
        onChange([...elements, {
            name: `Element ${elements.length + 1}`,
            type: 'element',
            source: '',
            layout: [],
            details: []
        }]);
    };

    const removeElement = (index: number) => {
        const updated = elements.filter((_, i) => i !== index);
        onChange(updated);
    };

    const addLayoutItem = (elementIndex: number) => {
        const updated = [...elements];
        const currentLayout = updated[elementIndex].layout || [];
        const newLayoutItem: LayoutItem = {
            type: 'text',
            label: `Field ${currentLayout.length + 1}`,
            source: '',
            sourceType: 'query'
        };
        updated[elementIndex] = {
            ...updated[elementIndex],
            layout: [...currentLayout, newLayoutItem]
        };
        onChange(updated);
    };

    const removeLayoutItem = (elementIndex: number, layoutIndex: number) => {
        const updated = [...elements];
        const currentLayout = updated[elementIndex].layout || [];
        updated[elementIndex] = {
            ...updated[elementIndex],
            layout: currentLayout.filter((_, i) => i !== layoutIndex)
        };
        onChange(updated);
    };

    const updateLayoutItem = (elementIndex: number, layoutIndex: number, updates: Partial<LayoutItem>) => {
        const updated = [...elements];
        const currentLayout = [...(updated[elementIndex].layout || [])];
        currentLayout[layoutIndex] = { ...currentLayout[layoutIndex], ...updates };
        updated[elementIndex] = { ...updated[elementIndex], layout: currentLayout };
        onChange(updated);
    };

    const addDetailsItem = (elementIndex: number) => {
        const updated = [...elements];
        const currentDetails = updated[elementIndex].details || [];
        const newDetailsItem: LayoutItem = {
            type: 'text',
            label: `Details Field ${currentDetails.length + 1}`,
            source: '',
            sourceType: 'query'
        };
        updated[elementIndex] = {
            ...updated[elementIndex],
            details: [...currentDetails, newDetailsItem]
        };
        onChange(updated);
    };

    const removeDetailsItem = (elementIndex: number, detailsIndex: number) => {
        const updated = [...elements];
        const currentDetails = updated[elementIndex].details || [];
        updated[elementIndex] = {
            ...updated[elementIndex],
            details: currentDetails.filter((_, i) => i !== detailsIndex)
        };
        onChange(updated);
    };

    const updateDetailsItem = (elementIndex: number, detailsIndex: number, updates: Partial<LayoutItem>) => {
        const updated = [...elements];
        const currentDetails = [...(updated[elementIndex].details || [])];
        currentDetails[detailsIndex] = { ...currentDetails[detailsIndex], ...updates };
        updated[elementIndex] = { ...updated[elementIndex], details: currentDetails };
        onChange(updated);
    };

    const typeOptions = [
        { label: 'Element', value: 'element' },
        { label: 'Group', value: 'group' },
        { label: 'Connection', value: 'connection' },
    ];

    const queryOptions = getQueryOptions(queries);

    return (
        <div className={styles.container}>
            <div className={styles.headerCard}>
                <h3 className={styles.title}>Service Map Configuration</h3>
                <p className={styles.description}>
                    Configure elements and their layout fields. Each element can have multiple layout fields that determine what information is displayed in the service map nodes.
                </p>
            </div>

            {elements.map((item, elementIndex) => (
                <div key={elementIndex} className={styles.elementCard}>
                    <div className={styles.elementHeader}>
                        <Input
                            value={item.name}
                            onChange={(e) => handleNameChange(elementIndex, e)}
                            placeholder={`${item.type === 'group' ? 'Group' : item.type === 'connection' ? 'Connection' : 'Element'} name`}
                            width={25}
                        />
                        <Select
                            value={item.type}
                            options={typeOptions}
                            onChange={(option) => handleTypeChange(elementIndex, option.value as 'group' | 'element' | 'connection')}
                            width={12}
                            placeholder="Type"
                        />
                        <Select
                            value={item.source}
                            options={queryOptions}
                            onChange={(option) => handleSourceChange(elementIndex, option.value || '')}
                            width={20}
                            placeholder="Select query (optional)"
                            isInvalid={typeof item.source === 'string' && item.source ? !isValidQueryRef(item.source, queries) : false}
                            isClearable
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => removeElement(elementIndex)}
                        >
                            Remove Element
                        </Button>
                    </div>

                    {/* Layout Configuration */}
                    <LayoutItemsConfig
                        element={item}
                        elementIndex={elementIndex}
                        elements={elements}
                        queries={queries}
                        onUpdateLayoutItem={updateLayoutItem}
                        onAddLayoutItem={addLayoutItem}
                        onRemoveLayoutItem={removeLayoutItem}
                    />

                    {/* Details View Configuration */}
                    <div className={styles.detailsSection}>
                        <h4 className={styles.sectionTitle}>Details View</h4>
                        <p className={styles.sectionDescription}>
                            Configure layout items that will be displayed when a user clicks on this element in the service map.
                        </p>
                        <LayoutItemsConfig
                            element={{ ...item, layout: item.details || [] }}
                            elementIndex={elementIndex}
                            elements={elements}
                            queries={queries}
                            onUpdateLayoutItem={updateDetailsItem}
                            onAddLayoutItem={addDetailsItem}
                            onRemoveLayoutItem={removeDetailsItem}
                        />
                    </div>
                </div>
            ))}
            <Button onClick={addElement}>Add Element</Button>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        padding: ${theme.spacing(2)};
        background: ${theme.colors.background.primary};
        color: ${theme.colors.text.primary};
    `,
    headerCard: css`
        margin-bottom: ${theme.spacing(2)};
        padding: ${theme.spacing(1.5)};
        background: ${theme.colors.background.secondary};
        border: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default};
    `,
    title: css`
        margin: 0;
        margin-bottom: ${theme.spacing(1)};
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    description: css`
        margin: 0;
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        line-height: 1.4;
    `,
    elementCard: css`
        border: 1px solid ${theme.colors.border.medium};
        padding: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
        border-radius: ${theme.shape.radius.default};
        background: ${theme.colors.background.secondary};
    `,
    elementHeader: css`
        display: flex;
        gap: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(1.5)};
        align-items: center;
        flex-wrap: wrap;
    `,
    detailsSection: css`
        margin-top: ${theme.spacing(2)};
        padding-top: ${theme.spacing(2)};
        border-top: 1px solid ${theme.colors.border.weak};
    `,
    sectionTitle: css`
        margin: 0;
        margin-bottom: ${theme.spacing(0.5)};
        font-size: ${theme.typography.h6.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    sectionDescription: css`
        margin: 0;
        margin-bottom: ${theme.spacing(1.5)};
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        line-height: 1.4;
    `,

}); 