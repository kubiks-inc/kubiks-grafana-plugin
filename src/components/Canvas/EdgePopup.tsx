import React from 'react'
import { createPortal } from 'react-dom'
import { useViewStore } from '@/store/ViewStoreProvider'

export const EdgePopup: React.FC = () => {
    const connectionPopup = useViewStore((state) => state.connectionPopup)

    const getStatusColor = (errorRate: number) => {
        if (errorRate > 5) return '#f43f5e'
        if (errorRate > 1) return '#f59e0b'
        return '#10b981'
    }

    const statusColor = getStatusColor(connectionPopup.errorRate)

    const popupContent = (
        <div
            className="fixed transform rounded-lg shadow-2xl z-50 backdrop-blur-xl"
            style={{
                width: '420px',
                left: connectionPopup.x,
                top: connectionPopup.y,
            }}
        >
            <div className="relative overflow-hidden bg-black/80 border border-white/10 rounded-lg">
                {/* Header with status indicator */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }}></div>
                        <h3 className="text-sm font-medium text-white">Connection Details</h3>
                    </div>
                    <div className="text-xs font-medium bg-white/10 text-white/80 px-2 py-0.5 rounded">
                        {connectionPopup.rps?.toFixed(3)} req/s
                    </div>
                </div>

                {/* Connection path */}
                <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-white/50">From</span>
                            <span className="text-sm font-medium text-white">{connectionPopup.sourceName}</span>
                        </div>
                        <div className="border-t border-white/20 w-12 mx-2"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-white/50">To</span>
                            <span className="text-sm font-medium text-white">{connectionPopup.targetName}</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 px-4 py-3 border-b border-white/10">
                    <div className="flex flex-col">
                        <span className="text-xs text-white/50">Error Rate</span>
                        <span className="text-sm font-medium text-white">
                            {connectionPopup.errorRate?.toFixed(2)}%
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-white/50">Latency</span>
                        <span className="text-sm font-medium text-white">
                            {connectionPopup.latency > 1000
                                ? `${(connectionPopup.latency / 1000)?.toFixed(2)} s`
                                : `${connectionPopup.latency?.toFixed(2)} ms`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-white/50">Status</span>
                        <span className="text-sm font-medium" style={{ color: statusColor }}>
                            {connectionPopup.errorRate > 5
                                ? 'Critical'
                                : connectionPopup.errorRate > 1
                                    ? 'Warning'
                                    : 'Healthy'}
                        </span>
                    </div>
                </div>

                {/* Redesigned Endpoints Section */}
                {connectionPopup.endpoints && Object.keys(connectionPopup.endpoints).length > 0 && (
                    <div className="px-4 py-3 border-b border-white/10">
                        <h4 className="text-xs font-medium text-white/60 mb-3">Endpoints</h4>
                        <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {Object.entries(connectionPopup.endpoints).map(([type, endpoints]) => (
                                <div key={type} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-xs font-bold text-white/90 uppercase tracking-wide px-2 py-1 bg-white/10 rounded-sm">
                                            {type}
                                        </div>
                                        <div className="flex-grow h-px bg-white/5"></div>
                                    </div>

                                    <div className="space-y-2">
                                        {endpoints.map((endpoint, index) => (
                                            <div
                                                key={index}
                                                className="group rounded-md bg-white/[0.02] hover:bg-white/[0.05] transition-colors p-2.5"
                                            >
                                                <div className="flex items-center mb-2">
                                                    <span
                                                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white mr-2 flex items-center justify-center min-w-[50px]"
                                                        style={{
                                                            background:
                                                                endpoint.endpoint?.split(' ')[0] === 'GET'
                                                                    ? 'rgba(16, 185, 129, 0.25)'
                                                                    : endpoint.endpoint?.split(' ')[0] === 'POST'
                                                                        ? 'rgba(99, 102, 241, 0.25)'
                                                                        : endpoint.endpoint?.split(' ')[0] === 'PUT'
                                                                            ? 'rgba(245, 158, 11, 0.25)'
                                                                            : endpoint.endpoint?.split(' ')[0] === 'DELETE'
                                                                                ? 'rgba(244, 63, 94, 0.25)'
                                                                                : 'rgba(255, 255, 255, 0.2)',
                                                            color:
                                                                endpoint.endpoint?.split(' ')[0] === 'GET'
                                                                    ? '#10b981'
                                                                    : endpoint.endpoint?.split(' ')[0] === 'POST'
                                                                        ? '#6366f1'
                                                                        : endpoint.endpoint?.split(' ')[0] === 'PUT'
                                                                            ? '#f59e0b'
                                                                            : endpoint.endpoint?.split(' ')[0] === 'DELETE'
                                                                                ? '#f43f5e'
                                                                                : '#fff',
                                                            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
                                                        }}
                                                    >
                                                        {endpoint.endpoint?.split(' ')[0]}
                                                    </span>
                                                    <span className="text-xs text-white/90 font-mono truncate max-w-[280px]">
                                                        {endpoint.endpoint?.split(' ')[1]}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-[10px]">
                                                    <div className="flex flex-col">
                                                        <span className="text-white/40 mb-0.5">Latency</span>
                                                        <span className="text-white tabular-nums font-medium">
                                                            {endpoint.avgLatencyMs > 1000
                                                                ? `${(endpoint.avgLatencyMs / 1000).toFixed(2)} s`
                                                                : `${endpoint.avgLatencyMs?.toFixed(2)} ms`}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-white/40 mb-0.5">Requests</span>
                                                        <span className="text-white tabular-nums font-medium">
                                                            {endpoint.rps?.toFixed(3)} req/s
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-white/40 mb-0.5">Errors</span>
                                                        <span
                                                            className="tabular-nums font-medium"
                                                            style={{
                                                                color:
                                                                    endpoint.errorRate > 0
                                                                        ? getStatusColor(endpoint.errorRate)
                                                                        : 'rgba(255,255,255,0.7)',
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
                )}

                {/* Button */}
                <div className="px-4 py-3 flex justify-end">
                    {/* <button
            onClick={(e) => {
              e.stopPropagation()
              // onViewEvents()
            }}
            className="bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center"
          >
            View Events
          </button> */}
                </div>
            </div>
        </div>
    )

    return connectionPopup.open ? createPortal(popupContent, document.body) : null
}
