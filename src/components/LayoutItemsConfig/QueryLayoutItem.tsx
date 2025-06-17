import React from 'react';
import { css } from '@emotion/css';
import { Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps } from './types';
import { getQueryOptions, getQueryByRef, getFieldOptionsFromQuery } from '../../utils/queryUtils';

export const QueryLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, queries, data, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);
    const queryOptions = getQueryOptions(queries);

    return (
        <>
            <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Data Source Query</label>
                <Select
                    value={typeof layoutItem.source === 'object' && 'queryRef' in layoutItem.source ? layoutItem.source.queryRef : ''}
                    options={queryOptions}
                    onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                        source: option.value ? { queryRef: option.value } : undefined,
                        field: undefined // Reset field when query changes
                    })}
                    width={25}
                    placeholder="Data source query"
                    isClearable
                />
            </div>
            {/* Field selector - only show when a query is selected */}
            {typeof layoutItem.source === 'object' && 'queryRef' in layoutItem.source && layoutItem.source.queryRef && (
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Field</label>
                    <Select
                        value={layoutItem.field || ''}
                        options={(() => {
                            const selectedQuery = getQueryByRef(layoutItem.source.queryRef, queries);
                            return selectedQuery ? getFieldOptionsFromQuery(selectedQuery, data) : [];
                        })()}
                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                            field: option.value || undefined
                        })}
                        width={30}
                        placeholder="Select field from query"
                        isClearable
                        className={styles.fieldSelector}
                    />
                </div>
            )}
        </>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(0.5)};
    `,
    inputLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.secondary};
    `,
    fieldSelector: css`
        & .css-1dcbz2m-control,
        & .css-1pahdxg-control,
        & [class*="control"] {
            min-height: 32px !important;
            height: 32px !important;
        }
        & .css-1wa3eu0-placeholder,
        & .css-1dimb5e-singleValue,
        & [class*="placeholder"],
        & [class*="singleValue"] {
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 100% !important;
        }
        & .css-14el2xx-container,
        & [class*="container"] {
            height: 32px !important;
        }
    `,
}); 
