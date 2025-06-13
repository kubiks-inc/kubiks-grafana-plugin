import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import {
    Input,
    Button,
    Select,
    Field,
    FieldSet,
    IconButton,
    Collapse,
    Badge,
    HorizontalGroup,
    VerticalGroup,
    RadioButtonGroup,
    TextArea
} from '@grafana/ui';

// Types for the service map configuration
interface LayoutItem {
    id: number;
    label: string;
    selector: string;
    selectorType: string;
    type: 'text' | 'tags' | 'keyValue' | 'progress' | 'inversed_progress' | 'blocks' | 'links' | 'title' | 'status';
    queryRef?: string;
    value?: {
        data: any;
    };
}

interface ServiceMapElement {
    id: number;
    component: 'group_component' | 'element_component';
    icon?: string;
    integrationId?: number;
    key: string;
    layout: LayoutItem[];
    order: number;
    parentId?: string;
    type: string;
    queryRef?: string;
    title?: string;
    detailsLayout?: LayoutItem[];
}

interface ServiceMapConfig {
    elements: ServiceMapElement[];
    customElements: ServiceMapElement[];
}

interface Props extends StandardEditorProps<ServiceMapConfig> { }

const layoutTypeOptions = [
    { label: 'Text', value: 'text' },
    { label: 'Tags', value: 'tags' },
    { label: 'Key-Value', value: 'keyValue' },
    { label: 'Progress', value: 'progress' },
    { label: 'Inverse Progress', value: 'inversed_progress' },
    { label: 'Blocks', value: 'blocks' },
    { label: 'Links', value: 'links' },
    { label: 'Title', value: 'title' },
    { label: 'Status', value: 'status' },
];

const selectorTypeOptions = [
    { label: 'Record', value: 'record' },
    { label: 'K8s Pod', value: 'k8s-pod' },
    { label: 'Cloudflare', value: 'cloudflare' },
    { label: 'Custom', value: 'custom' },
];

const componentTypeOptions = [
    { label: 'Group', value: 'group_component' },
    { label: 'Element', value: 'element_component' },
];

export const ServiceMapEditor: React.FC<Props> = ({ value = { elements: [], customElements: [] }, onChange }) => {
    const [expandedElements, setExpandedElements] = useState<Set<number>>(new Set());
    const [expandedLayout, setExpandedLayout] = useState<Set<string>>(new Set());

    const toggleElementExpanded = (id: number) => {
        const newExpanded = new Set(expandedElements);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedElements(newExpanded);
    };

    const toggleLayoutExpanded = (key: string) => {
        const newExpanded = new Set(expandedLayout);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedLayout(newExpanded);
    };

    const addElement = (isCustom: boolean = false) => {
        const newElement: ServiceMapElement = {
            id: Date.now(),
            component: 'element_component',
            key: `${isCustom ? 'custom-' : ''}element-${Date.now()}`,
            layout: [],
            order: isCustom ? value.customElements?.length || 0 : value.elements?.length || 0,
            type: '',
            title: 'New Element'
        };

        const newConfig = { ...value };

        if (isCustom) {
            newConfig.customElements = [...newConfig.customElements ?? [], newElement];
        } else {
            newConfig.elements = [...newConfig.elements ?? [], newElement];
        }
        onChange(newConfig);
    };

    const updateElement = (id: number, updates: Partial<ServiceMapElement>, isCustom: boolean = false) => {
        const newConfig = { ...value };
        const elements = isCustom ? newConfig.customElements : newConfig.elements;
        const index = elements.findIndex(el => el.id === id);

        if (index !== -1) {
            elements[index] = { ...elements[index], ...updates };
            onChange(newConfig);
        }
    };

    const removeElement = (id: number, isCustom: boolean = false) => {
        const newConfig = { ...value };
        if (isCustom) {
            newConfig.customElements = newConfig.customElements.filter(el => el.id !== id);
        } else {
            newConfig.elements = newConfig.elements.filter(el => el.id !== id);
        }
        onChange(newConfig);
    };

    const addLayoutItem = (elementId: number, isCustom: boolean = false, isDetails: boolean = false) => {
        const newLayoutItem: LayoutItem = {
            id: Date.now(),
            label: 'New Layout Item',
            selector: '',
            selectorType: 'record',
            type: 'text'
        };

        const newConfig = { ...value };
        const elements = isCustom ? newConfig.customElements : newConfig.elements;
        const element = elements.find(el => el.id === elementId);

        if (element) {
            if (isDetails) {
                element.detailsLayout = [...(element.detailsLayout || []), newLayoutItem];
            } else {
                element.layout = [...element.layout, newLayoutItem];
            }
            onChange(newConfig);
        }
    };

    const updateLayoutItem = (elementId: number, layoutId: number, updates: Partial<LayoutItem>, isCustom: boolean = false, isDetails: boolean = false) => {
        const newConfig = { ...value };
        const elements = isCustom ? newConfig.customElements : newConfig.elements;
        const element = elements.find(el => el.id === elementId);

        if (element) {
            const layout = isDetails ? (element.detailsLayout || []) : element.layout;
            const index = layout.findIndex(item => item.id === layoutId);

            if (index !== -1) {
                layout[index] = { ...layout[index], ...updates };
                if (isDetails) {
                    element.detailsLayout = layout;
                } else {
                    element.layout = layout;
                }
                onChange(newConfig);
            }
        }
    };

    const removeLayoutItem = (elementId: number, layoutId: number, isCustom: boolean = false, isDetails: boolean = false) => {
        const newConfig = { ...value };
        const elements = isCustom ? newConfig.customElements : newConfig.elements;
        const element = elements.find(el => el.id === elementId);

        if (element) {
            if (isDetails) {
                element.detailsLayout = (element.detailsLayout || []).filter(item => item.id !== layoutId);
            } else {
                element.layout = element.layout.filter(item => item.id !== layoutId);
            }
            onChange(newConfig);
        }
    };

    const renderLayoutItem = (elementId: number, layoutItem: LayoutItem, isCustom: boolean = false, isDetails: boolean = false) => {
        const layoutKey = `${elementId}-${layoutItem.id}-${isDetails ? 'details' : 'main'}`;
        const isExpanded = expandedLayout.has(layoutKey);

        return (
            <div key={layoutItem.id} style={{ border: '1px solid #444', borderRadius: '4px', padding: '12px', marginBottom: '8px' }}>
                <HorizontalGroup justify="space-between">
                    <HorizontalGroup>
                        <Badge color="blue" text={layoutItem.type} />
                        <span>{layoutItem.label || 'Unnamed Layout Item'}</span>
                        {layoutItem.queryRef && <Badge color="green" text={`Query: ${layoutItem.queryRef}`} />}
                    </HorizontalGroup>
                    <HorizontalGroup>
                        <IconButton
                            name={isExpanded ? "angle-up" : "angle-down"}
                            onClick={() => toggleLayoutExpanded(layoutKey)}
                            tooltip="Toggle layout item"
                        />
                        <IconButton
                            name="trash-alt"
                            onClick={() => removeLayoutItem(elementId, layoutItem.id, isCustom, isDetails)}
                            tooltip="Remove layout item"
                        />
                    </HorizontalGroup>
                </HorizontalGroup>

                <Collapse isOpen={isExpanded}>
                    <VerticalGroup spacing="sm">
                        <Field label="Label">
                            <Input
                                value={layoutItem.label}
                                onChange={(e) => updateLayoutItem(elementId, layoutItem.id, { label: e.currentTarget.value }, isCustom, isDetails)}
                                placeholder="Layout item label"
                            />
                        </Field>

                        <Field label="Type">
                            <Select
                                value={layoutItem.type}
                                options={layoutTypeOptions}
                                onChange={(option) => updateLayoutItem(elementId, layoutItem.id, { type: option.value as LayoutItem['type'] }, isCustom, isDetails)}
                            />
                        </Field>

                        <Field label="Selector Type">
                            <Select
                                value={layoutItem.selectorType}
                                options={selectorTypeOptions}
                                onChange={(option) => updateLayoutItem(elementId, layoutItem.id, { selectorType: option.value }, isCustom, isDetails)}
                            />
                        </Field>

                        <Field label="Selector">
                            <TextArea
                                value={layoutItem.selector}
                                onChange={(e) => updateLayoutItem(elementId, layoutItem.id, { selector: e.currentTarget.value }, isCustom, isDetails)}
                                placeholder="JQ selector or expression"
                                rows={3}
                            />
                        </Field>

                        <Field label="Query Reference (Optional)">
                            <Input
                                value={layoutItem.queryRef || ''}
                                onChange={(e) => updateLayoutItem(elementId, layoutItem.id, { queryRef: e.currentTarget.value }, isCustom, isDetails)}
                                placeholder="e.g., A, B, C"
                            />
                        </Field>
                    </VerticalGroup>
                </Collapse>
            </div>
        );
    };

    const renderElement = (element: ServiceMapElement, isCustom: boolean = false) => {
        const isExpanded = expandedElements.has(element.id);
        const parentOptions = [
            { label: 'None', value: '' },
            ...(value.elements ?? []).filter(el => el.component === 'group_component' && el.id !== element.id)
                .map(el => ({ label: el.title || el.key, value: el.key })),
            ...(value.customElements ?? []).filter(el => el.component === 'group_component' && el.id !== element.id)
                .map(el => ({ label: el.title || el.key, value: el.key }))
        ];

        return (
            <div key={element.id} style={{ border: '2px solid #666', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
                <HorizontalGroup justify="space-between">
                    <HorizontalGroup>
                        <Badge color={element.component === 'group_component' ? 'purple' : 'blue'}
                            text={element.component === 'group_component' ? 'Group' : 'Element'} />
                        <span style={{ fontWeight: 'bold' }}>{element.title || element.key}</span>
                        {element.queryRef && <Badge color="green" text={`Query: ${element.queryRef}`} />}
                        {element.parentId && <Badge color="orange" text={`Parent: ${element.parentId}`} />}
                    </HorizontalGroup>
                    <HorizontalGroup>
                        <IconButton
                            name={isExpanded ? "angle-up" : "angle-down"}
                            onClick={() => toggleElementExpanded(element.id)}
                            tooltip="Toggle element"
                        />
                        <IconButton
                            name="trash-alt"
                            onClick={() => removeElement(element.id, isCustom)}
                            tooltip="Remove element"
                        />
                    </HorizontalGroup>
                </HorizontalGroup>

                <Collapse isOpen={isExpanded}>
                    <VerticalGroup spacing="md">
                        <HorizontalGroup>
                            <Field label="Component Type">
                                <RadioButtonGroup
                                    value={element.component}
                                    options={componentTypeOptions}
                                    onChange={(value) => updateElement(element.id, { component: value as 'group_component' | 'element_component' }, isCustom)}
                                />
                            </Field>
                        </HorizontalGroup>

                        <HorizontalGroup>
                            <Field label="Title/Name">
                                <Input
                                    value={element.title || ''}
                                    onChange={(e) => updateElement(element.id, { title: e.currentTarget.value }, isCustom)}
                                    placeholder="Element title"
                                />
                            </Field>
                            <Field label="Key">
                                <Input
                                    value={element.key}
                                    onChange={(e) => updateElement(element.id, { key: e.currentTarget.value }, isCustom)}
                                    placeholder="Unique key"
                                />
                            </Field>
                        </HorizontalGroup>

                        <HorizontalGroup>
                            <Field label="Type">
                                <Input
                                    value={element.type}
                                    onChange={(e) => updateElement(element.id, { type: e.currentTarget.value }, isCustom)}
                                    placeholder="Element type"
                                />
                            </Field>
                            <Field label="Icon">
                                <Input
                                    value={element.icon || ''}
                                    onChange={(e) => updateElement(element.id, { icon: e.currentTarget.value }, isCustom)}
                                    placeholder="Icon path or URL"
                                />
                            </Field>
                        </HorizontalGroup>

                        <HorizontalGroup>
                            <Field label="Parent Group">
                                <Select
                                    value={element.parentId || ''}
                                    options={parentOptions}
                                    onChange={(option) => updateElement(element.id, { parentId: option.value }, isCustom)}
                                />
                            </Field>
                            {!isCustom && (
                                <Field label="Query Reference">
                                    <Input
                                        value={element.queryRef || ''}
                                        onChange={(e) => updateElement(element.id, { queryRef: e.currentTarget.value }, isCustom)}
                                        placeholder="e.g., A, B, C"
                                    />
                                </Field>
                            )}
                        </HorizontalGroup>

                        <FieldSet label="Main Layout Items">
                            {element.layout.map(layoutItem =>
                                renderLayoutItem(element.id, layoutItem, isCustom, false)
                            )}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => addLayoutItem(element.id, isCustom, false)}
                            >
                                Add Layout Item
                            </Button>
                        </FieldSet>

                        <FieldSet label="Details View Layout Items">
                            {(element.detailsLayout || []).map(layoutItem =>
                                renderLayoutItem(element.id, layoutItem, isCustom, true)
                            )}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => addLayoutItem(element.id, isCustom, true)}
                            >
                                Add Details Layout Item
                            </Button>
                        </FieldSet>
                    </VerticalGroup>
                </Collapse>
            </div>
        );
    };

    return (
        <VerticalGroup spacing="lg">
            <FieldSet label="Query-Linked Elements">
                <p style={{ color: '#888', marginBottom: '16px' }}>
                    Elements linked to query results from the query editor. These will filter data based on query references.
                </p>
                {value.elements?.map(element => renderElement(element, false))}
                <Button onClick={() => addElement(false)}>Add Query-Linked Element</Button>
            </FieldSet>

            <FieldSet label="Custom Elements">
                <p style={{ color: '#888', marginBottom: '16px' }}>
                    Static elements with predefined data, not linked to queries.
                </p>
                {value.customElements?.map(element => renderElement(element, true))}
                <Button variant="secondary" onClick={() => addElement(true)}>Add Custom Element</Button>
            </FieldSet>

            <div style={{ background: '#333', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <strong>Configuration Tips:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Query-linked elements use query references (A, B, C) to fetch data</li>
                    <li>Layout items can reference specific queries for their data</li>
                    <li>Groups can contain other elements by setting their parentId</li>
                    <li>Selectors use JQ syntax for data extraction</li>
                    <li>Details layout items are shown when users click on elements</li>
                </ul>
            </div>
        </VerticalGroup>
    );
};
