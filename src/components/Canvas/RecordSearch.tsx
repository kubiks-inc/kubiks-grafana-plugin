import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { Modal, Input, useStyles2, Icon } from '@grafana/ui'
import { ViewRecord } from '@/lib/api/model/record'
import { useViewStore } from '@/store/ViewStoreProvider'
import { getIconUrlWithFallback } from '@/utils/iconMapper'
import { Server } from 'lucide-react'

interface RecordSearchProps {
    open: boolean
    setOpen: (open: boolean) => void
}

interface LayoutItem {
    type: string
    value?: {
        data?: any
    }
}

// Function to extract title from layout items
export function getTitle(layoutItems: LayoutItem[]): string {
    const titleItem = layoutItems?.find((item) => item.type === 'title')
    return titleItem?.value?.data as string
}

export function RecordSearch({ open, setOpen }: RecordSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { originalViewState, setSelectedNode } = useViewStore((state) => state)
    const s = useStyles2(getStyles)

    // Group records by type
    const groupedRecords = useMemo(() => {
        if (!originalViewState?.records?.length) return {}

        // Create a set to track unique record identifiers
        // This ensures each record appears only once in the search results,
        // even if it exists multiple times in the original data
        const uniqueRecordIds = new Set<string | number>()

        // Helper function to determine if a record is unique
        const isUniqueRecord = (record: ViewRecord) => {
            if (uniqueRecordIds.has(record.key)) {
                return false
            }
            uniqueRecordIds.add(record.key)
            return true
        }

        // Group records by their type
        const grouped: Record<string, ViewRecord[]> = {}
        originalViewState.records
            .filter(isUniqueRecord) // Filter out duplicates
            .filter((record: ViewRecord) => record.component == 'element_component')
            .forEach((record: ViewRecord) => {
                const recordType = record.type
                if (!grouped[recordType]) {
                    grouped[recordType] = []
                }
                grouped[recordType].push(record)
            })
        return grouped
    }, [originalViewState])

    // Handle keyboard shortcut (cmd/ctrl + k)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if focus is on an input, textarea or other editable element
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                return
            }

            // Cmd/Ctrl + K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                e.preventDefault()
                // Only open if it's not already open
                if (!open) {
                    setOpen(true)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, setOpen])

    // Handle record selection
    const handleSelectRecord = (record: ViewRecord) => {
        setOpen(false)
        setSelectedNode(record.key)
    }

    // Get icon for record
    const getRecordIcon = (record: ViewRecord) => {
        if (record.icon) {
            return (
                <img
                    src={getIconUrlWithFallback(record.icon)}
                    alt={record.key}
                    width={16}
                    height={16}
                    className={s.recordIconImage}
                />
            )
        }

        return <Server className="h-4 w-4 mr-2 text-muted-foreground" />
    }

    // Format record name for display
    const getRecordDisplayName = (record: ViewRecord) => {
        return getTitle(record.layout) || record.key
    }

    // Helper function to check if a record matches the search query
    const recordMatchesSearch = useCallback(
        (record: ViewRecord): boolean => {
            if (!searchQuery) return true

            const displayName = getRecordDisplayName(record)
            const recordId = String(record.id || '')
            const recordKey = String(record.key || '')
            const recordType = String(record.type || '')

            const query = searchQuery.toLowerCase()

            return (
                recordId.toLowerCase().includes(query) ||
                recordKey.toLowerCase().includes(query) ||
                recordType.toLowerCase().includes(query) ||
                displayName.toLowerCase().includes(query)
            )
        },
        [searchQuery]
    )

    // Filter group names based on search query
    const filteredGroups = useMemo(() => {
        const groups = Object.keys(groupedRecords)
        if (!searchQuery) return groups

        return groups.filter(
            (group) =>
                // Include if group name matches search
                group.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // OR if any records in the group match the search
                groupedRecords[group].some(recordMatchesSearch)
        )
    }, [groupedRecords, searchQuery, recordMatchesSearch])

    // Get all matching records in order
    const allMatchingRecords = useMemo(() => {
        const records: ViewRecord[] = []
        filteredGroups.forEach((group) => {
            const matchingRecords = groupedRecords[group]
                .filter(recordMatchesSearch)
                .sort((a, b) => {
                    // Get the display names for sorting
                    const nameA = getRecordDisplayName(a)
                    const nameB = getRecordDisplayName(b)

                    // First, prioritize records with real names (not just IDs)
                    const isIdA = nameA === String(a.id)
                    const isIdB = nameB === String(b.id)
                    if (isIdA && !isIdB) return 1
                    if (!isIdA && isIdB) return -1

                    // If records are in the same namespace, keep them together
                    if (
                        a.value &&
                        b.value &&
                        typeof a.value === 'object' &&
                        typeof b.value === 'object' &&
                        (a.value as any).metadata?.namespace &&
                        (b.value as any).metadata?.namespace
                    ) {
                        const nsA = (a.value as any).metadata.namespace
                        const nsB = (b.value as any).metadata.namespace
                        if (nsA !== nsB) {
                            return nsA.localeCompare(nsB)
                        }
                    }

                    // Finally sort by name
                    return nameA.localeCompare(nameB)
                })
            records.push(...matchingRecords)
        })
        return records
    }, [filteredGroups, groupedRecords, recordMatchesSearch])

    // Handle keyboard navigation
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex((prev) => Math.min(prev + 1, allMatchingRecords.length - 1))
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex((prev) => Math.max(prev - 1, 0))
            } else if (e.key === 'Enter') {
                e.preventDefault()
                if (allMatchingRecords[selectedIndex]) {
                    handleSelectRecord(allMatchingRecords[selectedIndex])
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, selectedIndex, allMatchingRecords])

    // Reset selected index when search changes
    useEffect(() => {
        setSelectedIndex(0)
    }, [searchQuery])

    // Count total records that match search
    const matchingRecordsCount = allMatchingRecords.length

    return (
        <Modal
            title="Search Records"
            isOpen={open}
            onDismiss={() => setOpen(false)}
            className={s.modal}
        >
            <div className={s.container}>
                <div className={s.searchContainer}>
                    <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                        className={s.searchInput}
                        autoFocus
                        prefix={<Icon name="search" />}
                    />
                </div>

                {/* Navigation hints and record count */}
                <div className={s.hints}>
                    <div className={s.navHints}>
                        <span className={s.hintText}>
                            Use <kbd className={s.kbd}>↑</kbd>
                            <kbd className={s.kbd}>↓</kbd> to navigate •{' '}
                            <kbd className={s.kbd}>Enter</kbd> to select
                        </span>
                    </div>
                    <div className={s.recordCount}>
                        <span className={s.hintText}>{matchingRecordsCount} records found</span>
                    </div>
                </div>

                <div className={s.resultsContainer}>
                    {matchingRecordsCount === 0 && (
                        <div className={s.emptyState}>
                            <p>No records found.</p>
                            <p className={s.emptySubtext}>Try adjusting your search terms.</p>
                        </div>
                    )}

                    {filteredGroups.map((group, groupIndex) => {
                        // Get records in this group that match the search
                        const matchingRecords = groupedRecords[group].filter(recordMatchesSearch)

                        // Skip this group if no records match
                        if (matchingRecords.length === 0) return null

                        return (
                            <div key={`group-${group}`} className={s.group}>
                                {groupIndex > 0 && <div className={s.separator} />}
                                <div className={s.groupHeader}>
                                    <Icon name="folder" className={s.groupIcon} />
                                    <span className={s.groupTitle}>{group}</span>
                                </div>

                                <div className={s.recordsList}>
                                    {matchingRecords
                                        .sort((a, b) => {
                                            // Same sorting logic as before
                                            const nameA = getRecordDisplayName(a)
                                            const nameB = getRecordDisplayName(b)

                                            const isIdA = nameA === String(a.id)
                                            const isIdB = nameB === String(b.id)
                                            if (isIdA && !isIdB) return 1
                                            if (!isIdA && isIdB) return -1

                                            if (
                                                a.value &&
                                                b.value &&
                                                typeof a.value === 'object' &&
                                                typeof b.value === 'object' &&
                                                (a.value as any).metadata?.namespace &&
                                                (b.value as any).metadata?.namespace
                                            ) {
                                                const nsA = (a.value as any).metadata.namespace
                                                const nsB = (b.value as any).metadata.namespace
                                                if (nsA !== nsB) {
                                                    return nsA.localeCompare(nsB)
                                                }
                                            }

                                            return nameA.localeCompare(nameB)
                                        })
                                        .map((record, recordIndex) => {
                                            const globalIndex = allMatchingRecords.indexOf(record)
                                            const isSelected = globalIndex === selectedIndex
                                            const displayName = getRecordDisplayName(record)

                                            return (
                                                <div
                                                    key={`record-${record.id}`}
                                                    className={`${s.recordItem} ${isSelected ? s.recordItemSelected : ''}`}
                                                    onClick={() => handleSelectRecord(record)}
                                                    title={displayName}
                                                >
                                                    <div className={s.recordIcon}>
                                                        {getRecordIcon(record)}
                                                    </div>
                                                    <div className={s.recordContent}>
                                                        <span className={s.recordName}>{displayName}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <div className={s.selectedBadge}>
                                                            <span className={s.selectedText}>Selected</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>
    )
}

const getStyles = (theme: GrafanaTheme2) => ({
    modal: css`
        .react-modal__content {
            max-width: 600px;
            max-height: 80vh;
        }
    `,
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 60vh;
    `,
    searchContainer: css`
        padding: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.medium};
    `,
    searchInput: css`
        width: 100%;
    `,
    hints: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.medium};
        background: ${theme.colors.background.secondary};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    navHints: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(0.5)};
    `,
    recordCount: css`
        display: flex;
        align-items: center;
    `,
    hintText: css`
        color: ${theme.colors.text.secondary};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    kbd: css`
        padding: ${theme.spacing(0.25)} ${theme.spacing(0.5)};
        background: ${theme.colors.background.canvas};
        border: 1px solid ${theme.colors.border.medium};
        border-radius: ${theme.shape.radius.default};
        font-size: 10px;
        margin: 0 ${theme.spacing(0.25)};
    `,
    resultsContainer: css`
        flex: 1;
        overflow-y: auto;
        padding: ${theme.spacing(1)};
    `,
    emptyState: css`
        padding: ${theme.spacing(3)};
        text-align: center;
        color: ${theme.colors.text.secondary};
    `,
    emptySubtext: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.disabled};
        margin-top: ${theme.spacing(0.5)};
    `,
    group: css`
        margin-bottom: ${theme.spacing(1)};
    `,
    separator: css`
        height: 1px;
        background: ${theme.colors.border.medium};
        margin: ${theme.spacing(1)} 0;
    `,
    groupHeader: css`
        display: flex;
        align-items: center;
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        background: ${theme.colors.background.secondary};
        border-radius: ${theme.shape.radius.default};
        margin-bottom: ${theme.spacing(0.5)};
    `,
    groupIcon: css`
        margin-right: ${theme.spacing(1)};
        color: ${theme.colors.text.secondary};
    `,
    groupTitle: css`
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
    `,
    recordsList: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(0.25)};
    `,
    recordItem: css`
        display: flex;
        align-items: center;
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        border-radius: ${theme.shape.radius.default};
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background: ${theme.colors.action.hover};
        }
    `,
    recordItemSelected: css`
        background: ${theme.colors.action.selected};
        color: ${theme.colors.text.primary};
    `,
    recordIcon: css`
        margin-right: ${theme.spacing(1)};
        display: flex;
        align-items: center;
    `,
    recordIconImage: css`
        display: block;
        object-fit: contain;
    `,
    recordContent: css`
        flex: 1;
        display: flex;
        flex-direction: column;
    `,
    recordName: css`
        font-weight: ${theme.typography.fontWeightMedium};
    `,
    selectedBadge: css`
        margin-left: auto;
    `,
    selectedText: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        background: ${theme.colors.action.selected};
        color: ${theme.colors.text.primary};
        padding: ${theme.spacing(0.25)} ${theme.spacing(0.75)};
        border-radius: ${theme.shape.radius.default};
    `,
})
