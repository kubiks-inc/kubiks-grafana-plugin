import React from 'react';
import { css } from '@emotion/css';
import { Button, Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps, VariableOption } from './types';
import { PanelVariableMapping } from '../../lib/model/view';
import { getQueryOptions, getQueryByRef, getFieldOptionsFromQuery } from '../../utils/queryUtils';

interface PanelVariableMappingProps extends Pick<BaseLayoutItemProps, 'queries' | 'data'> {
    mapping: PanelVariableMapping;
    mappingIndex: number;
    variableOptions: VariableOption[];
    loadingVariables: boolean;
    onUpdate: (mappingIndex: number, updates: Partial<PanelVariableMapping>) => void;
    onRemove: (mappingIndex: number) => void;
}

export const PanelVariableMappingComponent: React.FC<PanelVariableMappingProps> = ({
    mapping,
    mappingIndex,
    queries,
    data,
    variableOptions,
    loadingVariables,
    onUpdate,
    onRemove
}) => {
    const styles = useStyles2(getStyles);
    const queryOptions = getQueryOptions(queries);

    return (
        <div className={styles.mappingContainer}>
            <div className={styles.mappingInputs}>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Panel Variable</label>
                    <Select
                        value={mapping.panelVariable || ''}
                        options={variableOptions}
                        onChange={(option) => onUpdate(mappingIndex, {
                            panelVariable: option.value || ''
                        })}
                        width={20}
                        placeholder="Select panel variable"
                        isClearable
                        isLoading={loadingVariables}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Query</label>
                    <Select
                        value={mapping.queryRef || ''}
                        options={queryOptions}
                        onChange={(option) => onUpdate(mappingIndex, {
                            queryRef: option.value || '',
                            field: '' // Reset field when query changes
                        })}
                        width={20}
                        placeholder="Select query"
                        isClearable
                    />
                </div>

                {mapping.queryRef && (
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Field</label>
                        <Select
                            value={mapping.field || ''}
                            options={(() => {
                                const selectedQuery = getQueryByRef(mapping.queryRef, queries);
                                return selectedQuery ? getFieldOptionsFromQuery(selectedQuery, data) : [];
                            })()}
                            onChange={(option) => onUpdate(mappingIndex, {
                                field: option.value || ''
                            })}
                            width={20}
                            placeholder="Select field"
                            isClearable
                        />
                    </div>
                )}
            </div>

            <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(mappingIndex)}
                className={styles.removeButton}
            >
                Remove
            </Button>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    mappingContainer: css`
        display: flex;
        align-items: flex-start;
        gap: ${theme.spacing(1)};
        padding: ${theme.spacing(1)};
        background: ${theme.colors.background.secondary};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.radius.default};
        margin-bottom: ${theme.spacing(1)};
    `,
    mappingInputs: css`
        display: flex;
        align-items: flex-end;
        gap: ${theme.spacing(1)};
        flex: 1;
    `,
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
    removeButton: css`
        margin-top: ${theme.spacing(1)};
    `,
}); 