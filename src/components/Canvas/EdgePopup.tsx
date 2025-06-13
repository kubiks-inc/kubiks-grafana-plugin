import React from 'react'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2, Button, Badge, Icon } from '@grafana/ui'
import { useViewStore } from '@/store/ViewStoreProvider'

export const EdgePopup: React.FC = () => {
    const connectionPopup = useViewStore((state) => state.connectionPopup)
    const setConnectionPopup = useViewStore((state) => state.setConnectionPopup)
    const styles = useStyles2(getStyles)

    const getStatusColor = (errorRate: number) => {
        if (errorRate > 5) return '#f43f5e'
        if (errorRate > 1) return '#f59e0b'
        return '#10b981'
    }

    const getStatusBadgeColor = (errorRate: number) => {
        if (errorRate > 5) return 'red'
        if (errorRate > 1) return 'orange'
        return 'green'
    }

    const getStatusText = (errorRate: number) => {
        if (errorRate > 5) return 'Critical'
        if (errorRate > 1) return 'Warning'
        return 'Healthy'
    }

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET':
                return '#10b981'
            case 'POST':
                return '#6366f1'
            case 'PUT':
                return '#f59e0b'
            case 'DELETE':
                return '#f43f5e'
            default:
                return '#fff'
        }
    }

    const getMethodBackground = (method: string) => {
        switch (method) {
            case 'GET':
                return 'rgba(16, 185, 129, 0.25)'
            case 'POST':
                return 'rgba(99, 102, 241, 0.25)'
            case 'PUT':
                return 'rgba(245, 158, 11, 0.25)'
            case 'DELETE':
                return 'rgba(244, 63, 94, 0.25)'
            default:
                return 'rgba(255, 255, 255, 0.2)'
        }
    }

    if (!connectionPopup.open) {
        return null
    }

    return (
        <div className={styles.drawer}>
            <div className={styles.drawerContent}>
                {/* Header with service names and close button */}
                <div className={styles.drawerHeader}>
                    <div className={styles.serviceNamesContainer}>
                        <span className={styles.serviceName}>
                            {connectionPopup.sourceName || 'Unknown Source'}
                        </span>
                        <Icon name="arrow-right" className={styles.headerArrow} />
                        <span className={styles.serviceName}>
                            {connectionPopup.targetName || 'Unknown Target'}
                        </span>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => setConnectionPopup({ ...connectionPopup, open: false })}
                        icon="times"
                        size="sm"
                        aria-label="Close connection details"
                    />
                </div>

                {/* Scrollable content area */}
                <div className={styles.scrollableContent}>
                    {/* Connection Status */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Connection Status</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.statusContainer}>
                                <div className={styles.statusIndicator}>
                                    <div
                                        className={styles.statusDot}
                                        style={{ backgroundColor: getStatusColor(connectionPopup.errorRate) }}
                                    />
                                    <span className={styles.statusText}>
                                        {getStatusText(connectionPopup.errorRate)}
                                    </span>
                                </div>
                                <Badge
                                    text={`${connectionPopup.rps?.toFixed(3)} req/s`}
                                    color="blue"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Key Metrics</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.metricsGrid}>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Error Rate</span>
                                    <span
                                        className={styles.metricValue}
                                        style={{ color: getStatusColor(connectionPopup.errorRate) }}
                                    >
                                        {connectionPopup.errorRate?.toFixed(2)}%
                                    </span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Latency</span>
                                    <span className={styles.metricValue}>
                                        {connectionPopup.latency > 1000
                                            ? `${(connectionPopup.latency / 1000)?.toFixed(2)} s`
                                            : `${connectionPopup.latency?.toFixed(2)} ms`}
                                    </span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Status</span>
                                    <Badge
                                        text={getStatusText(connectionPopup.errorRate)}
                                        color={getStatusBadgeColor(connectionPopup.errorRate)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Endpoints Section */}
                    {connectionPopup.endpoints && Object.keys(connectionPopup.endpoints).length > 0 && (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>Endpoints</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.endpointsContainer}>
                                    {Object.entries(connectionPopup.endpoints).map(([type, endpoints]) => (
                                        <div key={type} className={styles.endpointGroup}>
                                            <div className={styles.endpointGroupHeader}>
                                                <Badge text={type.toUpperCase()} color="blue" />
                                            </div>

                                            <div className={styles.endpointsList}>
                                                {endpoints.map((endpoint, index) => (
                                                    <div key={index} className={styles.endpoint}>
                                                        <div className={styles.endpointHeader}>
                                                            <span
                                                                className={styles.methodBadge}
                                                                style={{
                                                                    backgroundColor: getMethodBackground(endpoint.endpoint?.split(' ')[0]),
                                                                    color: getMethodColor(endpoint.endpoint?.split(' ')[0]),
                                                                }}
                                                            >
                                                                {endpoint.endpoint?.split(' ')[0]}
                                                            </span>
                                                            <span className={styles.endpointPath}>
                                                                {endpoint.endpoint?.split(' ')[1]}
                                                            </span>
                                                        </div>

                                                        <div className={styles.endpointMetrics}>
                                                            <div className={styles.endpointMetric}>
                                                                <span className={styles.endpointMetricLabel}>Latency</span>
                                                                <span className={styles.endpointMetricValue}>
                                                                    {endpoint.avgLatencyMs > 1000
                                                                        ? `${(endpoint.avgLatencyMs / 1000).toFixed(2)} s`
                                                                        : `${endpoint.avgLatencyMs?.toFixed(2)} ms`}
                                                                </span>
                                                            </div>

                                                            <div className={styles.endpointMetric}>
                                                                <span className={styles.endpointMetricLabel}>Requests</span>
                                                                <span className={styles.endpointMetricValue}>
                                                                    {endpoint.rps?.toFixed(3)} req/s
                                                                </span>
                                                            </div>

                                                            <div className={styles.endpointMetric}>
                                                                <span className={styles.endpointMetricLabel}>Errors</span>
                                                                <span
                                                                    className={styles.endpointMetricValue}
                                                                    style={{
                                                                        color: endpoint.errorRate > 0
                                                                            ? getStatusColor(endpoint.errorRate)
                                                                            : undefined,
                                                                    }}
                                                                >
                                                                    {endpoint.errorRate ? endpoint.errorRate.toFixed(2) : '0'}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const getStyles = (theme: GrafanaTheme2) => ({
    drawer: css`
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1000;
        height: 100vh;
        background: ${theme.colors.background.primary};
        color: ${theme.colors.text.primary};
        border-left: 1px solid ${theme.colors.border.medium};
        box-shadow: ${theme.shadows.z3};
        transition: all 0.3s ease;
        width: 600px;
        max-width: 90vw;
    `,
    drawerContent: css`
        height: 100%;
        display: flex;
        flex-direction: column;
    `,

    drawerHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.medium};
        background: ${theme.colors.background.secondary};
        flex-shrink: 0;
        min-height: 60px;
        width: 100%;
        position: relative;
        z-index: 10;
    `,
    serviceNamesContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    serviceName: css`
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    headerArrow: css`
        color: ${theme.colors.text.secondary};
        flex-shrink: 0;
    `,
    scrollableContent: css`
        flex: 1;
        overflow: auto;
        padding: ${theme.spacing(2)};
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(2)};
    `,
    card: css`
        background: ${theme.colors.background.secondary};
        border: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default};
    `,
    cardHeader: css`
        padding: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.medium};
    `,
    cardTitle: css`
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
        margin: 0;
    `,
    cardContent: css`
        padding: ${theme.spacing(2)};
    `,
    statusContainer: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    statusIndicator: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    statusDot: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
    `,
    statusText: css`
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,

    metricsGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${theme.spacing(2)};
    `,
    metric: css`
        display: flex;
        flex-direction: column;
    `,
    metricLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        margin-bottom: ${theme.spacing(0.5)};
    `,
    metricValue: css`
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    endpointsContainer: css`
        max-height: 400px;
        overflow-y: auto;
    `,
    endpointGroup: css`
        margin-bottom: ${theme.spacing(2)};
        
        &:last-child {
            margin-bottom: 0;
        }
    `,
    endpointGroupHeader: css`
        margin-bottom: ${theme.spacing(1)};
    `,
    endpointsList: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1)};
    `,
    endpoint: css`
        background: ${theme.colors.background.canvas};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.radius.default};
        padding: ${theme.spacing(1.5)};
        transition: background-color 0.2s ease;
        
        &:hover {
            background: ${theme.colors.emphasize(theme.colors.background.canvas, 0.03)};
        }
    `,
    endpointHeader: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(1)};
    `,
    methodBadge: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        font-weight: ${theme.typography.fontWeightBold};
        padding: ${theme.spacing(0.5, 1)};
        border-radius: ${theme.shape.radius.default};
        text-align: center;
        min-width: 50px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `,
    endpointPath: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        font-family: ${theme.typography.fontFamilyMonospace};
        color: ${theme.colors.text.primary};
        word-break: break-all;
    `,
    endpointMetrics: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${theme.spacing(1)};
    `,
    endpointMetric: css`
        display: flex;
        flex-direction: column;
    `,
    endpointMetricLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        margin-bottom: 2px;
    `,
    endpointMetricValue: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        font-family: ${theme.typography.fontFamilyMonospace};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
});
