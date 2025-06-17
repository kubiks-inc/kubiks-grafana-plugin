import { getBackendSrv } from '@grafana/runtime';

export interface DashboardInfo {
    uid: string;
    title: string;
    uri: string;
    url: string;
    slug: string;
    type: string;
    tags: string[];
    isStarred: boolean;
    folderId?: number;
    folderUid?: string;
    folderTitle?: string;
    folderUrl?: string;
}

export interface PanelInfo {
    id: number;
    title: string;
    type: string;
    datasource?: {
        type: string;
        uid: string;
    };
}

export interface DashboardVariable {
    name: string;
    type: string;
    label: string;
    description?: string;
}

export interface DashboardDetails {
    dashboard: {
        uid: string;
        title: string;
        panels: PanelInfo[];
        templating?: {
            list: any[];
        };
    };
}

export interface DashboardOption {
    label: string;
    value: string;
    description?: string;
}

export interface PanelOption {
    label: string;
    value: string;
    description?: string;
    dashboardTitle?: string;
}

export interface VariableOption {
    label: string;
    value: string;
    description?: string;
}

/**
 * Fetches all dashboards from Grafana
 */
export const fetchDashboards = async (): Promise<DashboardInfo[]> => {
    try {
        const response = await getBackendSrv().fetch({
            url: '/api/search?type=dash-db',
            method: 'GET',
        });

        const result = await response.toPromise();
        return (result?.data as DashboardInfo[]) || [];
    } catch (error) {
        console.error('Error fetching dashboards:', error);
        return [];
    }
};

/**
 * Fetches dashboard details including panels
 */
export const fetchDashboardDetails = async (dashboardUid: string): Promise<DashboardDetails | null> => {
    try {
        const response = await getBackendSrv().fetch({
            url: `/api/dashboards/uid/${dashboardUid}`,
            method: 'GET',
        });

        const result = await response.toPromise();
        return (result?.data as DashboardDetails) || null;
    } catch (error) {
        console.error('Error fetching dashboard details:', error);
        return null;
    }
};

/**
 * Gets dashboard options for dropdown selection
 */
export const getDashboardOptions = async (): Promise<DashboardOption[]> => {
    const dashboards = await fetchDashboards();

    if (dashboards.length === 0) {
        return [{ label: 'No dashboards available', value: '', description: 'Create dashboards first' }];
    }

    return dashboards.map((dashboard) => ({
        label: dashboard.title,
        value: dashboard.uid,
        description: dashboard.folderTitle ? `Folder: ${dashboard.folderTitle}` : 'General',
    }));
};

/**
 * Gets panel options for a specific dashboard
 */
export const getPanelOptions = async (dashboardUid: string): Promise<PanelOption[]> => {
    if (!dashboardUid) {
        return [{ label: 'Select a dashboard first', value: '' }];
    }

    const dashboardDetails = await fetchDashboardDetails(dashboardUid);

    if (!dashboardDetails || !dashboardDetails.dashboard.panels) {
        return [{ label: 'No panels available', value: '', description: 'This dashboard has no panels' }];
    }

    return dashboardDetails.dashboard.panels
        .filter(panel => panel.title) // Only include panels with titles
        .map((panel) => ({
            label: panel.title,
            value: panel.id.toString(),
            description: `Type: ${panel.type}`,
            dashboardTitle: dashboardDetails.dashboard.title,
        }));
};

/**
 * Gets combined dashboard and panel information for display
 */
export const getDashboardPanelInfo = async (
    dashboardUid: string,
    panelId: string
): Promise<{ dashboardTitle: string; panelTitle: string; panelType: string } | null> => {
    if (!dashboardUid || !panelId) {
        return null;
    }

    try {
        const dashboardDetails = await fetchDashboardDetails(dashboardUid);
        if (!dashboardDetails) {
            return null;
        }

        const panel = dashboardDetails.dashboard.panels.find(p => p.id.toString() === panelId);
        if (!panel) {
            return null;
        }

        return {
            dashboardTitle: dashboardDetails.dashboard.title,
            panelTitle: panel.title,
            panelType: panel.type,
        };
    } catch (error) {
        console.error('Error fetching dashboard panel info:', error);
        return null;
    }
};

/**
 * Gets variable options for a specific dashboard
 */
export const getDashboardVariableOptions = async (dashboardUid: string): Promise<VariableOption[]> => {
    if (!dashboardUid) {
        return [{ label: 'Select a dashboard first', value: '' }];
    }

    const dashboardDetails = await fetchDashboardDetails(dashboardUid);

    if (!dashboardDetails || !dashboardDetails.dashboard.templating?.list) {
        return [{ label: 'No variables available', value: '', description: 'This dashboard has no variables' }];
    }

    const variables = dashboardDetails.dashboard.templating.list.filter(
        (variable: any) => variable.name && variable.type !== 'adhoc'
    );

    if (variables.length === 0) {
        return [{ label: 'No variables available', value: '', description: 'This dashboard has no variables' }];
    }

    return variables.map((variable: any) => ({
        label: variable.label || variable.name,
        value: variable.name,
        description: `Type: ${variable.type}`,
    }));
}; 
