import React, { useCallback } from 'react';
import { css } from '@emotion/css';
import { StandardEditorProps, GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { ElementsList } from './ElementsList';
import { Element } from '../lib/model/view';

interface Props extends StandardEditorProps<Element[]> { }

export const ServiceMapEditor: React.FC<Props> = ({ value = [], onChange, context }) => {
    const styles = useStyles2(getStyles);

    const getAvailableQueries = useCallback((): string[] => {
        if (context?.data && Array.isArray(context.data)) {
            const uniqueRefIds = new Set<string>();
            context.data.forEach((dataFrame: any) => {
                if (dataFrame.refId) {
                    uniqueRefIds.add(dataFrame.refId);
                } else if (dataFrame?.meta?.preferredVisualisationType) {
                    uniqueRefIds.add(dataFrame?.meta?.preferredVisualisationType)
                }
            });

            return Array.from(uniqueRefIds)
        }

        return [];
    }, [context]);

    return (
        <div className={styles.container}>
            <ElementsList
                data={context?.data || []}
                elements={value}
                queries={getAvailableQueries()}
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
