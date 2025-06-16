import {
    Search,
    AlertTriangle,
    ExternalLink,
    Server,
    Code,
    X,
    RefreshCw,
    Filter,
    Cpu,
    CheckCircle,
    ArrowUpRight,
    Wifi,
    MemoryStickIcon as Memory,
    Disc,
    TrendingDown,
} from 'lucide-react'
import React from 'react'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { Button, useStyles2, Alert, Field, Input, Tooltip } from '@grafana/ui'
import { useViewStore } from '@/store/ViewStoreProvider'
import { DashboardElementSource, Record } from '@/lib/model/view'
import { getBackendSrv } from '@grafana/runtime'

interface ServiceDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: Record
}

const Tag = ({
    children,
    variant = 'default',
}: {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error'
}) => {
    const styles = useStyles2(getStyles)

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return styles.tagSuccess
            case 'warning':
                return styles.tagWarning
            case 'error':
                return styles.tagError
            default:
                return styles.tagDefault
        }
    }

    return (
        <span className={`${styles.tag} ${getVariantStyles()}`}>
            {children}
        </span>
    )
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const styles = useStyles2(getStyles)
    return <div className={`${styles.card} ${className}`}>{children}</div>
}

const CardHeader = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles2(getStyles)
    return <div className={styles.cardHeader}>{children}</div>
}

const CardTitle = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles2(getStyles)
    return <h3 className={styles.cardTitle}>{children}</h3>
}

const CardContent = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles2(getStyles)
    return <div className={styles.cardContent}>{children}</div>
}

const Table = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles2(getStyles)
    return <table className={styles.table}>{children}</table>
}

const TableHeader = ({ children }: { children: React.ReactNode }) => {
    return <thead>{children}</thead>
}

const TableBody = ({ children }: { children: React.ReactNode }) => {
    return <tbody>{children}</tbody>
}

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const styles = useStyles2(getStyles)
    return <tr className={`${styles.tableRow} ${className}`}>{children}</tr>
}

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const styles = useStyles2(getStyles)
    return <th className={`${styles.tableHead} ${className}`}>{children}</th>
}

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const styles = useStyles2(getStyles)
    return <td className={`${styles.tableCell} ${className}`}>{children}</td>
}

const Avatar = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const styles = useStyles2(getStyles)
    return <div className={`${styles.avatar} ${className}`}>{children}</div>
}

const AvatarFallback = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const styles = useStyles2(getStyles)
    return <span className={`${styles.avatarFallback} ${className}`}>{children}</span>
}

const PanelPreview = ({ config }: { config: DashboardElementSource }) => {
    const styles = useStyles2(getStyles)
    const [imageUrl, setImageUrl] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchPanelImage = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get the current time range (you might want to make this configurable)
                const from = Date.now() - 6 * 60 * 60 * 1000 // 6 hours ago
                const to = Date.now()

                // Construct the render URL for the panel
                const renderUrl = `/render/d-solo/${config.dashboardUid}?panelId=${config.panelId}&from=${from}&to=${to}&width=400&height=300`

                // Use Grafana's backend service to fetch the rendered image
                const response = await getBackendSrv().fetch({
                    url: renderUrl,
                    method: 'GET',
                    responseType: 'blob'
                })

                const result = await response.toPromise()
                if (result && result.data && result.data instanceof Blob) {
                    const imageObjectUrl = URL.createObjectURL(result.data)
                    setImageUrl(imageObjectUrl)
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (err) {
                console.error('Error fetching panel image:', err)
                setError('Failed to load panel preview')
            } finally {
                setLoading(false)
            }
        }

        if (config.dashboardUid && config.panelId) {
            fetchPanelImage()
        }

        // Cleanup function to revoke object URL
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [config.dashboardUid, config.panelId])

    if (loading) {
        return (
            <Card className={styles.panelPreviewCard}>
                <CardContent>
                    <div className={styles.panelPreviewLoading}>
                        <RefreshCw className={styles.loadingIcon} />
                        <span>Loading panel preview...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className={styles.panelPreviewCard}>
                <CardContent>
                    <div className={styles.panelPreviewError}>
                        <AlertTriangle className={styles.errorIcon} />
                        <span>{error}</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!imageUrl) {
        return (
            <Card className={styles.panelPreviewCard}>
                <CardContent>
                    <div className={styles.panelPreviewError}>
                        <Server className={styles.errorIcon} />
                        <span>No preview available</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={styles.panelPreviewCard}>
            <CardHeader>
                <CardTitle>
                    <div className={styles.panelHeader}>
                        <span>Panel Preview</span>
                        <Button
                            variant="secondary"
                            size="sm"
                            icon="external-link-alt"
                            onClick={() => {
                                // Open the dashboard in a new tab
                                const dashboardUrl = `/d/${config.dashboardUid}?viewPanel=${config.panelId}`
                                window.open(dashboardUrl, '_blank')
                            }}
                            tooltip="Open panel in dashboard"
                        />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={styles.panelImageContainer}>
                    <img
                        src={imageUrl}
                        alt="Panel Preview"
                        className={styles.panelImage}
                        onError={() => setError('Failed to load image')}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export function ServiceDrawer({ open, onOpenChange, record }: ServiceDrawerProps) {
    const { selectedServiceDetails } = useViewStore((state) => state)
    const styles = useStyles2(getStyles)

    console.log('record', record?.layoutSpec?.details)

    const items = record?.layoutSpec?.details?.map((item, index) => {
        switch (item.type) {
            case 'panel':
                const config = item.source as DashboardElementSource
                return <PanelPreview key={index} config={config} />
            default:
                return <div key={index}>Unknown</div>
        }
    })

    if (!open) return null

    return (
        <div className={styles.drawer}>
            <div className={styles.drawerContent}>
                {!selectedServiceDetails ? (
                    // Empty state
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateContent}>
                            <div className={styles.emptyStateIcon}>
                                <Server className={styles.emptyStateIconSvg} />
                            </div>
                            <h3 className={styles.emptyStateTitle}>No Service Selected</h3>
                            <p className={styles.emptyStateDescription}>
                                Click on a service in the service map to see detailed information, metrics, and
                                configuration.
                            </p>
                        </div>
                    </div>
                ) : (
                    // Existing detailed view
                    <>
                        {/* Content */}
                        <div className={styles.contentWrapper}>
                            {/* Header with close button */}
                            <div className={styles.headerActions}>
                                <Button
                                    variant="secondary"
                                    onClick={() => onOpenChange(false)}
                                    icon="times"
                                    size="sm"
                                />
                            </div>

                            <div className={styles.contentWrapper}>
                                {items}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const getStyles = (theme: GrafanaTheme2) => ({
    drawer: css`
        position: fixed;
        right: 0;
        z-index: 50;
        height: 100%;
        background: ${theme.colors.background.primary};
        color: ${theme.colors.text.primary};
        border-left: 1px solid ${theme.colors.border.medium};
        box-shadow: ${theme.shadows.z3};
        transition: all 0.3s ease;
        width: 50%;
    `,
    drawerContent: css`
        height: 100%;
        display: flex;
        flex-direction: column;
    `,
    emptyState: css`
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${theme.spacing(4)};
    `,
    emptyStateContent: css`
        text-align: center;
    `,
    emptyStateIcon: css`
        width: 64px;
        height: 64px;
        margin: 0 auto ${theme.spacing(2)};
        background: ${theme.colors.background.secondary};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    emptyStateIconSvg: css`
        height: 32px;
        width: 32px;
        color: ${theme.colors.text.secondary};
    `,
    emptyStateTitle: css`
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
        margin-bottom: ${theme.spacing(1)};
    `,
    emptyStateDescription: css`
        color: ${theme.colors.text.secondary};
        font-size: ${theme.typography.bodySmall.fontSize};
        max-width: 300px;
    `,
    contentWrapper: css`
        flex: 1;
        overflow: auto;
        padding: ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(8)} ${theme.spacing(2)};
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(2)};
    `,
    headerActions: css`
        display: flex;
        justify-content: flex-end;
        margin-bottom: ${theme.spacing(1)};
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
    tag: css`
        display: inline-flex;
        align-items: center;
        padding: ${theme.spacing(0.5, 1)};
        font-size: ${theme.typography.bodySmall.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        border-radius: ${theme.shape.radius.default};
    `,
    tagDefault: css`
        background: ${theme.colors.background.canvas};
        color: ${theme.colors.text.secondary};
    `,
    tagSuccess: css`
        background: ${theme.colors.success.transparent};
        color: ${theme.colors.success.text};
    `,
    tagWarning: css`
        background: ${theme.colors.warning.transparent};
        color: ${theme.colors.warning.text};
    `,
    tagError: css`
        background: ${theme.colors.error.transparent};
        color: ${theme.colors.error.text};
    `,
    statusContainer: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    statusLeft: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1.5)};
    `,
    statusIcon: css`
        width: 32px;
        height: 32px;
        background: ${theme.colors.success.transparent};
        border-radius: ${theme.shape.radius.default};
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    statusIconSvg: css`
        height: 16px;
        width: 16px;
        color: ${theme.colors.success.text};
    `,
    statusTitle: css`
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    statusSubtitle: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
    `,
    statusRight: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    metricsGrid: css`
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: ${theme.spacing(1.5)};
    `,
    metricLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        margin-bottom: ${theme.spacing(0.5)};
    `,
    metricValue: css`
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    metricChange: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(0.5)};
        margin-top: ${theme.spacing(0.5)};
    `,
    metricChangeIcon: css`
        height: 12px;
        width: 12px;
    `,
    metricChangePositive: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.success.text};
    `,
    metricChangeWarning: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.warning.text};
    `,
    infrastructureGrid: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
    `,
    sectionLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        margin-bottom: ${theme.spacing(1)};
    `,
    sectionContent: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(0.5)};
    `,
    infoRow: css`
        display: flex;
        justify-content: space-between;
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    infoLabel: css`
        color: ${theme.colors.text.secondary};
    `,
    infoValue: css`
        color: ${theme.colors.text.primary};
    `,
    kubernetesGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
    `,
    kubernetesLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.disabled};
        margin-bottom: ${theme.spacing(0.5)};
    `,
    kubernetesValue: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.primary};
    `,
    resourceGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${theme.spacing(2)};
    `,
    resourceHeader: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(1)};
    `,
    resourceIcon: css`
        height: 12px;
        width: 12px;
        color: ${theme.colors.text.secondary};
    `,
    resourceLabel: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
    `,
    resourceValue: css`
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    progressBar: css`
        width: 100%;
        background: ${theme.colors.background.canvas};
        border-radius: ${theme.shape.radius.default};
        height: 4px;
        margin-top: ${theme.spacing(0.5)};
        overflow: hidden;
    `,
    progressBarFill: css`
        height: 100%;
        border-radius: ${theme.shape.radius.default};
        transition: width 0.3s ease;
    `,
    resourceDetails: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.disabled};
        margin-top: ${theme.spacing(0.5)};
    `,
    healthChecks: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1.5)};
    `,
    healthCheck: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    healthCheckLeft: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    healthCheckIcon: css`
        height: 16px;
        width: 16px;
        color: ${theme.colors.success.text};
    `,
    healthCheckName: css`
        font-size: ${theme.typography.body.fontSize};
        color: ${theme.colors.text.primary};
    `,
    operationsHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    table: css`
        width: 100%;
        border-collapse: collapse;
    `,
    tableRow: css`
        border-bottom: 1px solid ${theme.colors.border.medium};
        &:hover {
            background: ${theme.colors.background.canvas};
        }
    `,
    tableHead: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        padding: ${theme.spacing(1)};
        text-align: left;
        height: 32px;
    `,
    tableCell: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.primary};
        padding: ${theme.spacing(1)};
        height: 40px;
    `,
    textRight: css`
        text-align: right;
    `,
    errorRow: css`
        background: ${theme.colors.error.transparent};
    `,
    endpointCell: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    endpointPath: css`
        color: ${theme.colors.text.primary};
        font-family: ${theme.typography.fontFamilyMonospace};
    `,
    errorText: css`
        color: ${theme.colors.error.text};
    `,
    warningText: css`
        color: ${theme.colors.warning.text};
    `,
    dependencies: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1.5)};
    `,
    dependency: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    dependencyLeft: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1.5)};
    `,
    dependencyName: css`
        font-size: ${theme.typography.body.fontSize};
        color: ${theme.colors.text.primary};
    `,
    dependencyTags: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    dependencyRight: css`
        text-align: right;
    `,
    dependencyRequests: css`
        font-size: ${theme.typography.body.fontSize};
        color: ${theme.colors.text.primary};
    `,
    dependencyLatency: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
    `,
    avatar: css`
        height: 24px;
        width: 24px;
        background: ${theme.colors.background.canvas};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    avatarFallback: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
    `,
    configuration: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1)};
    `,
    configItem: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    configLeft: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    configKey: css`
        color: ${theme.colors.text.secondary};
        font-family: ${theme.typography.fontFamilyMonospace};
    `,
    configValue: css`
        color: ${theme.colors.text.primary};
        font-family: ${theme.typography.fontFamilyMonospace};
    `,
    team: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1.5)};
    `,
    teamMember: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    teamMemberLeft: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1.5)};
    `,
    avatarWrapper: css`
        position: relative;
    `,
    onlineIndicator: css`
        position: absolute;
        bottom: 0;
        right: 0;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background: ${theme.colors.success.main};
    `,
    teamMemberName: css`
        font-size: ${theme.typography.body.fontSize};
        color: ${theme.colors.text.primary};
    `,
    teamMemberEmail: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
    `,
    teamMemberRight: css`
        text-align: right;
    `,
    teamMemberLastActive: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        margin-top: ${theme.spacing(0.5)};
    `,
    panelPreviewCard: css`
        margin-bottom: ${theme.spacing(2)};
    `,
    panelHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    `,
    panelImageContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        background: ${theme.colors.background.canvas};
        border-radius: ${theme.shape.radius.default};
        overflow: hidden;
    `,
    panelImage: css`
        max-width: 100%;
        height: auto;
        display: block;
    `,
    panelPreviewLoading: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${theme.spacing(1)};
        color: ${theme.colors.text.secondary};
        z-index: 1;
    `,
    panelPreviewError: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${theme.spacing(1)};
        color: ${theme.colors.error.text};
        z-index: 1;
    `,
    loadingIcon: css`
        height: 16px;
        width: 16px;
        animation: spin 1s linear infinite;
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `,
    errorIcon: css`
        height: 16px;
        width: 16px;
        color: ${theme.colors.error.text};
    `,
})
