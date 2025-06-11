import React from 'react'
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type ViewStore, createViewStore } from '@/store/viewStore'
import { View } from '@/lib/model/view'
import { ViewSnapshotStat } from '@/lib/api/model/view-snapshot'
import { ViewRecord } from '@/lib/api/model/record'
import { ViewState } from '@/lib/api/model/view-state'
import { SystemEvent } from '@/lib/api/model/event'
import { LogSource } from '@/lib/api/model/log-source'

export type ViewStoreApi = ReturnType<typeof createViewStore>

export const ViewStoreContext = createContext<ViewStoreApi | undefined>(undefined)

export interface ViewStoreProviderProps {
    children?: ReactNode
    view?: View
    snapshots?: ViewSnapshotStat[]
    data?: ViewState
    events?: SystemEvent[]
    logSources?: LogSource[]
}

export const ViewStoreProvider = ({
    children,
    view,
    snapshots,
    data,
    events,
    logSources,
}: ViewStoreProviderProps) => {
    const storeRef = useRef<ViewStoreApi>()

    if (!storeRef.current) {
        const initialState = {
            view: view,
            viewState: data,
            snapshots: snapshots,
            events: events,
            logSources: logSources,
            args: {},
            originalViewState: data,
            filteredRecords: data?.records,
            liveMode: true,
            isServiceDrawerOpen: false,
        }

        storeRef.current = createViewStore(initialState)
    }

    return <ViewStoreContext.Provider value={storeRef.current}>{children}</ViewStoreContext.Provider>
}

export const useViewStore = <T,>(selector: (store: ViewStore) => T): T => {
    const viewStoreContext = useContext(ViewStoreContext)

    if (!viewStoreContext) {
        throw new Error(`useViewStore must be used within ViewStoreProvider`)
    }

    return useStore(viewStoreContext, selector)
}
