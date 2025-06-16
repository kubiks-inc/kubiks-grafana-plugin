import React from 'react';
import { Input, Button, Select } from '@grafana/ui';
import { DataQuery } from '@grafana/data';
import { getQueryOptions, isValidQueryRef } from '../utils/queryUtils';
import { LayoutItem } from '../lib/model/view';

export interface Element {
    name: string;
    type: 'group' | 'element';
    source?: string; // Query reference ID
    layout?: LayoutItem[]; // Array of configurable layout items
}

interface ElementsListProps {
    elements: Element[];
    queries?: DataQuery[];
    onChange: (elements: Element[]) => void;
}

export const ElementsList: React.FC<ElementsListProps> = ({ elements, queries = [], onChange }) => {
    const handleNameChange = (index: number, event: React.FormEvent<HTMLInputElement>) => {
        const updated = [...elements];
        updated[index] = { ...updated[index], name: event.currentTarget.value };
        onChange(updated);
    };

    const handleTypeChange = (index: number, type: 'group' | 'element') => {
        const updated = [...elements];
        updated[index] = { ...updated[index], type };
        onChange(updated);
    };

    const handleSourceChange = (index: number, source: string) => {
        const updated = [...elements];
        updated[index] = { ...updated[index], source };
        onChange(updated);
    };

    const handleLayoutChange = (elementIndex: number, layoutItems: LayoutItem[]) => {
        const updated = [...elements];
        updated[elementIndex] = { ...updated[elementIndex], layout: layoutItems };
        onChange(updated);
    };

    const addElement = () => {
        onChange([...elements, {
            name: `Element ${elements.length + 1}`,
            type: 'element',
            source: '',
            layout: []
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
            source: ''
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

    const typeOptions = [
        { label: 'Element', value: 'element' },
        { label: 'Group', value: 'group' },
    ];

    const layoutTypeOptions = [
        { label: 'Title', value: 'title' },
        { label: 'Parent ID', value: 'parentId' },
        { label: 'Text', value: 'text' },
        { label: 'Tags', value: 'tags' },
        { label: 'Key-Value', value: 'keyValue' },
        { label: 'Progress', value: 'progress' },
        { label: 'Inversed Progress', value: 'inversed_progress' },
        { label: 'Blocks', value: 'blocks' },
        { label: 'Links', value: 'links' },
        { label: 'Icon', value: 'icon' },
        { label: 'Status', value: 'status' },
    ];

    const queryOptions = getQueryOptions(queries);

    return (
        <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <h3>Service Map Configuration</h3>
                <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
                    Configure elements and their layout fields. Each element can have multiple layout fields that determine what information is displayed in the service map nodes.
                </p>
            </div>

            {elements.map((item, elementIndex) => (
                <div key={elementIndex} style={{
                    border: '1px solid #ccc',
                    padding: '16px',
                    marginBottom: '16px',
                    borderRadius: '4px',
                    backgroundColor: '#fafafa'
                }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                        <Input
                            value={item.name}
                            onChange={(e) => handleNameChange(elementIndex, e)}
                            placeholder={`${item.type === 'group' ? 'Group' : 'Element'} name`}
                            width={25}
                        />
                        <Select
                            value={item.type}
                            options={typeOptions}
                            onChange={(option) => handleTypeChange(elementIndex, option.value as 'group' | 'element')}
                            width={12}
                            placeholder="Type"
                        />
                        <Select
                            value={item.source || ''}
                            options={queryOptions}
                            onChange={(option) => handleSourceChange(elementIndex, option.value || '')}
                            width={20}
                            placeholder="Select query (optional)"
                            isInvalid={item.source ? !isValidQueryRef(item.source, queries) : false}
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
                    <div style={{ marginTop: '12px' }}>
                        <h4 style={{ marginBottom: '8px', color: '#333' }}>Layout Fields</h4>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                            Configure what fields are displayed in this element's service map node
                        </p>
                        {(item.layout || []).map((layoutItem, layoutIndex) => (
                            <div key={layoutIndex} style={{
                                backgroundColor: '#ffffff',
                                padding: '12px',
                                marginBottom: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <Select
                                        value={layoutItem.type}
                                        options={layoutTypeOptions}
                                        onChange={(option) => updateLayoutItem(elementIndex, layoutIndex, {
                                            type: option.value as LayoutItem['type']
                                        })}
                                        width={15}
                                        placeholder="Field Type"
                                    />
                                    <Input
                                        value={layoutItem.label || ''}
                                        onChange={(e) => updateLayoutItem(elementIndex, layoutIndex, {
                                            label: e.currentTarget.value
                                        })}
                                        placeholder="Display label"
                                        width={20}
                                    />
                                    <Select
                                        value={layoutItem.source || ''}
                                        options={queryOptions}
                                        onChange={(option) => updateLayoutItem(elementIndex, layoutIndex, {
                                            source: option.value || ''
                                        })}
                                        width={20}
                                        placeholder="Data source query"
                                        isClearable
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeLayoutItem(elementIndex, layoutIndex)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => addLayoutItem(elementIndex)}
                        >
                            Add Layout Field
                        </Button>
                    </div>
                </div>
            ))}
            <Button onClick={addElement}>Add Element</Button>
        </div>
    );
}; 