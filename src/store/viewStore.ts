import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'
import { View } from '@/lib/model/view'
import { ViewState } from '@/lib/model/view-state'
import { ViewSnapshotStat } from '@/lib/model/view-snapshot'
import { ViewRecord } from '@/lib/model/record'
import { Edge } from '@xyflow/react'
import { SystemEvent } from '@/lib/model/event'
import { LogSource, LogFilterLabel } from '@/lib/model/log-source'
import { LogFilter } from '@/components/canvas/log-filters'
import { TraceSource, TraceFilterLabel } from '@/lib/model/trace-source'
import { TraceFilter } from '@/components/canvas/trace-filters'
import { getParentId, getHiddenNodes } from '@/components/Canvas/helpers'

interface ContextMenu {
    open: boolean
    position: { x: number; y: number }
    nodeId: string | undefined
}

export type LogsPanelMetadata = {
    searchQuery: string
    selectedTimeRange: number
    selectedSource?: string
}

export interface Panel {
    id: string
    type: 'logs' | 'traces' | 'metrics'
    metadata: LogsPanelMetadata
}

type Endpoint = {
    avgLatencyMs: number
    destinationServiceName: string
    endpoint: string
    endpointType: string
    errorRate: number
    key: string
    rps: number
    sourceServiceName: string
    timestamp: number
}

type ConnectionPopup = {
    x: number
    y: number
    placement: 'top' | 'bottom' | 'left' | 'right'
    open: boolean
    rps: number
    errorRate: number
    latency: number
    sourceName: string
    targetName: string
    endpoints?: Record<string, Endpoint[]>
}

export type ViewStoreState = {
    liveMode: boolean
    editLayout: boolean
    selectedTimestamp: string | undefined
    selectedNode: string | undefined
    contextMenu: ContextMenu
    connectionPopup: ConnectionPopup
    panelViewMode: 'list' | 'detail'
    selectedPanel: string | undefined
    panelDialogOpen: boolean
    panels: Panel[]
    view: View
    viewState: ViewState
    snapshots: ViewSnapshotStat[]
    events: SystemEvent[]
    args: Record<string, string>
    originalViewState: ViewState
    filteredRecords: ViewRecord[] | undefined
    accessToken: string | undefined

    elementsToExplore: string[]
    selectedServiceDetails: string
    isServiceDrawerOpen: boolean
    devMode: 'production' | 'local' | ''

    fetchLogsAction: (
        from: string,
        to: string,
        source: LogSource,
        logFilter: LogFilter,
        logLevels: string[],
        limit: number,
        offset: number
    ) => Promise<any[]>

    fetchLogsVolumeAction: (
        from: string,
        to: string,
        source: LogSource,
        logFilter: LogFilter,
        logLevels: string[]
    ) => Promise<any[]>

    fetchTracesAction: (
        from: string,
        to: string,
        source: TraceSource,
        traceFilter: TraceFilter,
        traceStatuses: string[],
        limit: number,
        offset: number,
        traceId?: string
    ) => Promise<any[]>

    fetchTracesVolumeAction: (
        from: string,
        to: string,
        source: TraceSource,
        traceFilter: TraceFilter,
        traceStatuses: string[],
        traceId?: string
    ) => Promise<any[]>

    fetchSpansAction: (traceId: string, source: TraceSource) => Promise<any[]>
}

export type ViewStoreActions = {
    setLiveMode: (liveMode: boolean) => void
    setEditLayout: (editLayout: boolean) => void
    setSelectedTimestamp: (timestamp: string | undefined) => Promise<void>
    setSelectedNode: (node: string | undefined) => void
    setContextMenu: (contextMenu: ContextMenu) => void
    setPanelViewMode: (viewMode: 'list' | 'detail') => void
    setSelectedPanel: (panel: string | undefined) => void
    setPanelDialogOpen: (open: boolean) => void
    setPanels: (panels: Panel[]) => void
    addPanel: (panel: Panel) => void
    removePanel: (id: string) => void
    updatePanel: (id: string, panel: Panel) => void
    setConnectionPopup: (connectionPopup: ConnectionPopup) => void

    setView: (view: View) => void
    setViewState: (viewState: ViewState) => void
    setSnapshots: (snapshots: ViewSnapshotStat[]) => void
    setEvents: (events: SystemEvent[]) => void
    setArgs: (args: Record<string, string>) => void
    setOriginalViewState: (viewState: ViewState) => void
    setFilteredRecords: (records: ViewRecord[]) => void

    initialize: (data: {
        view: View
        viewState: ViewState
        snapshots: ViewSnapshotStat[]
        events?: SystemEvent[]
        args: Record<string, string>
        liveMode?: boolean
        selectedTimestamp?: string
    }) => void

    updateFilteredRecords: () => void

    setFetchLogsAction: (
        fetchLogsAction: (
            from: string,
            to: string,
            source: LogSource,
            logFilter: LogFilter,
            logLevels: string[],
            limit: number,
            offset: number
        ) => Promise<any[]>
    ) => void
    fetchSources: () => Promise<LogSource[]>
    setFetchSources: (fetchSources: () => Promise<LogSource[]>) => void
    fetchLogFiltersLabelsAction: (
        from: string,
        to: string,
        source: LogSource
    ) => Promise<LogFilterLabel[]>
    setFetchLogFiltersLabelsAction: (
        fetchLogFiltersLabelsAction: (
            from: string,
            to: string,
            source: LogSource
        ) => Promise<LogFilterLabel[]>
    ) => void
    setFetchLogsVolumeAction: (
        fetchLogsVolumeAction: (
            from: string,
            to: string,
            source: LogSource,
            logFilter: LogFilter,
            logLevels: string[]
        ) => Promise<any[]>
    ) => void

    setFetchTracesAction: (
        fetchTracesAction: (
            from: string,
            to: string,
            source: TraceSource,
            traceFilter: TraceFilter,
            traceStatuses: string[],
            limit: number,
            offset: number,
            traceId?: string
        ) => Promise<any[]>
    ) => void
    fetchTraceSources: () => Promise<TraceSource[]>
    setFetchTraceSources: (fetchTraceSources: () => Promise<TraceSource[]>) => void
    fetchTraceFilterLabelsAction: (
        from: string,
        to: string,
        source: TraceSource
    ) => Promise<TraceFilterLabel[]>
    setFetchTraceFilterLabelsAction: (
        fetchTraceFilterLabelsAction: (
            from: string,
            to: string,
            source: TraceSource
        ) => Promise<TraceFilterLabel[]>
    ) => void
    setFetchTracesVolumeAction: (
        fetchTracesVolumeAction: (
            from: string,
            to: string,
            source: TraceSource,
            traceFilter: TraceFilter,
            traceStatuses: string[],
            traceId?: string
        ) => Promise<any[]>
    ) => void

    setFetchSpansAction: (
        fetchSpansAction: (traceId: string, source: TraceSource) => Promise<any[]>
    ) => void

    setAccessToken: (accessToken: string | undefined) => void
    setElementsToExplore: (elementsToExplore: string[]) => void
    setSelectedServiceDetails: (selectedServiceDetails: string) => void
    setIsServiceDrawerOpen: (isServiceDrawerOpen: boolean) => void
    setDevMode: (devMode: 'production' | 'local' | '') => void
}

export type ViewStore = ViewStoreState & ViewStoreActions

export const defaultInitState: ViewStoreState = {
    liveMode: true,
    editLayout: false,
    selectedTimestamp: undefined,
    selectedNode: undefined,
    contextMenu: {
        open: false,
        position: { x: 0, y: 0 },
        nodeId: undefined,
    },
    panelViewMode: 'list',
    selectedPanel: undefined,
    panelDialogOpen: false,
    panels: [],
    view: {} as View,
    viewState: {
        records: [] as ViewRecord[],
        edges: [] as Edge[],
        organizationId: 0,
    } as unknown as ViewState,
    snapshots: [] as ViewSnapshotStat[],
    events: [] as SystemEvent[],
    args: {} as Record<string, string>,
    originalViewState: {} as ViewState,
    filteredRecords: undefined,
    connectionPopup: {
        open: false,
        x: 0,
        y: 0,
        placement: 'top',
        rps: 0,
        errorRate: 0,
        latency: 0,
        sourceName: '',
        targetName: '',
        endpoints: {},
    },
    accessToken: undefined,
    elementsToExplore: [],
    selectedServiceDetails: '',
    isServiceDrawerOpen: false,
    devMode: '',
    fetchLogsAction: async (
        from: string,
        to: string,
        source: LogSource,
        logFilter: LogFilter,
        logLevels: string[],
        limit: number,
        offset: number
    ) => {
        throw new Error('fetchLogsAction is not set')
    },
    fetchLogsVolumeAction: async (
        from: string,
        to: string,
        source: LogSource,
        logFilter: LogFilter,
        logLevels: string[]
    ) => {
        throw new Error('fetchLogsVolumeAction is not set')
    },
    fetchTracesAction: async (
        from: string,
        to: string,
        source: TraceSource,
        traceFilter: TraceFilter,
        traceStatuses: string[],
        limit: number,
        offset: number,
        traceId?: string
    ) => {
        throw new Error('fetchTracesAction is not set')
    },
    fetchTracesVolumeAction: async (
        from: string,
        to: string,
        source: TraceSource,
        traceFilter: TraceFilter,
        traceStatuses: string[],
        traceId?: string
    ) => {
        throw new Error('fetchTracesVolumeAction is not set')
    },
    fetchSpansAction: async (traceId: string, source: TraceSource) => {
        throw new Error('fetchSpansAction is not set')
    },
}

// Create the store with persistence to localStorage
export const createViewStore = (initState: Partial<ViewStoreState> = {}) => {
    const store = createStore<ViewStore>()(
        persist(
            (set, get) => ({
                ...defaultInitState,
                ...initState,

                // UI state actions
                setLiveMode: (liveMode: boolean) => {
                    set({ liveMode })
                },
                setEditLayout: (editLayout: boolean) => {
                    set({ editLayout })
                    get().updateFilteredRecords()
                },
                setSelectedTimestamp: async (selectedTimestamp: string | undefined) => {
                    set({ selectedTimestamp })
                },
                setSelectedNode: (selectedNode: string | undefined) => {
                    set({ selectedNode })
                    // Update filtered records when node changes
                    get().updateFilteredRecords()
                },
                setContextMenu: (contextMenu: ContextMenu) => {
                    set({ contextMenu })
                },
                setPanelViewMode: (panelViewMode: 'list' | 'detail') => {
                    set({ panelViewMode })
                },
                setSelectedPanel: (selectedPanel: string | undefined) => {
                    set({ selectedPanel })
                },
                setPanelDialogOpen: (panelDialogOpen: boolean) => {
                    set({ panelDialogOpen })
                },
                setPanels: (panels: Panel[]) => {
                    set({ panels })
                },
                addPanel: (panel: Panel) => {
                    set({ panels: [...get().panels, panel] })
                },
                removePanel: (id: string) => {
                    set({
                        panels: get().panels.filter((p) => p.id !== id),
                    })
                },
                updatePanel: (id: string, panel: Panel) => {
                    set({
                        panels: get().panels.map((p) => (p.id === id ? panel : p)),
                    })
                },

                // Data actions
                setView: (view: View) => set({ view }),
                setViewState: (viewState: ViewState) => {
                    set({ viewState })
                    get().updateFilteredRecords()
                },
                setSnapshots: (snapshots: ViewSnapshotStat[]) => set({ snapshots }),
                setEvents: (events: SystemEvent[]) => set({ events }),
                setArgs: (args: Record<string, string>) => {
                    set({ args })
                },
                setOriginalViewState: (originalViewState: ViewState) => {
                    set({ originalViewState })
                    // Update filtered records when original view state changes
                    get().updateFilteredRecords()
                },
                setFilteredRecords: (filteredRecords: ViewRecord[]) => set({ filteredRecords }),

                // Initialize data
                initialize: (data) => {
                    set({
                        view: data.view,
                        viewState: data.viewState,
                        snapshots: data.snapshots,
                        events: data.events || [],
                        args: data.args,
                        originalViewState: data.viewState,
                        liveMode: true,
                        editLayout: false,
                        selectedTimestamp: data.selectedTimestamp ?? get().selectedTimestamp,
                    })

                    // Update filtered records
                    get().updateFilteredRecords()
                },

                // Helper to update filtered records based on selectedNode
                updateFilteredRecords: () => {
                    const {
                        selectedNode,
                        originalViewState,
                        snapshots,
                        liveMode,
                        selectedTimestamp,
                        editLayout,
                    } = get()

                    if (!originalViewState?.records) {
                        return
                    }

                    if (selectedNode && !editLayout) {
                        const node = originalViewState.records.find((node) => node.key === selectedNode)
                        const connectedNodes = new Set<string>()
                        const connectedNotedItems = []
                        for (const edge of originalViewState.records.filter(
                            (r) => r.component === 'connection'
                        )) {
                            const toItem = edge.layout?.find((layoutItem) => layoutItem.type === 'to')
                            const fromItem = edge.layout?.find((layoutItem) => layoutItem.type === 'from')
                            if (fromItem?.value?.data === selectedNode) {
                                connectedNodes.add(toItem?.value?.data as string)
                                connectedNotedItems.push(edge)
                            }
                            if (toItem?.value?.data === selectedNode) {
                                connectedNodes.add(fromItem?.value?.data as string)
                                connectedNotedItems.push(edge)
                            }
                        }

                        const connectedNodesList = []
                        for (const node of connectedNodes) {
                            const value = originalViewState.records.find((n) => n.key === node)
                            if (value) {
                                connectedNodesList.push(value)
                            }
                        }

                        const nodesToShow = [...connectedNodesList, node as ViewRecord, ...connectedNotedItems]

                        const parentIds = new Set<string>()
                        for (const node of nodesToShow) {
                            if (getParentId(node)) {
                                parentIds.add(getParentId(node))
                            }
                        }

                        const parentNodes = originalViewState.records.filter((node) => parentIds.has(node.key))

                        set({ filteredRecords: [...parentNodes, ...nodesToShow] })
                    } else {
                        const hiddenNodes = getHiddenNodes(originalViewState.records, get().elementsToExplore)
                        set({
                            filteredRecords: originalViewState.records.filter(
                                (node) => !hiddenNodes.includes(node)
                            ),
                        })
                    }
                },
                setConnectionPopup: (connectionPopup: ConnectionPopup) => {
                    set({ connectionPopup })
                },
                setFetchLogsAction: (
                    fetchLogsAction: (
                        from: string,
                        to: string,
                        source: LogSource,
                        logFilter: LogFilter,
                        logLevels: string[],
                        limit: number,
                        offset: number
                    ) => Promise<any[]>
                ) => {
                    set({ fetchLogsAction })
                },
                setFetchLogsVolumeAction: (
                    fetchLogsVolumeAction: (
                        from: string,
                        to: string,
                        source: LogSource,
                        logFilter: LogFilter,
                        logLevels: string[]
                    ) => Promise<any[]>
                ) => {
                    set({ fetchLogsVolumeAction })
                },
                setFetchTracesAction: (
                    fetchTracesAction: (
                        from: string,
                        to: string,
                        source: TraceSource,
                        traceFilter: TraceFilter,
                        traceStatuses: string[],
                        limit: number,
                        offset: number,
                        traceId?: string
                    ) => Promise<any[]>
                ) => {
                    set({ fetchTracesAction })
                },
                setFetchTracesVolumeAction: (
                    fetchTracesVolumeAction: (
                        from: string,
                        to: string,
                        source: TraceSource,
                        traceFilter: TraceFilter,
                        traceStatuses: string[],
                        traceId?: string
                    ) => Promise<any[]>
                ) => {
                    set({ fetchTracesVolumeAction })
                },
                setFetchSpansAction: (
                    fetchSpansAction: (traceId: string, source: TraceSource) => Promise<any[]>
                ) => {
                    set({ fetchSpansAction })
                },
                setAccessToken: (accessToken: string | undefined) => {
                    set({ accessToken })
                },
                fetchSources: async () => [],
                setFetchSources: (fetchSources: () => Promise<LogSource[]>) => {
                    set({ fetchSources })
                },
                fetchLogFiltersLabelsAction: async (from: string, to: string, source: LogSource) => [],
                setFetchLogFiltersLabelsAction: (
                    fetchLogFiltersLabelsAction: (
                        from: string,
                        to: string,
                        source: LogSource
                    ) => Promise<LogFilterLabel[]>
                ) => {
                    set({ fetchLogFiltersLabelsAction })
                },
                fetchTraceSources: async () => [],
                setFetchTraceSources: (fetchTraceSources: () => Promise<TraceSource[]>) => {
                    set({ fetchTraceSources })
                },
                fetchTraceFilterLabelsAction: async (from: string, to: string, source: TraceSource) => [],
                setFetchTraceFilterLabelsAction: (
                    fetchTraceFilterLabelsAction: (
                        from: string,
                        to: string,
                        source: TraceSource
                    ) => Promise<TraceFilterLabel[]>
                ) => {
                    set({ fetchTraceFilterLabelsAction })
                },
                setElementsToExplore: (elementsToExplore: string[]) => {
                    set({ elementsToExplore })
                    get().updateFilteredRecords()
                },
                setSelectedServiceDetails: (selectedServiceDetails: string) => {
                    set({ selectedServiceDetails })
                },
                setIsServiceDrawerOpen: (isServiceDrawerOpen: boolean) => {
                    set({ isServiceDrawerOpen })
                },
                setDevMode: (devMode: 'production' | 'local' | '') => {
                    set({ devMode })
                },
                fetchSpansAction: async (traceId: string, source: TraceSource) => {
                    throw new Error('fetchSpansAction is not set')
                },
            }),
            {
                name: 'view-store',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    liveMode: state.liveMode,
                    selectedNode: state.selectedNode,
                    selectedTimestamp: state.selectedTimestamp,
                    panelViewMode: state.panelViewMode,
                    selectedPanel: state.selectedPanel,
                    panelDialogOpen: state.panelDialogOpen,
                    panels: state.panels,
                    args: state.args,
                    devMode: state.devMode,
                }),
            }
        )
    )

    // Initialize filtered records on store creation
    store.getState().updateFilteredRecords()

    return store
}

// Create a singleton instance
export const viewStore = createViewStore()
