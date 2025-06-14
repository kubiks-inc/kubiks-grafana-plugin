import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input, Button } from '@grafana/ui';

interface Props extends StandardEditorProps<string[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange }) => {
    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...value];          // 👈 clone array
        updated[index] = event.target.value;
        onChange(updated);                   // ✅ call with new reference
    };

    const addService = () => {
        onChange([...(value || []), '']);    // ✅ always return a new array
    };

    return (
        <div>
            {value.map((item, index) => (
                <Input
                    key={index}
                    value={item}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder={`Service ${index + 1}`}
                />
            ))}
            <Button onClick={addService}>Add Service</Button>
        </div>
    );
};
