import React from 'react';
import { css } from '@emotion/css';
import { StandardEditorProps, DataQuery, GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { ElementsList, Element } from './ElementsList';

interface Props extends StandardEditorProps<Element[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange, context }) => {
    const styles = useStyles2(getStyles);

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
        <div className={styles.container}>
            <ElementsList
                elements={value}
                queries={queries}
                onChange={onChange}
            />
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        background: ${theme.colors.background.primary};
        color: ${theme.colors.text.primary};
    `,
});
