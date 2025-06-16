import { Node } from '@xyflow/react'

import { ViewRecord } from '@/lib/model/record'
import { LayoutItem } from '@/lib/model/view'
import { getParentId } from '@/components/Canvas/helpers'

export function createNodesAndEdges(
  organizationId: string,
  records: ViewRecord[],
  draggable: boolean,
  positions: { [key: string]: { x: number; y: number } },
  elementsToExplore: string[]
): { nodes: Node[]; edges: EdgeData[] } {
  const nodes: Node[] = []

  // Function to get a consistent, subtle style for all groups
  const getGroupStyle = () => {
    // Single subtle style for all groups
    return {
      backgroundColor: 'rgba(28, 28, 32, 0.7)',
      borderColor: 'rgba(45, 45, 50, 0.3)',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
    }
  }

  const unique = records.filter(
    (record, index, self) => index === self.findIndex((t) => t.key === record.key)
  )

  unique.forEach((record) => {
    if (
      record.component === 'group_component' ||
      (record.component === 'element' && elementsToExplore.includes(record.key))
    ) {
      const groupId = record.key
      const groupStyle = getGroupStyle()

      const groupNode: Node = {
        id: record.key,
        type: 'group',
        data: {
          ...record,
          order: record.order,
        },
        parentId: getParentId(record) || record.parentId,
        position: positions[record.key] || { x: 0, y: 0 },
        style: {
          backgroundColor: groupStyle.backgroundColor,
          borderRadius: '12px',
          border: `0.5px solid ${groupStyle.borderColor}`,
          padding: '24px',
          opacity: 0.8,
          boxShadow: `0 4px 8px ${groupStyle.shadowColor}`,
        },
        draggable: draggable,
        selectable: false,
      }

      const groupLabels = getGroupLabels(record, 0, 0, groupId)
      nodes.push(...groupLabels)

      nodes.push(groupNode)
    } else if (record.component === 'element') {
      const element: Node = {
        id: record.key,
        type: record.component,
        position: positions[record.key] || { x: 0, y: 0 },
        parentId: getParentId(record) || record.parentId,
        data: {
          ...record,
          organizationId: organizationId,
        },
        draggable: false,
        selectable: true,
        style: {
          zIndex: 1000,
          backgroundColor: 'rgba(38, 38, 42, 0.95)',
          borderRadius: '10px',
          border: '0.5px solid rgba(70, 70, 75, 0.5)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
        },
      }
      nodes.push(element)
    }
  })

  let edges = createEdgesFromLayout(unique).filter(
    (edge) =>
      nodes.find((node) => node.id === edge.source) && nodes.find((node) => node.id === edge.target)
  )

  // Sort nodes so that group nodes come first
  const sortedNodes = [
    ...nodes.filter((node) => node.type === 'group'),
    ...nodes.filter((node) => node.type !== 'group'),
  ]

  return { nodes: sortedNodes || [], edges }
}

interface Connection {
  [key: string]: any
}

interface EdgeData {
  id: string
  source: string
  target: string
  type: string
  data: Connection
  // Add required properties from Edge type
  sourceHandle?: string | null
  targetHandle?: string | null
  // Make data a Record<string, unknown> as required by Edge type
  [key: string]: any
}

function getTitle(record: LayoutItem[]): string {
  const titleItem = record?.find((item) => item.type === 'title')
  return titleItem?.value?.data as string
}

function createEdgesFromLayout(records: ViewRecord[]): EdgeData[] {
  // Create a map of node IDs to their names for quick lookup
  const nodeNameMap: Record<string, string> = {}
  records
    .filter((r) => r.component === 'element' || r.component === 'group_component')
    .forEach((record) => {
      // Get display name from the record (type, component name, or ID)
      nodeNameMap[record.key] = getTitle(record.layout as LayoutItem[])
    })

  return records
    .filter((r) => r.component == 'connection')
    .map((item) => {
      // Find the 'to' and 'from' values in the layout array
      const toItem = item.layout?.find((layoutItem) => layoutItem.type === 'to')
      const fromItem = item.layout?.find((layoutItem) => layoutItem.type === 'from')

      // Extract the values or use fallbacks if layout items aren't found
      const to = toItem?.value?.data || ''
      const from = fromItem?.value?.data || ''

      // Get source and target names from our map
      const sourceName = nodeNameMap[from] || 'Unknown Service'
      const targetName = nodeNameMap[to] || 'Unknown Service'

      // Create edge with all required properties for React Flow
      return {
        id: item.key,
        source: from,
        target: to,
        type: 'highlighted',
        data: {
          ...item,
          sourceName,
          targetName,
        },
        sourceHandle: null,
        targetHandle: null,
        // Add these properties to ensure compatibility with Edge type
        animated: false,
        selected: false,
        updatable: true,
        zIndex: 10,
      }
    })
}

function getGroupLabels(record: ViewRecord, x: number, y: number, parentId: string): Node[] {
  const namespaceLabel: Node = {
    id: record.key + '-label',
    type: 'node_label',
    data: { record },
    position: { x: x + 10, y: y + 10 },
    draggable: false,
    selectable: false,
    parentId: parentId,
  }

  return [namespaceLabel]
}
