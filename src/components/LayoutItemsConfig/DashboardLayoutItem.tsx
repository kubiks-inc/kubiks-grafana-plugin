import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { Input, Select, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { BaseLayoutItemProps, DashboardOption, PanelOption } from './types';
import { BaseLayoutItem } from './BaseLayoutItem';
import { getDashboardOptions, getPanelOptions } from '../../utils/dashboardUtils';

export const DashboardLayoutItem: React.FC<BaseLayoutItemProps> = (props) => {
    const { layoutItem, elementIndex, layoutIndex, onUpdateLayoutItem } = props;
    const styles = useStyles2(getStyles);
    const [dashboardOptions, setDashboardOptions] = useState<DashboardOption[]>([]);
    const [panelOptionsMap, setPanelOptionsMap] = useState<Record<string, PanelOption[]>>({});
    const [loadingDashboards, setLoadingDashboards] = useState(false);
    const [loadingPanels, setLoadingPanels] = useState<Record<string, boolean>>({});

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
        <BaseLayoutItem {...props}>
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
}); 
