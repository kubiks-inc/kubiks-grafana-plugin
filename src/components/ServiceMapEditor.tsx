import React from 'react';
import { StandardEditorProps, DataQuery } from '@grafana/data';
import { ElementsList, Element } from './ElementsList';

interface Props extends StandardEditorProps<Element[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange, context }) => {
    // Extract queries from the context data - similar to backup component approach
    const getAvailableQueries = (): DataQuery[] => {
        const queries: DataQuery[] = [];

        // Extract unique refIds from data frames
        if (context?.data && Array.isArray(context.data)) {
            const uniqueRefIds = new Set<string>();
            context.data.forEach((dataFrame: any) => {
                if (dataFrame.refId) {
                    uniqueRefIds.add(dataFrame.refId);
                }
            });

            // Convert refIds to query objects
            Array.from(uniqueRefIds).forEach((refId) => {
                queries.push({
                    refId,
                    datasource: { type: 'unknown' }, // We don't have datasource info from dataframes
                } as DataQuery);
            });
        }

        return queries;
    };

    const queries = getAvailableQueries();

    return (
        <div>
            <ElementsList
                elements={value}
                queries={queries}
                onChange={onChange}
            />
        </div>
    );
};
