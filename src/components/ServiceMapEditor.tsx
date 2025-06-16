import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { ElementsList, Element } from './ElementsList';

interface Props extends StandardEditorProps<Element[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange }) => {
    return (
        <div>
            <ElementsList
                elements={value}
                onChange={onChange}
            />
        </div>
    );
};
