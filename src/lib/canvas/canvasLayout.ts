import * as d3 from 'd3-force'
import { Edge, Node } from '@xyflow/react'

// Add a pseudorandom number generator with a fixed seed
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Define layout configuration interface
export interface LayoutConfig {
  nodeSpacing: number
  directionX: number
  directionY: number
  forceStrength: number
  iterations: number
  seed?: number // Add seed for deterministic layout
}

// Extend d3 SimulationNodeDatum to include our custom properties
interface D3Node extends d3.SimulationNodeDatum {
  id: string
  originalNode: Node
  width: number
  height: number
  isParent?: boolean
  parentId?: string
}

// Define link interface for d3-force
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  id?: string
  isHierarchical?: boolean
  source: string | D3Node
  target: string | D3Node
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

export const layoutElements = async (
  nodes: Node[],
  edges: Edge[],
  positions: { [key: string]: { x: number; y: number } }
) => {
  const defaultConfig: LayoutConfig = {
    nodeSpacing: 200,
    directionX: 1,
    directionY: 1,
    forceStrength: 0.8,
    iterations: 500,
    seed: 42, // Default seed for deterministic behavior
  }

  const allNodesMeasured = nodes.every(
    (node) =>
      (node.type === 'element' && node.measured?.width && node.measured?.height) ||
      node.type !== 'element'
  )

  // If not all nodes are measured, return null
  if (!allNodesMeasured) {
    return null
  }

  const layoutConfig = { ...defaultConfig }
  const seed = layoutConfig.seed || 42
  const random = mulberry32(seed)

  // Get all nodes and organize them by their parent-child relationships
  const allNodes = nodes
  // Exclude label nodes from layout calculation
  const nodesToLayout = allNodes.filter((node) => node.type !== 'node_label')
  const labelNodes = allNodes.filter((node) => node.type === 'node_label')

  // Create a map of parent nodes to their children
  const groupNodes = nodesToLayout.filter((node) => node.type === 'group')
  const topLevelNodes = nodesToLayout.filter((node) => !node.parentId && node.type !== 'group')

  // Group nodes by their parentId
  const nodesByParentId = new Map<string, Node[]>()
  nodesByParentId.set('', topLevelNodes) // Using empty string instead of null for top-level nodes

  // Group children by their parent
  nodesToLayout
    .filter((node) => node.parentId)
    .forEach((node) => {
      if (!nodesByParentId.has(node.parentId!)) {
        nodesByParentId.set(node.parentId!, [])
      }
      nodesByParentId.get(node.parentId!)!.push(node)
    })

  // Process and position nodes group by group
  const processedNodes: Node[] = []
  const groupDimensions = new Map<string, { width: number; height: number }>()

  // First, process the top-level nodes (without a parent)
  const topLevelProcessedNodes = layoutNodesInGroup(
    '',
    nodesByParentId.get('') || [],
    edges,
    layoutConfig,
    random
  )
  processedNodes.push(...topLevelProcessedNodes)

  // Process each group separately
  for (const group of groupNodes) {
    const groupChildren = nodesByParentId.get(group.id) || []

    // Apply layout to children within this group
    const layoutedChildren = layoutNodesInGroup(
      group.id,
      groupChildren,
      edges,
      layoutConfig,
      random
    )

    // Calculate group dimensions based on children positions
    const { width, height } = calculateGroupDimensions(layoutedChildren)

    // Add padding for the group
    const groupPadding = 80
    const groupWidth = width + groupPadding * 2 + 64 * 2 // Additional 64px on each side for internal padding
    const groupHeight = height + groupPadding * 2 + 64 * 2 // Additional 64px on top and bottom for internal padding

    // Store group dimensions for later use in positioning
    groupDimensions.set(group.id, {
      width: groupWidth,
      height: groupHeight,
    })

    // Update the group node with the calculated dimensions
    const updatedGroup = {
      ...group,
      style: {
        ...group.style,
        width: groupWidth,
        height: groupHeight,
        backgroundColor: 'rgba(28, 28, 32, 0.7)',
        border: '1px solid rgba(45, 45, 50, 1)',
        borderRadius: '16px',
        padding: '40px',
        paddingLeft: '60px',
        paddingTop: '60px',
        opacity: 0.95,
        zIndex: 0,
        transition: 'all 300ms ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      },
      className: 'hide-placeholder-content',
    }

    processedNodes.push(updatedGroup)

    // Add the positioned children to the result
    processedNodes.push(...layoutedChildren)
  }

  // Position groups in a single row
  const positionedGroups = positionGroupsInRow(groupNodes, groupDimensions)

  // Update the positions of the group nodes in the result
  const resultNodes = processedNodes.map((node) => {
    if (node.type === 'group') {
      const position = positionedGroups.get(node.id)
      if (position) {
        return {
          ...node,
          position: positions[node.id] || position,
        }
      }
    }

    // For label nodes, just add them as is
    if (node.type === 'node_label') {
      return node
    }

    return node
  })

  // Add label nodes back
  resultNodes.push(...labelNodes)

  return resultNodes
}

// Helper function to layout nodes within a group
function layoutNodesInGroup(
  parentId: string,
  groupNodes: Node[],
  allEdges: Edge[],
  layoutConfig: LayoutConfig,
  random: () => number
): Node[] {
  if (groupNodes.length === 0) {
    return []
  }

  // Filter edges that connect nodes within this group
  const groupEdges = allEdges.filter((edge) => {
    const sourceInGroup = groupNodes.some((node) => node.id === edge.source)
    const targetInGroup = groupNodes.some((node) => node.id === edge.target)
    return sourceInGroup && targetInGroup
  })

  // Create simulation nodes and links for d3-force
  const simulationNodes: D3Node[] = []
  const simulationLinks: D3Link[] = []

  // Add nodes to simulation
  groupNodes.forEach((node) => {
    // Generate deterministic coordinates based on node ID
    const hash = node.id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    // Use the hash to seed the random generator
    const nodeRandom = mulberry32(Math.abs(hash + (layoutConfig.seed || 42)))

    // Generate positions in a circle or grid pattern
    const angle = nodeRandom() * 2 * Math.PI
    const radius = 100 + nodeRandom() * 200
    const initialX = Math.cos(angle) * radius
    const initialY = Math.sin(angle) * radius

    simulationNodes.push({
      id: node.id,
      originalNode: node,
      x: initialX,
      y: initialY,
      width: node.type === 'element' ? node.measured?.width || 200 : 800,
      height: node.type === 'element' ? node.measured?.height || 100 : 500,
      parentId: node.parentId,
    })
  })

  groupEdges.forEach((edge) => {
    simulationLinks.push({
      source: edge.source,
      target: edge.target,
      id: edge.id,
    })
  })

  // Filter connections to only include valid nodes in this group
  const filteredConnections = simulationLinks.filter((link) => {
    return (
      simulationNodes.find((node) => node.id === link.source) &&
      simulationNodes.find((node) => node.id === link.target)
    )
  })

  // Create the force simulation
  const simulation = d3
    .forceSimulation<D3Node>(simulationNodes)
    .force(
      'collision',
      d3
        .forceCollide<D3Node>()
        .radius(
          (d) => Math.sqrt(d.width * d.width + d.height * d.height) / 2 + layoutConfig.nodeSpacing
        )
    )
    .force(
      'link',
      d3
        .forceLink<D3Node, D3Link>(filteredConnections)
        .id((d) => d.id)
        .distance(layoutConfig.nodeSpacing * 1.5)
    )
    .force('x', d3.forceX<D3Node>().strength(layoutConfig.forceStrength * layoutConfig.directionX))
    .force('y', d3.forceY<D3Node>().strength(layoutConfig.forceStrength * layoutConfig.directionY))
    .force('charge', d3.forceManyBody<D3Node>().strength(-300))

  // Run the simulation for a fixed number of iterations
  for (let i = 0; i < layoutConfig.iterations; i++) {
    simulation.tick()
  }

  // Calculate bounding box of the simulation results
  let minX = Infinity,
    minY = Infinity
  simulationNodes.forEach((node) => {
    if (node.x !== undefined) { minX = Math.min(minX, node.x - node.width / 2) }
    if (node.y !== undefined) { minY = Math.min(minY, node.y - node.height / 2) }
  })

  // Apply simulation results to nodes with proper positioning
  const resultNodes = groupNodes.map((originalNode) => {
    const simulationNode = simulationNodes.find((n) => n.id === originalNode.id)

    if (simulationNode) {
      // For nodes inside groups, position is relative to group (0,0)
      // We normalize positions so the top-left corner of the bounding box is (0,0)
      // Add 64px padding inside the group
      const groupPadding = 128
      return {
        ...originalNode,
        position: {
          x:
            (simulationNode.x || 0) -
            minX -
            (originalNode.measured?.width || 200) / 2 +
            groupPadding,
          y:
            (simulationNode.y || 0) -
            minY -
            (originalNode.measured?.height || 100) / 2 +
            groupPadding,
        },
        style: {
          ...originalNode.style,
          transition: 'all 300ms ease-in-out',
        },
      }
    }
    return originalNode
  })

  // Clean up simulation
  simulation.stop()

  return resultNodes
}

// Helper function to calculate group dimensions based on children positions
function calculateGroupDimensions(nodes: Node[]): { width: number; height: number } {
  if (nodes.length === 0) {
    return { width: 200, height: 200 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((node) => {
    const nodeWidth = node.type === 'element' ? node.measured?.width || 200 : 100
    const nodeHeight = node.type === 'element' ? node.measured?.height || 100 : 50

    const left = node.position.x
    const top = node.position.y
    const right = left + nodeWidth
    const bottom = top + nodeHeight

    minX = Math.min(minX, left)
    minY = Math.min(minY, top)
    maxX = Math.max(maxX, right)
    maxY = Math.max(maxY, bottom)
  })

  return {
    width: maxX - minX,
    height: maxY - minY,
  }
}

// Helper function to position groups in a single row
function positionGroupsInRow(
  groupNodes: Node[],
  groupDimensions: Map<string, { width: number; height: number }>
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()

  // Position the groups in a single row with some spacing between them
  const spacing = 200 // Space between groups
  let currentX = 0

  groupNodes.forEach((group) => {
    const dimensions = groupDimensions.get(group.id)
    if (dimensions) {
      // Position each group to the right of the previous one
      positions.set(group.id, {
        x: currentX,
        y: 0, // All groups at same y-level for a horizontal row
      })

      // Move to the next position
      currentX += dimensions.width + spacing
    }
  })

  return positions
}
