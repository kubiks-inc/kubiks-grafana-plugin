import * as dagre from 'dagre'
import { Edge, Node, Position } from '@xyflow/react'
import { isHiddenBeDefault, getParentIdFromLayout } from './helpers'
import { LayoutItem } from '@/lib/api/model/view'

// Define layout configuration interface
export interface LayoutConfig {
  nodeSpacing: number
  direction: 'RIGHT' | 'DOWN' | 'LEFT' | 'UP'
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
}

// Add CSS transitions for smoother node movement
export function addTransitionsToNodes(nodes: Node[]): Node[] {
  return nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      transition: 'all 300ms ease-in-out',
    },
  }))
}

// Helper function to layout children in a simple grid within a group
function layoutChildrenInGrid(
  children: Node[],
  groupPosition: { x: number; y: number },
  groupSize: { width: number; height: number }
): Node[] {
  if (children.length === 0) return []

  const padding = 40
  const nodeSpacing = 20
  const availableWidth = groupSize.width - padding * 2
  const availableHeight = groupSize.height - padding * 2

  // Calculate grid dimensions
  const cols = Math.max(1, Math.ceil(Math.sqrt(children.length)))
  const rows = Math.max(1, Math.ceil(children.length / cols))

  // Calculate cell size
  const cellWidth = availableWidth / cols
  const cellHeight = availableHeight / rows

  return children.map((child, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)

    // Calculate position within the group
    const nodeWidth = child.type === 'element' ? child.measured?.width || 200 : 100
    const nodeHeight = child.type === 'element' ? child.measured?.height || 100 : 50

    // Center the node within its grid cell
    const x = padding + col * cellWidth + (cellWidth - nodeWidth) / 2
    const y = padding + row * cellHeight + (cellHeight - nodeHeight) / 2

    return {
      ...child,
      position: { x, y },
      style: {
        ...child.style,
        transition: 'all 300ms ease-in-out',
      },
      draggable: false,
    }
  })
}

// Helper function to calculate group size based on its children
function calculateGroupSize(children: Node[]): { width: number; height: number } {
  if (children.length === 0) {
    return { width: 300, height: 200 }
  }

  const padding = 40
  const nodeSpacing = 20

  // Calculate grid dimensions
  const cols = Math.max(1, Math.ceil(Math.sqrt(children.length)))
  const rows = Math.max(1, Math.ceil(children.length / cols))

  // Get max child dimensions
  let maxChildWidth = 200
  let maxChildHeight = 100

  children.forEach((child) => {
    const width = child.type === 'element' ? child.measured?.width || 200 : 100
    const height = child.type === 'element' ? child.measured?.height || 100 : 50
    maxChildWidth = Math.max(maxChildWidth, width)
    maxChildHeight = Math.max(maxChildHeight, height)
  })

  // Calculate total size needed
  const totalWidth = cols * (maxChildWidth + nodeSpacing) - nodeSpacing + padding * 2
  const totalHeight = rows * (maxChildHeight + nodeSpacing) - nodeSpacing + padding * 2

  return {
    width: Math.max(300, totalWidth),
    height: Math.max(200, totalHeight),
  }
}

export const layoutElements = async (
  nodes: Node[],
  edges: Edge[],
  positions: { [key: string]: { x: number; y: number } }
) => {
  const dagreGraph = new dagre.graphlib.Graph()
  const nodeWidth = 200
  const nodeHeight = 100

  dagreGraph.setGraph({
    rankdir: 'LR',
    nodesep: 500, // Horizontal spacing between nodes
    ranksep: 500, // Vertical spacing between ranks
    edgesep: 500, // Minimum spacing between edges
  })
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const groupNodes = nodes.filter((node) => node.type === 'group' || node.data?.isGroup)
  const elementNodes = nodes.filter((node) => node.type === 'element' && !node.parentId)
  const childNodes = nodes.filter((node) => node.type === 'element' && node.parentId)
  const labelNodes = nodes.filter((node) => node.type === 'node_label')
  const otherNodes = nodes.filter(
    (node) => node.type && !['group', 'element', 'node_label'].includes(node.type)
  )

  // Create mapping of group children
  const groupChildren = new Map<string, Node[]>()
  childNodes.forEach((child) => {
    if (child.parentId) {
      if (!groupChildren.has(child.parentId)) {
        groupChildren.set(child.parentId, [])
      }
      groupChildren.get(child.parentId)!.push(child)
    }
  })

  // Calculate group sizes based on their children
  const groupSizes = new Map<string, { width: number; height: number }>()
  groupNodes.forEach((group) => {
    const children = groupChildren.get(group.id) || []
    const size = calculateGroupSize(children)
    groupSizes.set(group.id, size)
  })

  // Create simplified edges for the tree layout (replace child connections with group connections)
  const simplifiedEdges = edges.map((edge) => {
    let sourceId = edge.source
    let targetId = edge.target

    // If source is a child node, replace with its group
    const sourceChild = childNodes.find((child) => child.id === edge.source)
    if (sourceChild && sourceChild.parentId) {
      sourceId = sourceChild.parentId
    }

    // If target is a child node, replace with its group
    const targetChild = childNodes.find((child) => child.id === edge.target)
    if (targetChild && targetChild.parentId) {
      targetId = targetChild.parentId
    }

    return { ...edge, source: sourceId, target: targetId }
  })

  // Remove duplicate edges (multiple children connecting to same external node)
  const uniqueEdges = simplifiedEdges.filter(
    (edge, index, self) =>
      index === self.findIndex((e) => e.source === edge.source && e.target === edge.target)
  )

  // Add nodes to the dagre graph (groups and standalone elements only)
  const nodesToAddToGraph = groupNodes.concat(elementNodes).concat(otherNodes)
  nodesToAddToGraph.forEach((node) => {
    let width = nodeWidth / 2
    let height = nodeHeight / 2

    if (node.type === 'element') {
      width = node.measured?.width || nodeWidth
      height = node.measured?.height || nodeHeight
    } else if (node.type === 'group' || node.data?.isGroup) {
      // Use calculated group size
      const size = groupSizes.get(node.id)
      if (size) {
        width = size.width
        height = size.height
      }
    }

    dagreGraph.setNode(node.id, { width, height })
  })

  // Add simplified edges to the graph
  uniqueEdges.forEach((edge) => {
    // Only add edge if both nodes exist in the graph
    if (dagreGraph.hasNode(edge.source) && dagreGraph.hasNode(edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target)
    }
  })

  // Calculate the layout
  dagre.layout(dagreGraph)

  // Update node positions based on the layout result
  const resultNodes: Node[] = []

  // Position groups and standalone elements
  const nodesToPosition = groupNodes.concat(elementNodes).concat(otherNodes)
  nodesToPosition.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    if (nodeWithPosition) {
      let width = nodeWidth / 2
      let height = nodeHeight / 2

      if (node.type === 'element') {
        width = node.measured?.width || nodeWidth
        height = node.measured?.height || nodeHeight
      } else if (node.type === 'group' || node.data?.isGroup) {
        const size = groupSizes.get(node.id)
        if (size) {
          width = size.width
          height = size.height
        }
      }

      const updatedNode = {
        ...node,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        position: positions[node.id] || {
          x: nodeWithPosition.x - width / 2,
          y: nodeWithPosition.y - height / 2,
        },
        style: {
          ...node.style,
          transition: 'all 300ms ease-in-out',
          ...(node.type === 'group' || node.data?.isGroup
            ? {
              width,
              height,
            }
            : {}),
        },
        draggable: false,
      }

      resultNodes.push(updatedNode)

      // Layout children within the group
      if (node.type === 'group' || node.data?.isGroup) {
        const children = groupChildren.get(node.id) || []
        const groupSize = groupSizes.get(node.id) || { width, height }
        const layoutedChildren = layoutChildrenInGrid(children, updatedNode.position, groupSize)
        resultNodes.push(...layoutedChildren)
      }
    }
  })

  // Position group labels at the top left corner of their parent groups
  labelNodes.forEach((labelNode) => {
    if (labelNode.parentId) {
      const parentGroup = resultNodes.find((node) => node.id === labelNode.parentId)
      if (parentGroup) {
        // Position label at top left corner of the group with small padding
        const updatedLabel = {
          ...labelNode,
          position: {
            x: 10, // Fixed 10px from left edge of group
            y: 10, // Fixed 10px from top edge of group
          },
          style: {
            ...labelNode.style,
            transition: 'all 300ms ease-in-out',
            zIndex: 1001, // Ensure label appears above group content
          },
          draggable: false,
        }
        resultNodes.push(updatedLabel)
      }
    } else {
      // If label has no parent, keep it as is
      resultNodes.push({
        ...labelNode,
        style: {
          ...labelNode.style,
          transition: 'all 300ms ease-in-out',
        },
        draggable: false,
      })
    }
  })

  // Add any nodes that weren't processed (but only if they're visible)
  nodes.forEach((originalNode) => {
    if (!resultNodes.find((n) => n.id === originalNode.id)) {
      resultNodes.push({
        ...originalNode,
        style: {
          ...originalNode.style,
          transition: 'all 300ms ease-in-out',
        },
        draggable: false,
      })
    }
  })

  return resultNodes
}
