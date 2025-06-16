import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input, Button, Select } from '@grafana/ui';

interface Element {
    name: string;
    type: 'group' | 'element';
}

interface Props extends StandardEditorProps<Element[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange }) => {
    const handleNameChange = (index: number, event: React.FormEvent<HTMLInputElement>) => {
        const updated = [...value];
        updated[index] = { ...updated[index], name: event.currentTarget.value };
        onChange(updated);
    };

    const handleTypeChange = (index: number, type: 'group' | 'element') => {
        const updated = [...value];
        updated[index] = { ...updated[index], type };
        onChange(updated);
    };

    const addElement = () => {
        onChange([...(value || []), { name: '', type: 'element' }]);
    };

    const removeElement = (index: number) => {
        const updated = value.filter((_, i) => i !== index);
        onChange(updated);
    };

    const typeOptions = [
        { label: 'Element', value: 'element' },
        { label: 'Group', value: 'group' },
    ];

    return (
        <div>
            {value.map((item, index) => (
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
