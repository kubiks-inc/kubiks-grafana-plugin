import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Edge,
  EdgeTypes,
  NodeTypes,
  Node,
  Viewport,
  ReactFlowInstance,
  NodeChange,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import NodeLabel from '@/components/Canvas/Label'
import HighlightedEdge from '@/components/Canvas/HighlightedEdge'
import { ElementComponent } from '@/components/Canvas/Element'
import { View } from '@/lib/api/model/view'
import { createNodesAndEdges } from '@/lib/canvas/layout'
import { NodeContextMenu } from '@/components/Canvas/NodeContextMenu'
import { layoutElements } from '@/lib/canvas/canvasLayout'
// import CanvasNavbar from './CanvasNavbar'
// import { ViewState } from '@/lib/api/model/view-state'
import { useViewStore } from '@/store/ViewStoreProvider'
// import { EdgePopup } from './edgePopup'
import { layoutElements as layoutElementsGrid } from '@/lib/canvas/canvasLayoutGrid'
import { layoutElements as layoutElementsTree } from '@/lib/canvas/canvasLayoutTree'


const edgeTypes: EdgeTypes = {
  highlighted: HighlightedEdge,
  connection: HighlightedEdge,
}

const nodeTypes: NodeTypes = {
  element: ElementComponent,
  node_label: NodeLabel,
}

const eqSet = (xs: Set<unknown>, ys: Set<unknown>) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x))

interface InfiniteCanvasProps { }

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = () => {
  const {
    viewState,
    view,
    filteredRecords,
    setContextMenu,
    setConnectionPopup,
    editLayout,
    elementsToExplore,
  } = useViewStore((state) => state)

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[])
  const [edges, setEdges] = useEdgesState([] as Edge[])
  const [viewport, setViewport] = useState<Viewport | null>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [isLayouted, setIsLayouted] = useState(false)
  const [shouldFitView, setShouldFitView] = useState(false)

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
      viewState?.organizationId ?? '',
      filteredRecords ?? [],
      editLayout,
      viewState?.positions ?? {},
      elementsToExplore
    )

    setNodes(newNodes)
  }, [editLayout])

  useEffect(() => {
    if (!isLayouted) {
      updateLayout(viewState?.positions ?? {})
    }
  }, [nodes, isLayouted])

  // Update nodes and edges when props change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
      viewState?.organizationId ?? '',
      filteredRecords ?? [],
      editLayout,
      viewState?.positions ?? {},
      elementsToExplore
    )

    const oldNodeKeysSet = new Set(nodes.map((node) => node.data.key))
    const newNodeKeysSet = new Set(newNodes.map((node) => node.data.key))

    const setsAreDifferent = !eqSet(oldNodeKeysSet, newNodeKeysSet)

    if (setsAreDifferent) {
      setNodes(newNodes)
      setEdges(newEdges)
      setIsLayouted(false)
      setShouldFitView(true)
      return
    }

    // Create a map of current node positions
    const currentPositions = new Map(
      nodes.map((node) => [node.id, { x: node.position.x, y: node.position.y, style: node.style }])
    )

    // Update nodes while preserving positions
    const updatedNodes = newNodes.map((newNode) => {
      const currentPosition = currentPositions.get(newNode.id)
      if (currentPosition) {
        return {
          ...newNode,
          position: currentPosition,
          style: {
            ...currentPosition.style,
          },
          data: {
            ...newNode.data,
            isSimplified: !newNode.data.isSelected,
          },
        }
      }
      return newNode
    })

    setNodes(updatedNodes)
    setEdges(newEdges)
  }, [filteredRecords, editLayout])

  // Add a new function to update layout excluding group's children
  const updateLayout = async (positions: { [key: string]: { x: number; y: number } }) => {
    const allNodesMeasured = nodes.every(
      (node) =>
        (node.type === 'element' && node.measured?.width && node.measured?.height) ||
        node.type !== 'element'
    )

    // If not all nodes are measured, return null
    if (!allNodesMeasured || nodes.length === 0) {
      console.log('not all nodes measured')
      return
    }

    let layoutedNodes: Node[] | null = null
    switch (view?.layoutType) {
      case 'd3':
        layoutedNodes = await layoutElements(nodes, edges, positions)
        break
      case 'grid':
        layoutedNodes = await layoutElementsGrid(nodes, edges, positions)
        break
      case 'tree':
        layoutedNodes = await layoutElementsTree(nodes, edges, positions)
        break
      default:
        layoutedNodes = await layoutElementsTree(nodes, edges, positions)
        break
    }

    if (layoutedNodes) {
      // Create a map of the original node positions for group children
      const childPositions = new Map()
      nodes.forEach((node) => {
        if (node.parentId) {
          childPositions.set(node.id, { ...node.position, parentId: node.parentId })
        }
      })

      setNodes(layoutedNodes)
      setIsLayouted(true)
      setShouldFitView(true)
    } else {
      setIsLayouted(false)
    }
  }

  // Custom handler for nodes change events
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)
    },
    [onNodesChange]
  )

  const closeContextMenu = () => {
    setContextMenu({
      open: false,
      position: { x: 0, y: 0 },
      nodeId: '',
    })
    setConnectionPopup({
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
    })
  }

  // Dedicated effect for fitting view when layout completes
  useEffect(() => {
    if (shouldFitView && isLayouted && reactFlowInstance) {
      reactFlowInstance.fitView({
        padding: 0.5,
        includeHiddenNodes: false,
      })

      window.requestAnimationFrame(() => {
        const { x, y, zoom } = reactFlowInstance.getViewport()
        reactFlowInstance.setViewport({ x: x, y: y, zoom })
      })
      setShouldFitView(false)
    }
  }, [shouldFitView, isLayouted, reactFlowInstance])

  const onViewportChange = useCallback((viewport: Viewport) => {
    // Only update if viewport changed significantly to prevent unnecessary updates
    setViewport((prevViewport) => {
      if (!prevViewport) return viewport

      // Check if the viewport changed enough to warrant an update
      const zoomDiff = Math.abs(prevViewport.zoom - viewport.zoom)
      const xDiff = Math.abs(prevViewport.x - viewport.x)
      const yDiff = Math.abs(prevViewport.y - viewport.y)

      // Only update if the changes are significant (avoids micro-updates)
      if (zoomDiff > 0.01 || xDiff > 1 || yDiff > 1) {
        return viewport
      }

      return prevViewport
    })
  }, [])

  // Prevent default right-click context menu on canvas
  const onCanvasContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
  }, [])

  const proOptions = { hideAttribution: true }

  return (
    <div className="w-full h-full relative p-0 m-0 overflow-hidden" ref={reactFlowWrapper}>
      {/* Node context menu */}
      <NodeContextMenu />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setReactFlowInstance}
        defaultViewport={viewport || undefined}
        onViewportChange={onViewportChange}
        proOptions={proOptions}
        minZoom={0.02}
        maxZoom={0.7}
        zoomOnScroll={true}
        zoomOnPinch={true}
        onMoveStart={closeContextMenu}
        onContextMenu={onCanvasContextMenu}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={2}
          color="rgba(255, 255, 255, 0.2)"
        />
      </ReactFlow>
    </div>
  )
}

export { createNodesAndEdges }
export default InfiniteCanvas
