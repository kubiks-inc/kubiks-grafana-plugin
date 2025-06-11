import ELK from 'elkjs'
import { Edge, Node, Position } from '@xyflow/react'

// Define layout configuration interface
export interface LayoutConfig {
  algorithm: string
  spacing: number
  aspectRatio: number
  padding: number
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
  // Return early if no nodes
  if (nodes.length === 0) {
    return nodes
  }

  const nodeWidth = 200
  const nodeHeight = 100

  // Create ELK instance
  const elk = new ELK()

  // Prepare the graph for ELK
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'box', // Use box layout for grid-like arrangement
      'elk.spacing.nodeNode': '200', // Space between nodes
      'elk.aspectRatio': '1.6', // Aspect ratio of the drawing area
      'elk.padding': '[50, 50, 50, 50]', // Padding around the drawing
    },
    children: nodes.map((node) => {
      // Get actual node dimensions or use defaults
      const width =
        node.type === 'element_component' ? node.measured?.width || nodeWidth : nodeWidth / 2
      const height =
        node.type === 'element_component' ? node.measured?.height || nodeHeight : nodeHeight / 2

      return {
        id: node.id,
        width: width,
        height: height,
      }
    }),
    edges: [], // Empty as we don't need edge connections
  }

  try {
    // Perform the layout calculation
    const elkLayout = await elk.layout(elkGraph)

    // Apply the calculated layout to nodes
    const resultNodes = nodes.map((node) => {
      // Find the corresponding node in the ELK layout
      const elkNode = elkLayout.children?.find((n) => n.id === node.id)

      if (elkNode && elkNode.x !== undefined && elkNode.y !== undefined) {
        return {
          ...node,
          targetPosition: Position.Left,
          sourcePosition: Position.Right,
          // Use saved positions if available, otherwise use calculated positions
          position: positions[node.id] || {
            x: elkNode.x,
            y: elkNode.y,
          },
          style: {
            ...node.style,
            transition: 'all 300ms ease-in-out',
          },
          draggable: false,
        }
      }

      return node
    })

    return resultNodes
  } catch (error) {
    console.error('Error calculating layout with ELK:', error)
    return nodes
  }
}
