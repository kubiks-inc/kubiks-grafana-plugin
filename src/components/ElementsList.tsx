import React from 'react';
import { Input, Button, Select } from '@grafana/ui';

export interface Element {
    name: string;
    type: 'group' | 'element';
}

interface ElementsListProps {
    elements: Element[];
    onChange: (elements: Element[]) => void;
}

export const ElementsList: React.FC<ElementsListProps> = ({ elements, onChange }) => {
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

    const addElement = () => {
        onChange([...elements, { name: '', type: 'element' }]);
    };

    const removeElement = (index: number) => {
        const updated = elements.filter((_, i) => i !== index);
        onChange(updated);
    };

    const typeOptions = [
        { label: 'Element', value: 'element' },
        { label: 'Group', value: 'group' },
    ];

    return (
        <div>
            {elements.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <Input
                        value={item.name}
                        onChange={(e) => handleNameChange(index, e)}
                        placeholder={`${item.type === 'group' ? 'Group' : 'Element'} ${index + 1}`}
                        width={30}
                    />
                    <Select
                        value={item.type}
                        options={typeOptions}
                        onChange={(option) => handleTypeChange(index, option.value as 'group' | 'element')}
                        width={15}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removeElement(index)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button onClick={addElement}>Add Element</Button>
        </div>
    );
}; 