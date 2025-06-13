import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';

interface Props extends StandardEditorProps<string[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newList = [...value];
        newList[index] = event.target.value;
        onChange(newList);
    };

    const addService = () => {
        onChange([...(value || []), '']);
    };

    return (
        <div>
            {value.map((item, index) => (
                <div key={index}>
                    <Input
                        value={item}
                        onChange={(e) => handleChange(e, index)}
                        placeholder={`Service ${index + 1}`}
                    />
                </div>
            ))}
            <button onClick={addService}>Add Service</button>
        </div>
    );
};
