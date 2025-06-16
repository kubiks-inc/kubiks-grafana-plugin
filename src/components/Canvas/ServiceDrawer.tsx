import {
    AlertTriangle,
    ExternalLink,
    Server,
    RefreshCw,
} from 'lucide-react'
import React, { useState } from 'react'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { Button, useStyles2, Badge } from '@grafana/ui'
import { useViewStore } from '@/store/ViewStoreProvider'
import { DashboardElementSource, Record, LayoutItem } from '@/lib/model/view'
import { getBackendSrv } from '@grafana/runtime'
import { getIconUrlWithFallback } from '@/utils/iconMapper'
import { getTitle } from './helpers'

interface ServiceDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: Record
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

type Status = 'Success' | 'Warning' | 'Failed' | 'Running' | 'Online'

const getStatusBadgeColor = (status: Status) => {
    switch (status) {
        case 'Success':
        case 'Running':
        case 'Online':
            return 'green'
        case 'Warning':
            return 'orange'
        case 'Failed':
            return 'red'
        default:
            return 'blue'
    }
}

const CopyableText = ({
    text,
    className,
    disabled = false,
}: {
    text: string
    className?: string
    disabled?: boolean
}) => {
    const [copied, setCopied] = useState(false)
    const styles = useStyles2(getStyles)

    const handleCopy = () => {
        if (disabled) return
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 600)
    }

    return (
        <span
            onClick={disabled ? undefined : handleCopy}
            className={`${styles.copyableText} ${disabled ? styles.copyableDisabled : styles.copyableEnabled} ${className || ''}`}
            title={text}
        >
            <span className={styles.textContent}>{text}</span>
            {copied && !disabled && (
                <span className={styles.copiedOverlay}>
                    Copied
                </span>
            )}
        </span>
    )
}

// Component to visualize pods as blocks
const BlocksComponent = ({
    blocks,
    disabled = false,
}: {
    blocks: { name: string; status: Status; url: string }[]
    disabled?: boolean
}) => {
    const styles = useStyles2(getStyles)

    return (
        <div className={styles.blocksContainer}>
            <div className={styles.blocksGrid}>
                {blocks?.map((block, index) => (
                    <div
                        key={index}
                        className={`${styles.block} ${disabled
                            ? styles.blockDisabled
                            : block.url
                                ? styles.blockClickable
                                : styles.blockDefault
                            }`}
                        onClick={!disabled && block.url ? () => window.open(block.url, '_blank') : undefined}
                    >
                        <div className={styles.blockHeader}>
                            <div className={`${styles.statusDot} ${styles[`statusDot${block.status}` as keyof typeof styles]}`} />
                            <span className={styles.blockName}>{block.name}</span>
                        </div>
                        <div className={styles.blockStatus}>
                            <Badge
                                text={block.status}
                                color={getStatusBadgeColor(block.status)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const PanelPreview = ({ config }: { config: DashboardElementSource }) => {
    const styles = useStyles2(getStyles)
    const [imageUrl, setImageUrl] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [isHovered, setIsHovered] = React.useState(false)

    React.useEffect(() => {
        const fetchPanelImage = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get the current time range (you might want to make this configurable)
                const from = Date.now() - 6 * 60 * 60 * 1000 // 6 hours ago
                const to = Date.now()

                // Construct the render URL for the panel - let Grafana use default dimensions
                const renderUrl = `/render/d-solo/${config.dashboardUid}?panelId=${config.panelId}&from=${from}&to=${to}`

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

    const handleClick = () => {
        const dashboardUrl = `/d/${config.dashboardUid}?viewPanel=${config.panelId}`
        window.open(dashboardUrl, '_blank')
    }

    if (loading) {
        return (
            <div className={styles.panelPreviewPlaceholder}>
                <RefreshCw className={styles.loadingIcon} />
                <span>Loading panel preview...</span>
            </div>
        )
    }

    if (error || !imageUrl) {
        return (
            <div className={styles.panelPreviewPlaceholder}>
                <AlertTriangle className={styles.errorIcon} />
                <span>{error || 'No preview available'}</span>
            </div>
        )
    }

    return (
        <div
            className={styles.panelPreviewContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <img
                src={imageUrl}
                alt="Panel Preview"
                className={styles.panelPreviewImage}
                onError={() => setError('Failed to load image')}
            />
            {isHovered && (
                <div className={styles.panelPreviewOverlay}>
                    <Button
                        variant="primary"
                        size="sm"
                        icon="external-link-alt"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClick()
                        }}
                    >
                        Open Panel
                    </Button>
                </div>
            )}
        </div>
    )
}

// Component for rendering links grid
const LinksGrid = ({ links, styles }: { links: LayoutItem[], styles: any }) => {
    if (!links || links.length === 0) return null

    return (
        <div className={styles.linksGridContainer}>
            <div className={styles.linksGrid}>
                {links.map((link, index) => (
                    <div
                        key={index}
                        className={styles.linkItem}
                        onClick={() => window.open(link.value?.data as string, '_blank', 'noopener,noreferrer')}
                        title={link.label}
                    >
                        <div className={styles.linkIconWrapper}>
                            {link.icon ? (
                                <img
                                    src={getIconUrlWithFallback(link.icon)}
                                    alt={link.label}
                                    className={styles.linkItemIcon}
                                />
                            ) : (
                                <ExternalLink className={styles.linkItemIconDefault} />
                            )}
                        </div>
                        <span className={styles.linkItemLabel}>{link.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const renderLayoutItem = (item: LayoutItem, index: number, key: string, styles: any) => {
    switch (item.type) {
        case 'panel':
            const config = item.value?.data as DashboardElementSource
            return <PanelPreview key={`${key}-panel-${index}`} config={config} />
        case 'status':
            const statusValue = item.value?.data as Status | undefined
            return (
                <Card key={`${key}-status-${index}`}>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.drawerStatusContainer}>
                            {statusValue && (
                                <div className={`${styles.statusDot} ${styles[`statusDot${statusValue}` as keyof typeof styles]}`} />
                            )}
                            <Badge
                                text={statusValue || 'Unknown'}
                                color={getStatusBadgeColor(statusValue as Status)}
                            />
                        </div>
                    </CardContent>
                </Card>
            )
        case 'text':
            return (
                <Card key={`${key}-text-${index}`}>
                    <CardHeader>
                        <CardTitle>{item.label || 'Information'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.drawerTextField}>
                            <CopyableText text={item.value?.data as string} />
                        </div>
                    </CardContent>
                </Card>
            )
        case 'tags':
            return (
                <Card key={`${key}-tags-${index}`}>
                    <CardHeader>
                        <CardTitle>{item.label || 'Tags'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.drawerTagsGrid}>
                            {Object.entries(item.value?.data || {}).map(([_, val]) => (
                                <Badge
                                    key={val}
                                    text={val}
                                    color="blue"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )
        case 'keyValue':
            return (
                <Card key={`${key}-keyValue-${index}`}>
                    <CardHeader>
                        <CardTitle>{item.label || 'Configuration'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.drawerKeyValueGrid}>
                            {Object.entries(item.value?.data || {}).map(([key, val], idx) => (
                                <div key={idx} className={styles.drawerKeyValuePair}>
                                    <span className={styles.drawerKeyValueKey}>{key}:</span>{' '}
                                    <CopyableText text={val as string} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )
        case 'progress':
            const percentage = Math.max(Number(item.value?.data), 0)
            const isWarning = percentage >= 70 && percentage < 80
            const isDanger = percentage >= 80
            return (
                <Card key={`${key}-progress-${index}`}>
                    <CardHeader>
                        <CardTitle>{item.label || 'Progress'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.drawerProgressContainer}>
                            <div className={styles.drawerProgressHeader}>
                                <span className={`${styles.drawerProgressValue} ${isDanger ? styles.progressDanger : isWarning ? styles.progressWarning : styles.progressSuccess
                                    }`}>
                                    {percentage.toFixed(2)}%
                                </span>
                            </div>
                            <div className={styles.drawerProgressBar}>
                                <div
                                    className={`${styles.drawerProgressFill} ${isDanger ? styles.progressFillDanger : isWarning ? styles.progressFillWarning : styles.progressFillSuccess
                                        }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        case 'inversed_progress':
            const inversePercentage = Math.max(Number(item.value?.data), 0)
            const isInverseDanger = inversePercentage <= 20
            const isInverseWarning = inversePercentage > 20 && inversePercentage <= 30
            return (
                <Card key={`${key}-inversed_progress-${index}`}>
                    <CardHeader>
                        <CardTitle>{item.label || 'Available Resources'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.drawerProgressContainer}>
                            <div className={styles.drawerProgressHeader}>
                                <span className={`${styles.drawerProgressValue} ${isInverseDanger ? styles.progressDanger : isInverseWarning ? styles.progressWarning : styles.progressSuccess
                                    }`}>
                                    {inversePercentage.toFixed(2)}%
                                </span>
                            </div>
                            <div className={styles.drawerProgressBar}>
                                <div
                                    className={`${styles.drawerProgressFill} ${isInverseDanger ? styles.progressFillDanger : isInverseWarning ? styles.progressFillWarning : styles.progressFillSuccess
                                        }`}
                                    style={{ width: `${Math.min(inversePercentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        case 'blocks':
            return (
                <Card key={`${key}-blocks-${index}`}>
                    <CardHeader>
                        <CardTitle>{item.label || 'Resources'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BlocksComponent blocks={item.value?.data as any} />
                    </CardContent>
                </Card>
            )
        case 'link':
            // Links are now handled separately in the LinksGrid component
            return null
        default:
            return (
                <Card key={`${key}-unknown-${index}`}>
                    <CardContent>
                        <div>Unknown item type: {item.type}</div>
                    </CardContent>
                </Card>
            )
    }
}

export function ServiceDrawer({ open, onOpenChange, record }: ServiceDrawerProps) {
    const { selectedServiceDetails } = useViewStore((state) => state)
    const styles = useStyles2(getStyles)

    console.log('record for drawer', record)

    // Extract title and links from details and filter them out from main content rendering
    const title = getTitle(record?.details)
    const linkItems = record?.details?.filter(item => item.type === 'link') || []
    const filteredDetails = record?.details?.filter(item => item.type !== 'title' && item.type !== 'link') || []

    const items = filteredDetails.map((item, index) =>
        renderLayoutItem(item, index, record.key || 'drawer', styles)
    )

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
                            {/* Header with title and close button */}
                            <div className={styles.drawerHeader}>
                                <div className={styles.drawerTitleContainer}>
                                    {title && (
                                        <h2 className={styles.drawerTitle}>{title}</h2>
                                    )}
                                </div>
                                <div className={styles.headerActions}>
                                    <Button
                                        variant="secondary"
                                        onClick={() => onOpenChange(false)}
                                        icon="times"
                                        size="sm"
                                    />
                                </div>
                            </div>

                            {/* Links Grid */}
                            <LinksGrid links={linkItems} styles={styles} />

                            <div className={styles.drawerItemsContainer}>
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
    panelPreviewContainer: css`
        position: relative;
        cursor: pointer;
        border-radius: ${theme.shape.radius.default};
        overflow: visible;
        transition: all 0.2s ease;
        margin-bottom: ${theme.spacing(2)};
        width: 100%;
    `,
    panelPreviewImage: css`
        width: 100%;
        height: auto;
        display: block;
        border-radius: ${theme.shape.radius.default};
        max-height: none;
    `,
    panelPreviewPlaceholder: css`
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${theme.spacing(1)};
        padding: ${theme.spacing(4)};
        background: ${theme.colors.background.secondary};
        border: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default};
        color: ${theme.colors.text.secondary};
        margin-bottom: ${theme.spacing(2)};
    `,
    panelPreviewOverlay: css`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        border-radius: ${theme.shape.radius.default};
        opacity: 0;
        animation: fadeIn 0.2s ease forwards;
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
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
    // CopyableText styles
    copyableText: css`
        position: relative;
        display: inline-block;
        padding: ${theme.spacing(0.5, 1)};
        border-radius: ${theme.shape.radius.default};
        transition: all 0.2s ease;
        word-break: break-all;
        max-width: 100%;
    `,
    copyableEnabled: css`
        cursor: pointer;
        background: ${theme.colors.background.canvas};
        &:hover {
            background: ${theme.colors.emphasize(theme.colors.background.canvas, 0.03)};
        }
    `,
    copyableDisabled: css`
        cursor: default;
        background: transparent;
    `,
    textContent: css`
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${theme.colors.text.primary};
    `,
    copiedOverlay: css`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${theme.colors.background.secondary};
        color: ${theme.colors.text.primary};
        border-radius: ${theme.shape.radius.default};
        font-weight: ${theme.typography.fontWeightMedium};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    // Blocks styles
    blocksContainer: css`
        margin-top: ${theme.spacing(1)};
    `,
    blocksGrid: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1)};
    `,
    block: css`
        padding: ${theme.spacing(1, 1.5)};
        background: ${theme.colors.background.canvas};
        border: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default};
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s ease;
    `,
    blockDefault: css`
        cursor: default;
    `,
    blockClickable: css`
        cursor: pointer;
        &:hover {
            border-color: ${theme.colors.border.strong};
            background: ${theme.colors.emphasize(theme.colors.background.canvas, 0.03)};
        }
    `,
    blockDisabled: css`
        cursor: default;
        opacity: 0.6;
    `,
    blockHeader: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        flex: 1;
        min-width: 0;
    `,
    blockName: css`
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    blockStatus: css`
        flex-shrink: 0;
    `,
    statusDot: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
    `,
    statusDotSuccess: css`
        background: ${theme.colors.success.main};
    `,
    statusDotWarning: css`
        background: ${theme.colors.warning.main};
    `,
    statusDotFailed: css`
        background: ${theme.colors.error.main};
    `,
    statusDotRunning: css`
        background: ${theme.colors.success.main};
    `,
    statusDotOnline: css`
        background: ${theme.colors.success.main};
    `,
    // Drawer-specific component styles
    drawerStatusContainer: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    drawerTextField: css`
        font-size: ${theme.typography.body.fontSize};
        color: ${theme.colors.text.primary};
    `,
    drawerTagsGrid: css`
        display: flex;
        gap: ${theme.spacing(0.5)};
        flex-wrap: wrap;
    `,
    drawerKeyValueGrid: css`
        display: grid;
        grid-template-columns: 1fr;
        gap: ${theme.spacing(1)};
    `,
    drawerKeyValuePair: css`
        font-size: ${theme.typography.body.fontSize};
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
    `,
    drawerKeyValueKey: css`
        color: ${theme.colors.text.secondary};
        font-weight: ${theme.typography.fontWeightMedium};
        flex-shrink: 0;
    `,
    drawerProgressContainer: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1.5)};
    `,
    drawerProgressHeader: css`
        display: flex;
        justify-content: flex-end;
        align-items: center;
    `,
    drawerProgressValue: css`
        font-size: ${theme.typography.h6.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
    `,
    drawerProgressBar: css`
        width: 100%;
        background: ${theme.colors.background.canvas};
        border-radius: ${theme.shape.radius.default};
        height: 8px;
        overflow: hidden;
    `,
    drawerProgressFill: css`
        height: 100%;
        border-radius: ${theme.shape.radius.default};
        transition: all 0.3s ease;
    `,
    progressSuccess: css`
        color: ${theme.colors.success.text};
    `,
    progressWarning: css`
        color: ${theme.colors.warning.text};
    `,
    progressDanger: css`
        color: ${theme.colors.error.text};
    `,
    progressFillSuccess: css`
        background: ${theme.colors.success.main};
    `,
    progressFillWarning: css`
        background: ${theme.colors.warning.main};
    `,
    progressFillDanger: css`
        background: ${theme.colors.error.main};
    `,
    drawerLinkCard: css`
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
            border-color: ${theme.colors.border.strong};
            box-shadow: ${theme.shadows.z2};
        }
    `,
    drawerLinkButton: css`
        cursor: pointer;
        width: 100%;
    `,
    drawerLinkContent: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding: ${theme.spacing(1)};
    `,
    drawerLinkIconContainer: css`
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${theme.colors.background.canvas};
        border-radius: 50%;
        flex-shrink: 0;
    `,
    drawerLinkIcon: css`
        width: 16px;
        height: 16px;
        object-fit: contain;
    `,
    drawerLinkLabel: css`
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
        flex: 1;
    `,
    drawerLinkExternalIcon: css`
        width: 16px;
        height: 16px;
        color: ${theme.colors.text.secondary};
        flex-shrink: 0;
    `,
    drawerHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(2)} 0;
        border-bottom: 1px solid ${theme.colors.border.medium};
        margin-bottom: ${theme.spacing(2)};
    `,
    drawerTitleContainer: css`
        flex: 1;
        min-width: 0;
    `,
    drawerTitle: css`
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.colors.text.primary};
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    drawerItemsContainer: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(2)};
        flex: 1;
        overflow: auto;
    `,
    // Links Grid Styles
    linksGridContainer: css`
        margin-bottom: ${theme.spacing(3)};
        padding-bottom: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.weak};
    `,
    linksGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
        gap: ${theme.spacing(2)};
        width: 100%;
    `,
    linkItem: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: ${theme.spacing(1)};
        background: ${theme.colors.background.secondary};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.radius.default};
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 45px;
        text-decoration: none;
        
        &:hover {
            border-color: ${theme.colors.border.medium};
            background: ${theme.colors.emphasize(theme.colors.background.secondary, 0.03)};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.z1};
        }
        
        &:active {
            transform: translateY(0);
        }
    `,
    linkIconWrapper: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-bottom: ${theme.spacing(0.25)};
        background: ${theme.colors.background.canvas};
        border-radius: 50%;
        flex-shrink: 0;
    `,
    linkItemIcon: css`
        width: 12px;
        height: 12px;
        object-fit: contain;
    `,
    linkItemIconDefault: css`
        width: 10px;
        height: 10px;
        color: ${theme.colors.text.secondary};
    `,
    linkItemLabel: css`
        font-size: 10px;
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
        text-align: center;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
        hyphens: auto;
    `,
})
