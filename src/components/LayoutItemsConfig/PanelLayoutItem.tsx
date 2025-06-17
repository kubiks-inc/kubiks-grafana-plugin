import React, { useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { Button, Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps, DashboardOption, PanelOption, VariableOption } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';
import { getDashboardOptions, getPanelOptions, getDashboardVariableOptions } from '../../utils/dashboardUtils';
import { PanelVariableMapping } from '../../lib/model/view';
import { PanelVariableMappingComponent } from './PanelVariableMapping';

export const PanelLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, queries, data, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);
    const [dashboardOptions, setDashboardOptions] = useState<DashboardOption[]>([]);
    const [panelOptionsMap, setPanelOptionsMap] = useState<Record<string, PanelOption[]>>({});
    const [variableOptionsMap, setVariableOptionsMap] = useState<Record<string, VariableOption[]>>({});
    const [loadingDashboards, setLoadingDashboards] = useState(false);
    const [loadingPanels, setLoadingPanels] = useState<Record<string, boolean>>({});
    const [loadingVariables, setLoadingVariables] = useState<Record<string, boolean>>({});

    // Set default sourceType to dashboard if not already set
    useEffect(() => {
        if (!layoutItem.sourceType || layoutItem.sourceType !== 'dashboard') {
            onUpdateLayoutItem(elementIndex, layoutIndex, {
                sourceType: 'dashboard',
                source: { dashboardUid: '', panelId: '' }
            });
        }
    }, [layoutItem.sourceType, elementIndex, layoutIndex, onUpdateLayoutItem]);

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
    const loadPanelOptions = useCallback(async (dashboardUid: string) => {
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
    }, [panelOptionsMap]);

    // Function to load variable options for a specific dashboard
    const loadVariableOptions = useCallback(async (dashboardUid: string) => {
        if (!dashboardUid || variableOptionsMap[dashboardUid]) {
            return; // Already loaded or no dashboard selected
        }

        setLoadingVariables(prev => ({ ...prev, [dashboardUid]: true }));
        try {
            const variables = await getDashboardVariableOptions(dashboardUid);
            setVariableOptionsMap(prev => ({ ...prev, [dashboardUid]: variables }));
        } catch (error) {
            console.error('Failed to load variables:', error);
            setVariableOptionsMap(prev => ({ ...prev, [dashboardUid]: [{ label: 'Failed to load variables', value: '' }] }));
        } finally {
            setLoadingVariables(prev => ({ ...prev, [dashboardUid]: false }));
        }
    }, [variableOptionsMap]);

    // Load panel and variable options for already selected dashboard on component mount
    useEffect(() => {
        if (typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source && layoutItem.source.dashboardUid) {
            const dashboardUid = layoutItem.source.dashboardUid;
            loadPanelOptions(dashboardUid);
            loadVariableOptions(dashboardUid);
        }
    }, [layoutItem.source, loadPanelOptions, loadVariableOptions]);

    const handleAddVariableMapping = () => {
        const currentMappings = layoutItem.panelVariableMappings || [];
        const newMapping: PanelVariableMapping = {
            panelVariable: '',
            queryRef: '',
            field: ''
        };

        onUpdateLayoutItem(elementIndex, layoutIndex, {
            panelVariableMappings: [...currentMappings, newMapping]
        });
    };

    const handleUpdateVariableMapping = (mappingIndex: number, updates: Partial<PanelVariableMapping>) => {
        const currentMappings = layoutItem.panelVariableMappings || [];
        const updatedMappings = [...currentMappings];
        updatedMappings[mappingIndex] = { ...updatedMappings[mappingIndex], ...updates };

        onUpdateLayoutItem(elementIndex, layoutIndex, {
            panelVariableMappings: updatedMappings
        });
    };

    const handleRemoveVariableMapping = (mappingIndex: number) => {
        const currentMappings = layoutItem.panelVariableMappings || [];
        const updatedMappings = currentMappings.filter((_, index) => index !== mappingIndex);

        onUpdateLayoutItem(elementIndex, layoutIndex, {
            panelVariableMappings: updatedMappings
        });
    };

    return (
        <BaseLayoutItem {...props}>
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
                                loadVariableOptions(dashboardUid);
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

            {/* Panel Variable Mappings Section */}
            <div className={styles.variableMappingsSection}>
                <div className={styles.sectionHeader}>
                    <h5 className={styles.sectionTitle}>Panel Variable Mappings</h5>
                    <p className={styles.sectionDescription}>
                        Configure mappings from query fields to panel variables
                    </p>
                </div>

                {(layoutItem.panelVariableMappings || []).map((mapping, mappingIndex) => (
                    <PanelVariableMappingComponent
                        key={mappingIndex}
                        mapping={mapping}
                        mappingIndex={mappingIndex}
                        queries={queries}
                        data={data}
                        variableOptions={typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source && layoutItem.source.dashboardUid ?
                            (variableOptionsMap[layoutItem.source.dashboardUid] || []) :
                            [{ label: 'Select dashboard first', value: '' }]}
                        loadingVariables={typeof layoutItem.source === 'object' && 'dashboardUid' in layoutItem.source && layoutItem.source.dashboardUid ?
                            loadingVariables[layoutItem.source.dashboardUid] : false}
                        onUpdate={handleUpdateVariableMapping}
                        onRemove={handleRemoveVariableMapping}
                    />
                ))}

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddVariableMapping}
                    className={styles.addMappingButton}
                >
                    Add Variable Mapping
                </Button>
            </div>
        </BaseLayoutItem>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    panelSelectorContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
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
    variableMappingsSection: css`
        margin-top: ${theme.spacing(2)};
        padding-top: ${theme.spacing(2)};
        border-top: 1px solid ${theme.colors.border.weak};
    `,
    sectionHeader: css`
        margin-bottom: ${theme.spacing(1.5)};
    `,
    sectionTitle: css`
        margin: 0;
        margin-bottom: ${theme.spacing(0.5)};
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    sectionDescription: css`
        margin: 0;
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        line-height: 1.4;
    `,
    addMappingButton: css`
        margin-top: ${theme.spacing(1)};
    `,
}); 
