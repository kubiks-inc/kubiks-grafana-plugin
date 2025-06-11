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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
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
    const variants = {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-green-950 text-green-400',
        warning: 'bg-yellow-950 text-yellow-400',
        error: 'bg-red-950 text-red-400',
    }

    return (
        <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${variants[variant]}`}
        >
            {children}
        </span>
    )
}

export function ServiceDrawer({ open, onOpenChange }: ServiceDrawerProps) {
    const { selectedServiceDetails } = useViewStore((state) => state)

    if (!open) return null

    return (
        <TooltipProvider>
            <div
                className={`fixed top-[57px] right-0 z-50 h-[calc(100vh-57px)] bg-black text-white border-l border-zinc-800 shadow-2xl transition-all duration-300 ${selectedServiceDetails ? 'w-[50%]' : 'w-[20%]'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {!selectedServiceDetails ? (
                        // Empty state
                        <>
                            {/* Empty state content */}
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                                        <Server className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">No Service Selected</h3>
                                    <p className="text-zinc-400 text-sm max-w-xs">
                                        Click on a service in the service map to see detailed information, metrics, and
                                        configuration.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Existing detailed view
                        <>
                            {/* Content */}
                            <div className="flex-1 overflow-auto p-4 space-y-4">
                                {/* Header with close button */}
                                <div className="flex justify-end mb-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onOpenChange(false)}
                                        className="h-7 w-7 text-zinc-400 hover:text-white"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* Status */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-950 rounded flex items-center justify-center">
                                                    <Wifi className="h-4 w-4 text-green-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">Operational</div>
                                                    <div className="text-xs text-zinc-400">Updated 2s ago</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Tag variant="success">99.9% Uptime</Tag>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs text-zinc-400 hover:text-white"
                                                >
                                                    Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-4 gap-3">
                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardContent className="p-3">
                                            <div className="text-xs text-zinc-400 mb-1">Requests</div>
                                            <div className="text-lg font-medium text-white">43.3K</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ArrowUpRight className="h-3 w-3 text-green-400" />
                                                <span className="text-xs text-green-400">5.2%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardContent className="p-3">
                                            <div className="text-xs text-zinc-400 mb-1">Errors</div>
                                            <div className="text-lg font-medium text-white">1.07%</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <TrendingDown className="h-3 w-3 text-green-400" />
                                                <span className="text-xs text-green-400">0.3%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardContent className="p-3">
                                            <div className="text-xs text-zinc-400 mb-1">Latency</div>
                                            <div className="text-lg font-medium text-white">16.9ms</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ArrowUpRight className="h-3 w-3 text-yellow-400" />
                                                <span className="text-xs text-yellow-400">1.2ms</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-zinc-900 border-zinc-800">
                                        <CardContent className="p-3">
                                            <div className="text-xs text-zinc-400 mb-1">Apdex</div>
                                            <div className="text-lg font-medium text-white">0.98</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ArrowUpRight className="h-3 w-3 text-green-400" />
                                                <span className="text-xs text-green-400">2%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Infrastructure */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <CardTitle className="text-sm font-medium text-white">Infrastructure</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-zinc-400 mb-2">Service</div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Namespace</span>
                                                        <span className="text-white">opentelemetry-demo</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Name</span>
                                                        <span className="text-white">frontend</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Version</span>
                                                        <span className="text-white">v1.2.3</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-zinc-400 mb-2">Runtime</div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Language</span>
                                                        <span className="text-white">nodejs</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Version</span>
                                                        <span className="text-white">18.19.1</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-zinc-400">Framework</span>
                                                        <span className="text-white">Next.js 14</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-zinc-400 mb-2">Kubernetes</div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs text-zinc-500">Namespace</div>
                                                    <div className="text-sm text-white">otel-demo</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-zinc-500">Deployment</div>
                                                    <div className="text-sm text-white">frontend</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-zinc-500">Replicas</div>
                                                    <div className="text-sm text-white">3/3</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-zinc-400 mb-2">Cloud</div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs text-zinc-500">Provider</div>
                                                    <div className="text-sm text-white">AWS</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-zinc-500">Region</div>
                                                    <div className="text-sm text-white">eu-west-1</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-zinc-500">Zone</div>
                                                    <div className="text-sm text-white">eu-west-1a</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Resource Usage */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <CardTitle className="text-sm font-medium text-white">Resource Usage</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Cpu className="h-3 w-3 text-zinc-400" />
                                                    <span className="text-xs text-zinc-400">CPU</span>
                                                </div>
                                                <div className="text-lg font-medium text-white">45%</div>
                                                <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
                                                    <div className="bg-blue-500 h-1 rounded-full w-[45%]"></div>
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-1">0.45 / 1.0 cores</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Memory className="h-3 w-3 text-zinc-400" />
                                                    <span className="text-xs text-zinc-400">Memory</span>
                                                </div>
                                                <div className="text-lg font-medium text-white">67%</div>
                                                <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
                                                    <div className="bg-green-500 h-1 rounded-full w-[67%]"></div>
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-1">670MB / 1GB</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Disc className="h-3 w-3 text-zinc-400" />
                                                    <span className="text-xs text-zinc-400">Storage</span>
                                                </div>
                                                <div className="text-lg font-medium text-white">23%</div>
                                                <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
                                                    <div className="bg-yellow-500 h-1 rounded-full w-[23%]"></div>
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-1">2.3GB / 10GB</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Health Checks */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-medium text-white">
                                                Health Checks
                                            </CardTitle>
                                            <Button
                                                size="sm"
                                                className="h-7 text-xs bg-purple-900 hover:bg-purple-800 text-white"
                                            >
                                                View Alerts
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm text-white">Liveness Probe</span>
                                                </div>
                                                <Tag variant="success">Healthy</Tag>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm text-white">Readiness Probe</span>
                                                </div>
                                                <Tag variant="success">Ready</Tag>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                                    <span className="text-sm text-white">Startup Probe</span>
                                                </div>
                                                <Tag variant="warning">Slow</Tag>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm text-white">Database Connection</span>
                                                </div>
                                                <Tag variant="success">Connected</Tag>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Operations */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-medium text-white">
                                                Top Operations
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Tag>28 total</Tag>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs text-zinc-400 hover:text-white"
                                                >
                                                    View All
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                                    <TableHead className="text-xs text-zinc-400 h-8">Endpoint</TableHead>
                                                    <TableHead className="text-xs text-zinc-400 h-8 text-right">
                                                        Requests
                                                    </TableHead>
                                                    <TableHead className="text-xs text-zinc-400 h-8 text-right">
                                                        Errors
                                                    </TableHead>
                                                    <TableHead className="text-xs text-zinc-400 h-8 text-right">
                                                        Latency
                                                    </TableHead>
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
                                                        className={cn('border-zinc-800 h-10', op.hasError && 'bg-red-950/20')}
                                                    >
                                                        <TableCell className="text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <Tag>{op.method}</Tag>
                                                                <span className="text-white font-mono">{op.path}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-xs text-white text-right font-mono">
                                                            {op.requests}
                                                        </TableCell>
                                                        <TableCell
                                                            className={cn(
                                                                'text-xs text-right font-mono',
                                                                Number.parseFloat(op.errors) > 0 ? 'text-red-400' : 'text-zinc-300'
                                                            )}
                                                        >
                                                            {op.errors}
                                                        </TableCell>
                                                        <TableCell
                                                            className={cn(
                                                                'text-xs text-right font-mono',
                                                                Number.parseInt(op.latency) > 50
                                                                    ? 'text-yellow-400'
                                                                    : 'text-zinc-300'
                                                            )}
                                                        >
                                                            {op.latency}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Dependencies */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <CardTitle className="text-sm font-medium text-white">Dependencies</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
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
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-6 w-6 bg-zinc-800">
                                                            <AvatarFallback className="text-xs text-zinc-300">
                                                                {dep.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="text-sm text-white">{dep.name}</div>
                                                            <div className="flex items-center gap-2">
                                                                <Tag>{dep.type}</Tag>
                                                                <Tag variant={dep.status === 'healthy' ? 'success' : 'warning'}>
                                                                    {dep.status}
                                                                </Tag>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-white">{dep.requests}</div>
                                                        <div className="text-xs text-zinc-400">{dep.latency} avg</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Environment Variables */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <CardTitle className="text-sm font-medium text-white">Configuration</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {[
                                                { key: 'NODE_ENV', value: 'production', type: 'env' },
                                                { key: 'LOG_LEVEL', value: 'info', type: 'env' },
                                                { key: 'PORT', value: '8080', type: 'env' },
                                                { key: 'DATABASE_URL', value: '••••••••••••', type: 'secret' },
                                                { key: 'REDIS_URL', value: '••••••••••••', type: 'secret' },
                                                { key: 'API_KEY', value: '••••••••••••', type: 'secret' },
                                            ].map((config, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-zinc-400 font-mono">{config.key}</span>
                                                        <Tag variant={config.type === 'secret' ? 'warning' : 'default'}>
                                                            {config.type}
                                                        </Tag>
                                                    </div>
                                                    <span className="text-white font-mono">{config.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Team */}
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardHeader className="pb-2 border-b border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-medium text-white">Team Access</CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-zinc-400 hover:text-white"
                                            >
                                                Manage
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
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
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <Avatar className="h-8 w-8 bg-zinc-800">
                                                                <AvatarFallback className="text-xs text-zinc-300">
                                                                    {member.name
                                                                        .split(' ')
                                                                        .map((n) => n[0])
                                                                        .join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {member.online && (
                                                                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-white">{member.name}</div>
                                                            <div className="text-xs text-zinc-400">{member.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Tag variant={member.role === 'Owner' ? 'success' : 'default'}>
                                                            {member.role}
                                                        </Tag>
                                                        <div className="text-xs text-zinc-400 mt-1">{member.lastActive}</div>
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
        </TooltipProvider>
    )
}
