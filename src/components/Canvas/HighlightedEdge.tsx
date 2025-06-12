import React, { useState, useEffect, useRef, useCallback } from 'react'
import { EdgeProps, getSimpleBezierPath, Position, BaseEdge } from '@xyflow/react'
import { LayoutItem } from '@/lib/model/view'
import { useViewStore } from '@/store/ViewStoreProvider'

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

type EdgeData = {
  [key: string]: unknown
  rps?: number
  errorRate?: number
  sourceId?: string
  targetId?: string
  sourceName?: string
  targetName?: string
  routes?: Array<{ path: string; method: string; count: number }>
  latency?: number
  status?: string
  layout?: LayoutItem[]
}

const defaultData: EdgeData = {
  rps: 0,
  errorRate: 0,
}

const getLayoutValue = (data: LayoutItem[], key: string) => {
  const value = data?.find((item) => item.type === key)?.value
  return value
}

// Helper function to calculate the midpoint of a bezier path
const getBezierMidpoint = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): { x: number; y: number } => {
  // Simple midpoint calculation
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2
  return { x: midX, y: midY }
}

const HighlightedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  style = {},
  data = defaultData,
  ...props
}: EdgeProps) => {
  const setConnectionPopup = useViewStore((state) => state.setConnectionPopup)
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Use simple bezier path for a clean curved line
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Calculate the midpoint for the button
  const midpoint = getBezierMidpoint(sourceX, sourceY, targetX, targetY)

  const getEdgeColor = (errorRate: number = 0) => {
    if (errorRate > 5) return 'var(--color-error-high, #ef4444)' // red-500 fallback
    if (errorRate > 1) return 'var(--color-error-medium, #f97316)' // orange-500 fallback
    return 'var(--color-error-low, #22c55e)' // green-500 fallback
  }

  const getEdgeWidth = (rps: number = 0) => {
    if (rps > 1000) return 10
    if (rps > 200) return 8
    return 8
  }

  const getDashArray = (rps: number = 0) => {
    const baseLength = 12
    const gap = 6
    return `${Math.max(baseLength * (rps / 500), baseLength)} ${gap}`
  }

  const getAnimationDuration = (rps: number = 0) => {
    const speed = rps === 0 ? 3 : Math.max(0.5, Math.min(3, 30 / (rps / 500)))
    return `${speed}s`
  }

  const rps = getLayoutValue(data.layout as LayoutItem[], 'rps')?.data as unknown as number
  const errorRate = getLayoutValue(data.layout as LayoutItem[], 'errorRate')
    ?.data as unknown as number
  const latency = getLayoutValue(data.layout as LayoutItem[], 'latency')?.data as unknown as number
  const endpoints =
    (getLayoutValue(data.layout as LayoutItem[], 'endpoints')?.data as unknown as Endpoint[]) || []

  // Group endpoints by type
  const groupedEndpoints = endpoints.reduce((acc: Record<string, Endpoint[]>, endpoint) => {
    const type = endpoint.endpointType || 'unknown'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(endpoint)
    return acc
  }, {})

  const status = getLayoutValue(data.layout as LayoutItem[], 'status')?.data as unknown as string
  const edgePayload = data as EdgeData
  const sourceName = edgePayload.sourceName
  const targetName = edgePayload.targetName
  const edgeWidth = getEdgeWidth(rps ?? 0)
  const edgeColor = getEdgeColor(errorRate ?? 0)
  const arrowSize = Math.max(edgeWidth * 2, 5)

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      console.log('handleButtonClick')
      setConnectionPopup({
        x: e.clientX,
        y: e.clientY,
        placement: 'top',
        open: true,
        rps: rps ?? 0,
        errorRate: errorRate ?? 0,
        latency: latency ?? 0,
        sourceName: sourceName ?? '',
        targetName: targetName ?? '',
        endpoints: groupedEndpoints,
      })
    },
    [
      midpoint,
      rps,
      errorRate,
      latency,
      sourceName,
      targetName,
      groupedEndpoints,
      setConnectionPopup,
    ]
  )

  return (
    <>
      <defs>
        <marker
          id={`arrowhead-${id}`}
          markerWidth={arrowSize}
          markerHeight={arrowSize}
          refX={arrowSize - 2}
          refY={arrowSize / 2}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d={`M0,0 L0,${arrowSize} L${arrowSize},${arrowSize / 2} z`} fill={edgeColor} />
        </marker>
      </defs>
      <g>
        {/* Base edge path without hover effects */}
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            strokeWidth: edgeWidth,
            stroke: edgeColor,
            strokeDasharray: getDashArray(rps ?? 0),
            animation: `dash ${getAnimationDuration(rps ?? 0)} linear infinite`,
            pointerEvents: 'none',
            ...style,
          }}
          markerEnd={`url(#arrowhead-${id})`}
        />

        {/* Interactive button in the middle of the edge */}
        <circle
          cx={midpoint.x}
          cy={midpoint.y}
          r={25} // Increased size from 15 to 25
          fill="rgba(255, 255, 255, 0.5)"
          fillOpacity={0.8}
          stroke={edgeColor}
          strokeWidth={3}
          cursor="pointer"
          onClick={handleButtonClick}
          pointerEvents="all"
          filter="drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))"
        />

        {/* Plus icon inside the button */}
        <g onClick={handleButtonClick} cursor="pointer">
          <line
            x1={midpoint.x - 10}
            y1={midpoint.y}
            x2={midpoint.x + 10}
            y2={midpoint.y}
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={midpoint.x}
            y1={midpoint.y - 10}
            x2={midpoint.x}
            y2={midpoint.y + 10}
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      </g>
      <style>
        {`
            @keyframes dash {
              to {
                stroke-dashoffset: -50;
              }
            }
            
            @keyframes popup-appear-top {
              from {
                opacity: 0;
                transform: translate(-50%, -110%) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -120%) scale(1);
              }
            }
            
            @keyframes popup-appear-bottom {
              from {
                opacity: 0;
                transform: translate(-50%, 10px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translate(-50%, 20px) scale(1);
              }
            }
            
            @keyframes popup-appear-right {
              from {
                opacity: 0;
                transform: translate(10px, -50%) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translate(20px, -50%) scale(1);
              }
            }
            
            @keyframes popup-appear-left {
              from {
                opacity: 0;
                transform: translate(calc(-100% - 10px), -50%) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translate(calc(-100% - 20px), -50%) scale(1);
              }
            }
            
            @keyframes popup-appear-center {
              from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}
      </style>
    </>
  )
}

export default HighlightedEdge
