import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { Input, Button, Select, useStyles2 } from '@grafana/ui';
import { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { getQueryOptions, getQueryByRef, getFieldOptionsFromQuery } from '../utils/queryUtils';
import { getIconOptions, getIconUrlWithFallback } from '../utils/iconMapper';
import { getDashboardOptions, getPanelOptions, DashboardOption, PanelOption } from '../utils/dashboardUtils';
import { Element, LayoutItem } from '../lib/model/view';

interface LayoutItemsConfigProps {
    element: Element;
    elementIndex: number;
    elements: Element[];
    queries: string[];
    data: DataFrame[];
    onUpdateLayoutItem: (elementIndex: number, layoutIndex: number, updates: Partial<LayoutItem>) => void;
    onAddLayoutItem: (elementIndex: number) => void;
    onRemoveLayoutItem: (elementIndex: number, layoutIndex: number) => void;
}

export const LayoutItemsConfig: React.FC<LayoutItemsConfigProps> = ({
    element,
    elementIndex,
    elements,
    queries,
    data,
    onUpdateLayoutItem,
    onAddLayoutItem,
    onRemoveLayoutItem
}) => {
    const styles = useStyles2(getStyles);
    const [dashboardOptions, setDashboardOptions] = useState<DashboardOption[]>([]);
    const [panelOptionsMap, setPanelOptionsMap] = useState<Record<string, PanelOption[]>>({});
    const [loadingDashboards, setLoadingDashboards] = useState(false);
    const [loadingPanels, setLoadingPanels] = useState<Record<string, boolean>>({});

    const layoutTypeOptions = [
        { label: 'Title', value: 'title' },
        { label: 'Parent ID', value: 'parentId' },
        { label: 'Text', value: 'text' },
        { label: 'Tags', value: 'tags' },
        { label: 'Key-Value', value: 'keyValue' },
        { label: 'Progress', value: 'progress' },
        { label: 'Inversed Progress', value: 'inversed_progress' },
        { label: 'Blocks', value: 'blocks' },
        { label: 'Links', value: 'links' },
        { label: 'Icon', value: 'icon' },
        { label: 'Status', value: 'status' },
        { label: 'Panel', value: 'panel' },
    ];

    const sourceModeOptions = [
        { label: 'Query', value: 'query' },
        { label: 'Value', value: 'value' },
        { label: 'Dashboard', value: 'dashboard' },
    ];

    const queryOptions = getQueryOptions(queries);
    const iconOptions = getIconOptions();

    // Get group elements for parentId dropdown
    const groupElements = elements.filter(el => el.type === 'group').map(el => ({
        label: el.name,
        value: el.name
    }));

    // Load dashboard options on component mount
    useEffect(() => {
        const loadDashboards = async () => {
            setLoadingDashboards(true);
            try {
                const options = await getDashboardOptions();
                setDashboardOptions(options);
            } catch (error) {
                console.error('Failed to load dashboards:', error);
                setDashboardOptions([{ label: 'Failed to load dashboards', value: '' }]);
            } finally {
                setLoadingDashboards(false);
            }
        };

        loadDashboards();
    }, []);

    // Function to load panel options for a specific dashboard
    const loadPanelOptions = async (dashboardUid: string) => {
        if (!dashboardUid || panelOptionsMap[dashboardUid]) {
            return; // Already loaded or no dashboard selected
        }

        setLoadingPanels(prev => ({ ...prev, [dashboardUid]: true }));
        try {
            const panels = await getPanelOptions(dashboardUid);
            setPanelOptionsMap(prev => ({ ...prev, [dashboardUid]: panels }));
        } catch (error) {
            console.error('Failed to load panels:', error);
            setPanelOptionsMap(prev => ({ ...prev, [dashboardUid]: [{ label: 'Failed to load panels', value: '' }] }));
        } finally {
            setLoadingPanels(prev => ({ ...prev, [dashboardUid]: false }));
        }
    };

    return (
        <div className={styles.layoutSection}>
            <h4 className={styles.sectionTitle}>Layout Fields</h4>
            <p className={styles.sectionDescription}>
                Configure what fields are displayed in this element's service map node
            </p>
            {(element.layout || []).map((layoutItem, layoutIndex) => (
                <div key={layoutIndex} className={styles.layoutItem}>
                    <div className={styles.layoutItemHeader}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Field Type</label>
                            <Select
                                value={layoutItem.type}
                                options={layoutTypeOptions}
                                onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                    type: option.value as LayoutItem['type']
                                })}
                                width={15}
                                placeholder="Field Type"
                            />
                        </div>
                        {!['title', 'status', 'parentId', 'icon', 'links'].includes(layoutItem.type) && (
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Label</label>
                                <Input
                                    value={layoutItem.label || ''}
                                    onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                        label: e.currentTarget.value
                                    })}
                                    placeholder="Display label"
                                    width={20}
                                />
                            </div>
                        )}
                        {layoutItem.type === 'icon' ? (
                            <div className={styles.iconSelectorContainer}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Icon</label>
                                    <Select
                                        value={layoutItem.value?.data?.toString() || ''}
                                        options={iconOptions.map(icon => ({
                                            label: icon.label,
                                            value: icon.value
                                        }))}
                                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                            source: undefined,
                                            value: { data: option.value || '' }
                                        })}
                                        width={25}
                                        placeholder="Select icon"
                                        isClearable
                                        formatOptionLabel={(option) => {
                                            const iconOption = iconOptions.find(icon => icon.value === option.value);
                                            return (
                                                <div className={styles.iconOption}>
                                                    <img
                                                        src={iconOption?.iconUrl || getIconUrlWithFallback(option.value || '')}
                                                        alt={option.label}
                                                        className={styles.iconPreview}
                                                    />
                                                    <span>{option.label}</span>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        ) : layoutItem.type === 'parentId' ? (
                            <div className={styles.parentIdSelectorContainer}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Parent Group</label>
                                    <Select
                                        value={layoutItem.value?.data?.toString() || ''}
                                        options={groupElements}
                                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                            source: undefined,
                                            sourceType: 'value',
                                            value: { data: option.value || '' }
                                        })}
                                        width={25}
                                        placeholder="Select parent group"
                                        isClearable
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Source Mode</label>
                                    <Select
                                        value={layoutItem.sourceType || 'query'}
                                        options={sourceModeOptions}
                                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                            sourceType: option.value as 'query' | 'value' | 'dashboard',
                                            ...(option.value === 'query' ? { value: undefined, source: undefined } :
                                                option.value === 'value' ? { source: undefined } :
                                                    option.value === 'dashboard' ? { source: { panelId: '', dashboardUid: '' }, value: undefined } : {})
                                        })}
                                        width={12}
                                        placeholder="Source Mode"
                                    />
                                </div>
                                {layoutItem.sourceType === 'value' ? (
                                    <div className={styles.inputGroup}>
                                        <label className={styles.inputLabel}>Value</label>
                                        <Input
                                            value={layoutItem.value?.data?.toString() || ''}
                                            onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                                value: { data: e.currentTarget.value }
                                            })}
                                            placeholder="Enter value"
                                            width={20}
                                        />
                                    </div>
                                ) : layoutItem.sourceType === 'dashboard' ? (
                                    <div className={styles.panelSelectorContainer}>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.inputLabel}>Dashboard</label>
                                            <Select
                                                value={typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source ? layoutItem.source.dashboardUid : ''}
                                                options={dashboardOptions}
                                                onChange={(option) => {
                                                    const dashboardUid = option.value || '';
                                                    onUpdateLayoutItem(elementIndex, layoutIndex, {
                                                        source: { dashboardUid, panelId: '' } // Reset panel selection when dashboard changes
                                                    });
                                                    if (dashboardUid) {
                                                        loadPanelOptions(dashboardUid);
                                                    }
                                                }}
                                                width={25}
                                                placeholder="Select dashboard"
                                                isClearable
                                                isLoading={loadingDashboards}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.inputLabel}>Panel</label>
                                            <Select
                                                value={typeof layoutItem.source === 'object' && 'panelId' in layoutItem.source ? layoutItem.source.panelId : ''}
                                                options={typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source && layoutItem.source.dashboardUid ?
                                                    (panelOptionsMap[layoutItem.source.dashboardUid] || []) :
                                                    [{ label: 'Select dashboard first', value: '' }]}
                                                onChange={(option) => {
                                                    const currentSource = typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source
                                                        ? layoutItem.source
                                                        : { dashboardUid: '', panelId: '' };
                                                    onUpdateLayoutItem(elementIndex, layoutIndex, {
                                                        source: { ...currentSource, panelId: option.value || '' }
                                                    });
                                                }}
                                                width={25}
                                                placeholder="Select panel"
                                                isClearable
                                                isLoading={typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source && layoutItem.source.dashboardUid ?
                                                    loadingPanels[layoutItem.source.dashboardUid] : false}
                                                disabled={!layoutItem.source || typeof layoutItem.source !== 'object' || !('dashboardUid' in layoutItem.source) || !layoutItem.source.dashboardUid}
                                            />
                                        </div>
                                    </div>
                                ) : (
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
                                )}
                            </>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onRemoveLayoutItem(elementIndex, layoutIndex)}
                            className={styles.removeButton}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onAddLayoutItem(elementIndex)}
            >
                Add Layout Field
            </Button>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    layoutSection: css`
        margin-top: ${theme.spacing(1.5)};
    `,
    sectionTitle: css`
        margin: 0;
        margin-bottom: ${theme.spacing(1)};
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    sectionDescription: css`
        margin: 0;
        margin-bottom: ${theme.spacing(1)};
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        line-height: 1.4;
    `,
    layoutItem: css`
        background: ${theme.colors.background.canvas};
        padding: ${theme.spacing(1.5)};
        margin-bottom: ${theme.spacing(1)};
        border-radius: ${theme.shape.radius.default};
        border: 1px solid ${theme.colors.border.weak};
    `,
    layoutItemHeader: css`
        display: flex;
        gap: ${theme.spacing(1)};
        align-items: flex-end;
        flex-wrap: wrap;
    `,
    iconSelectorContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    parentIdSelectorContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    panelSelectorContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    iconOption: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    iconPreview: css`
        width: 16px;
        height: 16px;
        object-fit: contain;
        flex-shrink: 0;
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
        height: 32px;
        align-self: flex-end;
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