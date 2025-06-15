import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { Input, Button, Select, useStyles2 } from '@grafana/ui';
import { DataQuery, GrafanaTheme2 } from '@grafana/data';
import { getQueryOptions } from '../utils/queryUtils';
import { getIconOptions, getIconUrlWithFallback } from '../utils/iconMapper';
import { getDashboardOptions, getPanelOptions, DashboardOption, PanelOption } from '../utils/dashboardUtils';
import { Element, LayoutItem } from '../lib/model/view';

interface LayoutItemsConfigProps {
    element: Element;
    elementIndex: number;
    elements: Element[];
    queries: DataQuery[];
    onUpdateLayoutItem: (elementIndex: number, layoutIndex: number, updates: Partial<LayoutItem>) => void;
    onAddLayoutItem: (elementIndex: number) => void;
    onRemoveLayoutItem: (elementIndex: number, layoutIndex: number) => void;
}

export const LayoutItemsConfig: React.FC<LayoutItemsConfigProps> = ({
    element,
    elementIndex,
    elements,
    queries,
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
        { label: 'Value', value: 'manual' },
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
                        <Select
                            value={layoutItem.type}
                            options={layoutTypeOptions}
                            onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                type: option.value as LayoutItem['type']
                            })}
                            width={15}
                            placeholder="Field Type"
                        />
                        <Input
                            value={layoutItem.label || ''}
                            onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                label: e.currentTarget.value
                            })}
                            placeholder="Display label"
                            width={20}
                        />
                        {layoutItem.type === 'icon' ? (
                            <div className={styles.iconSelectorContainer}>
                                <Select
                                    value={layoutItem.value?.data?.toString() || ''}
                                    options={iconOptions.map(icon => ({
                                        label: icon.label,
                                        value: icon.value
                                    }))}
                                    onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                        source: '',
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
                        ) : layoutItem.type === 'parentId' ? (
                            <div className={styles.parentIdSelectorContainer}>
                                <Select
                                    value={layoutItem.value?.data?.toString() || ''}
                                    options={groupElements}
                                    onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                        source: '',
                                        sourceMode: 'manual',
                                        value: { data: option.value || '' }
                                    })}
                                    width={25}
                                    placeholder="Select parent group"
                                    isClearable
                                />
                            </div>
                        ) : (
                            <>
                                <Select
                                    value={layoutItem.sourceMode || 'query'}
                                    options={sourceModeOptions}
                                    onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                        sourceMode: option.value as 'query' | 'manual' | 'dashboard',
                                        ...(option.value === 'query' ? { value: undefined, source: '' } :
                                            option.value === 'manual' ? { source: '' } :
                                                option.value === 'dashboard' ? { source: { panelId: '', dashboardUid: '' }, value: undefined } : {})
                                    })}
                                    width={12}
                                    placeholder="Source Mode"
                                />
                                {layoutItem.sourceMode === 'manual' ? (
                                    <Input
                                        value={layoutItem.value?.data?.toString() || ''}
                                        onChange={(e) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                            value: { data: e.currentTarget.value }
                                        })}
                                        placeholder="Enter value"
                                        width={20}
                                    />
                                ) : layoutItem.sourceMode === 'dashboard' ? (
                                    <div className={styles.panelSelectorContainer}>
                                        <Select
                                            value={typeof layoutItem.source === 'object' ? layoutItem.source.dashboardUid : ''}
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
                                        <Select
                                            value={typeof layoutItem.source === 'object' ? layoutItem.source.panelId : ''}
                                            options={typeof layoutItem.source === 'object' && layoutItem.source.dashboardUid ?
                                                (panelOptionsMap[layoutItem.source.dashboardUid] || []) :
                                                [{ label: 'Select dashboard first', value: '' }]}
                                            onChange={(option) => {
                                                const currentSource = typeof layoutItem.source === 'object' ? layoutItem.source : { dashboardUid: '', panelId: '' };
                                                onUpdateLayoutItem(elementIndex, layoutIndex, {
                                                    source: { ...currentSource, panelId: option.value || '' }
                                                });
                                            }}
                                            width={25}
                                            placeholder="Select panel"
                                            isClearable
                                            isLoading={typeof layoutItem.source === 'object' && layoutItem.source.dashboardUid ?
                                                loadingPanels[layoutItem.source.dashboardUid] : false}
                                            disabled={!layoutItem.source || typeof layoutItem.source !== 'object' || !layoutItem.source.dashboardUid}
                                        />
                                    </div>
                                ) : (
                                    <Select
                                        value={typeof layoutItem.source === 'string' ? layoutItem.source : ''}
                                        options={queryOptions}
                                        onChange={(option) => onUpdateLayoutItem(elementIndex, layoutIndex, {
                                            source: option.value || ''
                                        })}
                                        width={20}
                                        placeholder="Data source query"
                                        isClearable
                                    />
                                )}
                            </>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onRemoveLayoutItem(elementIndex, layoutIndex)}
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
        align-items: center;
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
}); 