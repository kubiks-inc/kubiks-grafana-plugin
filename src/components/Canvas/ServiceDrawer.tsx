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

interface ServiceDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
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

export function ServiceDrawer({ open, onOpenChange }: ServiceDrawerProps) {
    const { selectedServiceDetails } = useViewStore((state) => state)
    const styles = useStyles2(getStyles)

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

                            {/* Status */}
                            <Card>
                                <CardContent>
                                    <div className={styles.statusContainer}>
                                        <div className={styles.statusLeft}>
                                            <div className={styles.statusIcon}>
                                                <Wifi className={styles.statusIconSvg} />
                                            </div>
                                            <div>
                                                <div className={styles.statusTitle}>Operational</div>
                                                <div className={styles.statusSubtitle}>Updated 2s ago</div>
                                            </div>
                                        </div>
                                        <div className={styles.statusRight}>
                                            <Tag variant="success">99.9% Uptime</Tag>
                                            <Button variant="secondary" size="sm">
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Key Metrics */}
                            <div className={styles.metricsGrid}>
                                <Card>
                                    <CardContent>
                                        <div className={styles.metricLabel}>Requests</div>
                                        <div className={styles.metricValue}>43.3K</div>
                                        <div className={styles.metricChange}>
                                            <ArrowUpRight className={styles.metricChangeIcon} />
                                            <span className={styles.metricChangePositive}>5.2%</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <div className={styles.metricLabel}>Errors</div>
                                        <div className={styles.metricValue}>1.07%</div>
                                        <div className={styles.metricChange}>
                                            <TrendingDown className={styles.metricChangeIcon} />
                                            <span className={styles.metricChangePositive}>0.3%</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <div className={styles.metricLabel}>Latency</div>
                                        <div className={styles.metricValue}>16.9ms</div>
                                        <div className={styles.metricChange}>
                                            <ArrowUpRight className={styles.metricChangeIcon} />
                                            <span className={styles.metricChangeWarning}>1.2ms</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <div className={styles.metricLabel}>Apdex</div>
                                        <div className={styles.metricValue}>0.98</div>
                                        <div className={styles.metricChange}>
                                            <ArrowUpRight className={styles.metricChangeIcon} />
                                            <span className={styles.metricChangePositive}>2%</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Infrastructure */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Infrastructure</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.infrastructureGrid}>
                                        <div>
                                            <div className={styles.sectionLabel}>Service</div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Namespace</span>
                                                    <span className={styles.infoValue}>opentelemetry-demo</span>
                                                </div>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Name</span>
                                                    <span className={styles.infoValue}>frontend</span>
                                                </div>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Version</span>
                                                    <span className={styles.infoValue}>v1.2.3</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={styles.sectionLabel}>Runtime</div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Language</span>
                                                    <span className={styles.infoValue}>nodejs</span>
                                                </div>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Version</span>
                                                    <span className={styles.infoValue}>18.19.1</span>
                                                </div>
                                                <div className={styles.infoRow}>
                                                    <span className={styles.infoLabel}>Framework</span>
                                                    <span className={styles.infoValue}>Next.js 14</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className={styles.sectionLabel}>Kubernetes</div>
                                        <div className={styles.kubernetesGrid}>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.kubernetesLabel}>Namespace</div>
                                                <div className={styles.kubernetesValue}>otel-demo</div>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.kubernetesLabel}>Deployment</div>
                                                <div className={styles.kubernetesValue}>frontend</div>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.kubernetesLabel}>Replicas</div>
                                                <div className={styles.kubernetesValue}>3/3</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className={styles.sectionLabel}>Cloud</div>
                                        <div className={styles.kubernetesGrid}>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.kubernetesLabel}>Provider</div>
                                                <div className={styles.kubernetesValue}>AWS</div>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.kubernetesLabel}>Region</div>
                                                <div className={styles.kubernetesValue}>eu-west-1</div>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <div className={styles.kubernetesLabel}>Zone</div>
                                                <div className={styles.kubernetesValue}>eu-west-1a</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resource Usage */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resource Usage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.resourceGrid}>
                                        <div>
                                            <div className={styles.resourceHeader}>
                                                <Cpu className={styles.resourceIcon} />
                                                <span className={styles.resourceLabel}>CPU</span>
                                            </div>
                                            <div className={styles.resourceValue}>45%</div>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressBarFill} style={{ width: '45%', backgroundColor: '#3B82F6' }}></div>
                                            </div>
                                            <div className={styles.resourceDetails}>0.45 / 1.0 cores</div>
                                        </div>
                                        <div>
                                            <div className={styles.resourceHeader}>
                                                <Memory className={styles.resourceIcon} />
                                                <span className={styles.resourceLabel}>Memory</span>
                                            </div>
                                            <div className={styles.resourceValue}>67%</div>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressBarFill} style={{ width: '67%', backgroundColor: '#10B981' }}></div>
                                            </div>
                                            <div className={styles.resourceDetails}>670MB / 1GB</div>
                                        </div>
                                        <div>
                                            <div className={styles.resourceHeader}>
                                                <Disc className={styles.resourceIcon} />
                                                <span className={styles.resourceLabel}>Storage</span>
                                            </div>
                                            <div className={styles.resourceValue}>23%</div>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressBarFill} style={{ width: '23%', backgroundColor: '#F59E0B' }}></div>
                                            </div>
                                            <div className={styles.resourceDetails}>2.3GB / 10GB</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Health Checks */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Health Checks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.healthChecks}>
                                        <div className={styles.healthCheck}>
                                            <div className={styles.healthCheckLeft}>
                                                <CheckCircle className={styles.healthCheckIcon} />
                                                <span className={styles.healthCheckName}>Liveness Probe</span>
                                            </div>
                                            <Tag variant="success">Healthy</Tag>
                                        </div>
                                        <div className={styles.healthCheck}>
                                            <div className={styles.healthCheckLeft}>
                                                <CheckCircle className={styles.healthCheckIcon} />
                                                <span className={styles.healthCheckName}>Readiness Probe</span>
                                            </div>
                                            <Tag variant="success">Ready</Tag>
                                        </div>
                                        <div className={styles.healthCheck}>
                                            <div className={styles.healthCheckLeft}>
                                                <AlertTriangle className={styles.healthCheckIcon} />
                                                <span className={styles.healthCheckName}>Startup Probe</span>
                                            </div>
                                            <Tag variant="warning">Slow</Tag>
                                        </div>
                                        <div className={styles.healthCheck}>
                                            <div className={styles.healthCheckLeft}>
                                                <CheckCircle className={styles.healthCheckIcon} />
                                                <span className={styles.healthCheckName}>Database Connection</span>
                                            </div>
                                            <Tag variant="success">Connected</Tag>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Operations */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Operations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Endpoint</TableHead>
                                                <TableHead className={styles.textRight}>Requests</TableHead>
                                                <TableHead className={styles.textRight}>Errors</TableHead>
                                                <TableHead className={styles.textRight}>Latency</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                {
                                                    method: 'GET',
                                                    path: '/api/products',
                                                    requests: '8.5K',
                                                    errors: '0.0%',
                                                    latency: '22ms',
                                                },
                                                {
                                                    method: 'GET',
                                                    path: '/api/cart',
                                                    requests: '6.4K',
                                                    errors: '0.0%',
                                                    latency: '13ms',
                                                },
                                                {
                                                    method: 'POST',
                                                    path: '/api/checkout',
                                                    requests: '5.8K',
                                                    errors: '0.1%',
                                                    latency: '67ms',
                                                },
                                                {
                                                    method: 'GET',
                                                    path: '/api/recommendations',
                                                    requests: '4.0K',
                                                    errors: '9.7%',
                                                    latency: '56ms',
                                                    hasError: true,
                                                },
                                                {
                                                    method: 'GET',
                                                    path: '/api/user/profile',
                                                    requests: '3.2K',
                                                    errors: '0.0%',
                                                    latency: '15ms',
                                                },
                                                {
                                                    method: 'PUT',
                                                    path: '/api/user/settings',
                                                    requests: '2.1K',
                                                    errors: '0.2%',
                                                    latency: '34ms',
                                                },
                                            ].map((op, index) => (
                                                <TableRow
                                                    key={index}
                                                    className={op.hasError ? styles.errorRow : ''}
                                                >
                                                    <TableCell>
                                                        <div className={styles.endpointCell}>
                                                            <Tag>{op.method}</Tag>
                                                            <span className={styles.endpointPath}>{op.path}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={styles.textRight}>
                                                        {op.requests}
                                                    </TableCell>
                                                    <TableCell className={`${styles.textRight} ${Number.parseFloat(op.errors) > 0 ? styles.errorText : ''}`}>
                                                        {op.errors}
                                                    </TableCell>
                                                    <TableCell className={`${styles.textRight} ${Number.parseInt(op.latency) > 50 ? styles.warningText : ''}`}>
                                                        {op.latency}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Dependencies */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dependencies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.dependencies}>
                                        {[
                                            {
                                                name: 'productcatalogservice',
                                                type: 'gRPC',
                                                status: 'healthy',
                                                latency: '12ms',
                                                requests: '12.3K',
                                            },
                                            {
                                                name: 'currencyservice',
                                                type: 'gRPC',
                                                status: 'healthy',
                                                latency: '8ms',
                                                requests: '8.7K',
                                            },
                                            {
                                                name: 'cartservice',
                                                type: 'gRPC',
                                                status: 'healthy',
                                                latency: '15ms',
                                                requests: '6.1K',
                                            },
                                            {
                                                name: 'recommendationservice',
                                                type: 'gRPC',
                                                status: 'degraded',
                                                latency: '78ms',
                                                requests: '4.2K',
                                            },
                                            {
                                                name: 'postgres-db',
                                                type: 'SQL',
                                                status: 'healthy',
                                                latency: '5ms',
                                                requests: '15.6K',
                                            },
                                            {
                                                name: 'redis-cache',
                                                type: 'Cache',
                                                status: 'healthy',
                                                latency: '2ms',
                                                requests: '23.1K',
                                            },
                                        ].map((dep, index) => (
                                            <div key={index} className={styles.dependency}>
                                                <div className={styles.dependencyLeft}>
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {dep.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className={styles.dependencyName}>{dep.name}</div>
                                                        <div className={styles.dependencyTags}>
                                                            <Tag>{dep.type}</Tag>
                                                            <Tag variant={dep.status === 'healthy' ? 'success' : 'warning'}>
                                                                {dep.status}
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.dependencyRight}>
                                                    <div className={styles.dependencyRequests}>{dep.requests}</div>
                                                    <div className={styles.dependencyLatency}>{dep.latency} avg</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Environment Variables */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.configuration}>
                                        {[
                                            { key: 'NODE_ENV', value: 'production', type: 'env' },
                                            { key: 'LOG_LEVEL', value: 'info', type: 'env' },
                                            { key: 'PORT', value: '8080', type: 'env' },
                                            { key: 'DATABASE_URL', value: '••••••••••••', type: 'secret' },
                                            { key: 'REDIS_URL', value: '••••••••••••', type: 'secret' },
                                            { key: 'API_KEY', value: '••••••••••••', type: 'secret' },
                                        ].map((config, index) => (
                                            <div key={index} className={styles.configItem}>
                                                <div className={styles.configLeft}>
                                                    <span className={styles.configKey}>{config.key}</span>
                                                    <Tag variant={config.type === 'secret' ? 'warning' : 'default'}>
                                                        {config.type}
                                                    </Tag>
                                                </div>
                                                <span className={styles.configValue}>{config.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Team */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Team Access</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.team}>
                                        {[
                                            {
                                                name: 'Sarah Chen',
                                                role: 'Owner',
                                                email: 'sarah@company.com',
                                                lastActive: '2h ago',
                                                online: true,
                                            },
                                            {
                                                name: 'Alex Johnson',
                                                role: 'Developer',
                                                email: 'alex@company.com',
                                                lastActive: '5m ago',
                                                online: true,
                                            },
                                            {
                                                name: 'Miguel Rodriguez',
                                                role: 'DevOps',
                                                email: 'miguel@company.com',
                                                lastActive: '1d ago',
                                                online: false,
                                            },
                                            {
                                                name: 'Priya Patel',
                                                role: 'Developer',
                                                email: 'priya@company.com',
                                                lastActive: '3h ago',
                                                online: false,
                                            },
                                        ].map((member, index) => (
                                            <div key={index} className={styles.teamMember}>
                                                <div className={styles.teamMemberLeft}>
                                                    <div className={styles.avatarWrapper}>
                                                        <Avatar>
                                                            <AvatarFallback>
                                                                {member.name
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {member.online && (
                                                            <span className={styles.onlineIndicator}></span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className={styles.teamMemberName}>{member.name}</div>
                                                        <div className={styles.teamMemberEmail}>{member.email}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.teamMemberRight}>
                                                    <Tag variant={member.role === 'Owner' ? 'success' : 'default'}>
                                                        {member.role}
                                                    </Tag>
                                                    <div className={styles.teamMemberLastActive}>{member.lastActive}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
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
})
