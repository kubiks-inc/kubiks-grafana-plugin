import React from 'react'
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type ViewStore, createViewStore } from '@/store/viewStore'

export type ViewStoreApi = ReturnType<typeof createViewStore>

export const ViewStoreContext = createContext<ViewStoreApi | undefined>(undefined)

export interface ViewStoreProviderProps {
    children?: ReactNode
}

export const ViewStoreProvider = ({
    children,
}: ViewStoreProviderProps) => {
    const storeRef = useRef<ViewStoreApi>()

    if (!storeRef.current) {
        const initialState = {
            args: {},
            filteredRecords: [],
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
