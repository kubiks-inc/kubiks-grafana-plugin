import React from 'react'
import { LayoutItem } from '@/lib/model/view'
import { Handle, Position, useStore, useReactFlow, NodeToolbar } from '@xyflow/react'
import {
  CpuIcon,
  ServerIcon,
  LayersIcon,
  FocusIcon,
  MaximizeIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  ZoomIn,
} from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { getTitle, getExploreLink } from './helpers'
import { useViewStore } from '@/store/ViewStoreProvider'
import { getIconUrlWithFallback } from '@/utils/iconMapper'
// import { useViewStore } from './view-store-provider'
// import { getTitle, getExploreLink } from './helpers'

function getStatus(record: LayoutItem[]): Status | undefined {
  const statusItem = record?.find((item) => item.type === 'status')
  return statusItem?.value?.data as Status | undefined
}

interface GenericNodeProps {
  data: {
    icon: string
    organizationId: number
    type: string
    name: string
    layout: LayoutItem[]
    key: string
    isSimplified?: boolean
    onClick?: (nodeId: string) => void
    [key: string]: unknown
  }
}

interface LayoutLink {
  url: string
  hoverColor: string
  label: string
  icon: string
}

const icons = {
  Service: ServerIcon,
  Deployment: LayersIcon,
  Pod: CpuIcon,
}

type Status = 'Success' | 'Warning' | 'Failed' | 'Running' | 'Online'

const statusColors: Record<Status, string> = {
  Success: 'border-green-500',
  Warning: 'border-yellow-500',
  Failed: 'border-red-500',
  Running: 'border-green-500',
  Online: 'border-green-500',
}

const statusGlowColors: Record<Status, string> = {
  Success: 'rgba(16, 185, 129, 0.35)',
  Warning: 'rgba(245, 158, 11, 0.35)',
  Failed: 'rgba(239, 68, 68, 0.35)',
  Running: 'rgba(16, 185, 129, 0.35)',
  Online: 'rgba(16, 185, 129, 0.35)',
}

const statusDotColors: Record<Status, string> = {
  Success: 'bg-green-500',
  Warning: 'bg-yellow-500',
  Failed: 'bg-red-500',
  Running: 'bg-green-500',
  Online: 'bg-green-500',
}

// function getStatus(record: LayoutItem[]): Status | undefined {
//   const statusItem = record?.find((item) => item.type === 'status')
//   return statusItem?.value?.data as Status | undefined
// }

const getStatusTextColor = (status?: Status | string) => {
  switch (status) {
    case 'Success':
    case 'Running':
    case 'Online':
      return 'text-green-400'
    case 'Warning':
      return 'text-yellow-400'
    case 'Failed':
      return 'text-red-400'
    default:
      return 'text-white/60'
  }
}

const CopyableText = ({
  text,
  className,
  disabled = false,
}: {
  text: string
  className?: string
  disabled?: boolean
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (disabled) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 600)
  }

  return (
    <span
      onClick={disabled ? undefined : handleCopy}
      className={cn(
        'text-white px-2 py-0.5 rounded-md relative group inline-block truncate',
        disabled ? 'cursor-default' : 'cursor-pointer',
        copied ? 'bg-white/10' : disabled ? '' : 'hover:bg-white/5',
        className
      )}
      title={text}
    >
      <span className="block truncate">{text}</span>
      {copied && !disabled && (
        <span className="absolute inset-0 flex items-center justify-center text-white/90 bg-[#2c2c30] rounded-md text-2xl font-medium">
          Copied
        </span>
      )}
    </span>
  )
}

// Component to visualize pods as blocks
const BlocksComponent = ({
  blocks,
  // router,
  disabled = false,
}: {
  blocks: { name: string; status: Status; url: string }[]
  //   router: AppRouterInstance
  disabled?: boolean
}) => {
  return (
    <div className="mt-2">
      <div className="flex flex-col gap-1.5">
        {blocks?.map((block, index) => (
          <div
            key={index}
            className={cn(
              'px-2 py-1.5 rounded-md border-4 border-[#3a3a3c] transition-colors',
              'flex items-center justify-between',
              disabled
                ? 'cursor-default'
                : block.url
                  ? 'hover:border-[#525252] cursor-pointer'
                  : 'cursor-default'
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  statusDotColors[block.status] || 'bg-white/50'
                )}
              />
              <span className="text-2xl font-medium truncate text-white">{block.name}</span>
            </div>
            <div className="flex items-center text-2xl text-white/60 gap-3 shrink-0">
              <div className={cn('text-center', getStatusTextColor(block.status))}>
                {block.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const ElementComponent = ({ data }: GenericNodeProps) => {
  const Icon = icons[data.type as keyof typeof icons] || ServerIcon
  const status = getStatus(data.layout)
  const title = getTitle(data.layout)
  // const router = useRouter()
  const [showDeploymentSticker, setShowDeploymentSticker] = useState(false)
  const { setIsServiceDrawerOpen, setSelectedServiceDetails } = useViewStore((state) => state)
  const containerRef = useRef<HTMLDivElement>(null)
  const exploreLink = getExploreLink(data.layout)

  const isSimplifiedView = false //data.isSimplified

  // Find links from layout
  const linkItems = data.layout?.filter((item) => item.type === 'links') || []
  const nonLinkItems = data.layout?.filter((item) => item.type !== 'links') || []

  // Track status changes to detect when deployment starts
  useEffect(() => {
    if (status === 'Warning') {
      setShowDeploymentSticker(true)
    } else {
      setShowDeploymentSticker(false)
    }
  }, [status])

  const handleFocus = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      setSelectedServiceDetails(data.key)
      setIsServiceDrawerOpen(true)
      // Pass the event to show context menu
      if (data.onClick) {
        data.onClick(data.key)
      }
    },
    [data.key, data.onClick, setSelectedServiceDetails]
  )

  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Disabled - no longer functional
  }

  const renderField = (i: number, item: LayoutItem) => {
    // In simplified view, only render progress elements
    if (isSimplifiedView && item.type !== 'progress') {
      return null
    }

    switch (item.type) {
      case 'title':
        return (
          <div className="text-4xl font-bold text-white mb-2" key={`${data.key}-title-${i}`}>
            {item.value?.data as string || item.label || 'Untitled'}
          </div>
        )
      case 'parentId':
        return (
          <div className="text-xl text-white/60 mb-2" key={`${data.key}-parentId-${i}`}>
            Parent: {item.value?.data as string || 'None'}
          </div>
        )
      case 'icon':
        return (
          <div className="flex items-center gap-2 mb-2" key={`${data.key}-icon-${i}`}>
            {item.value?.data && (
              <img
                src={getIconUrlWithFallback(item.value.data as string)}
                alt="Element icon"
                className="w-8 h-8"
              />
            )}
            {item.label && <span className="text-white/80">{item.label}</span>}
          </div>
        )
      case 'status':
        const statusValue = item.value?.data as Status | undefined
        return (
          <div className="flex items-center gap-2 mb-2" key={`${data.key}-status-${i}`}>
            {statusValue && (
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  statusDotColors[statusValue] || 'bg-white/50'
                )}
              />
            )}
            <span className={cn('text-xl font-medium', getStatusTextColor(statusValue))}>
              {statusValue || 'Unknown'}
            </span>
          </div>
        )
      case 'text':
        return (
          <div className="text-2xl flex items-center gap-1.5" key={`${data.key}-label-${i}`}>
            {item.label && (
              <span className="font-medium text-white/60 shrink-0">{item.label}:</span>
            )}
            <CopyableText text={item.value?.data as string} className="" disabled={true} />
          </div>
        )
      case 'tags':
        return (
          <div className="space-y-1 max-w-[600px]" key={`${data.key}-label-${i}`}>
            <div className="flex items-center gap-1 flex-wrap">
              <div className="text-2xl font-medium text-white/60 shrink-0">{item.label}:</div>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(item.value?.data || {}).map(([_, val]) => (
                  <CopyableText
                    key={val}
                    text={val}
                    className="text-2xl bg-white/5"
                    disabled={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      case 'keyValue':
        return (
          <div key={item.label} className="space-y-1">
            {item.label && <div className="text-2xl font-medium text-white/60">{item.label}</div>}
            <div className="grid grid-cols-1 gap-x-2 gap-y-1">
              {Object.entries(item.value?.data || {}).map(([key, val], index) => (
                <div key={index} className="text-2xl">
                  <span className="text-white/60">{key}:</span>{' '}
                  <CopyableText text={val as string} disabled={true} />
                </div>
              ))}
            </div>
          </div>
        )
      case 'progress':
        const percentage = Math.max(Number(item.value?.data), 0)
        const isWarning = percentage >= 70 && percentage < 80
        const isDanger = percentage >= 80
        return (
          <div
            className={cn(isSimplifiedView ? 'space-y-5' : 'space-y-3', isSimplifiedView && 'mb-2')}
            key={`${data.key}-label-${i}`}
          >
            <div className="flex justify-between items-center">
              <span
                className={cn(
                  'text-white/90 font-medium',
                  isSimplifiedView ? 'text-5xl' : 'text-2xl'
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  isDanger ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400',
                  isSimplifiedView ? 'text-5xl' : 'text-2xl',
                  isSimplifiedView && 'pl-8'
                )}
              >
                {percentage.toFixed(2)}%
              </span>
            </div>
            <div
              className={cn('w-full bg-white/10 rounded-full', isSimplifiedView ? 'h-5' : 'h-3')}
            >
              <div
                className={cn(
                  'rounded-full transition-all',
                  isSimplifiedView ? 'h-5' : 'h-3',
                  isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )
      case 'inversed_progress':
        const inversePercentage = Math.max(Number(item.value?.data), 0)
        const isInverseDanger = inversePercentage <= 20
        const isInverseWarning = inversePercentage > 20 && inversePercentage <= 30
        return (
          <div
            className={cn(isSimplifiedView ? 'space-y-5' : 'space-y-3', isSimplifiedView && 'mb-2')}
            key={`${data.key}-label-${i}`}
          >
            <div className="flex justify-between items-center">
              <span
                className={cn(
                  'text-white/90 font-medium',
                  isSimplifiedView ? 'text-5xl' : 'text-2xl'
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  isInverseDanger
                    ? 'text-red-400'
                    : isInverseWarning
                      ? 'text-yellow-400'
                      : 'text-green-400',
                  isSimplifiedView ? 'text-5xl' : 'text-2xl',
                  isSimplifiedView && 'pl-8'
                )}
              >
                {inversePercentage.toFixed(2)}%
              </span>
            </div>
            <div
              className={cn('w-full bg-white/10 rounded-full', isSimplifiedView ? 'h-5' : 'h-3')}
            >
              <div
                className={cn(
                  'rounded-full transition-all',
                  isSimplifiedView ? 'h-5' : 'h-3',
                  isInverseDanger
                    ? 'bg-red-500'
                    : isInverseWarning
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                )}
                style={{ width: `${Math.min(inversePercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )
      case 'blocks':
        return (
          <div className="space-y-1" key={`${data.key}-blocks-${i}`}>
            {item.label && <div className="text-2xl font-medium text-white/60">{item.label}</div>}
            <BlocksComponent blocks={item.value?.data as any} disabled={true} />
          </div>
        )
      case 'links':
        return (
          <div className="flex flex-wrap gap-3" key={`${data.key}-label-${i}`}>
            {(item.value?.data as LayoutLink[]).map((link, linkIndex: number) => (
              <div
                key={linkIndex}
                className="text-white/90 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                aria-label={link.label}
                style={{
                  background: 'rgba(45, 45, 50, 0.4)',
                  border: '0.5px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(link.url, '_blank', 'noopener,noreferrer')
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#252528]">
                  <img src={getIconUrlWithFallback(link.icon)} alt={link.label} className="w-12 h-12" />
                </div>
                <span className="text-2xl font-medium">{link.label}</span>
                <ExternalLinkIcon className="w-4 h-4 text-white/40 ml-2" />
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const elementContent = (
    <div
      ref={containerRef}
      className={cn(
        'rounded-xl flex flex-col relative',
        isSimplifiedView ? 'border-[6px] p-12' : 'border-[2px] p-5',
        status && statusColors[status]
          ? statusColors[status]
          : 'border-[#424242] hover:border-[#525252]'
      )}
      style={{
        minWidth: isSimplifiedView ? '320px' : '600px',
        minHeight: isSimplifiedView ? '180px' : '400px',
        userSelect: 'text',
        cursor: 'pointer',
        backgroundColor: 'rgba(28, 28, 32, 0.98)',
        boxShadow: isSimplifiedView
          ? `0 0 20px ${statusGlowColors[status || 'Success']}, 0 4px 12px rgba(0, 0, 0, 0.4)`
          : '0 8px 16px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseOver={(e) => {
        if (!status) {
          e.currentTarget.style.boxShadow = isSimplifiedView
            ? `0 0 25px ${statusGlowColors[status || 'Success']}, 0 8px 16px rgba(0, 0, 0, 0.5)`
            : '0 10px 20px rgba(0, 0, 0, 0.4)'
        }
      }}
      onMouseOut={(e) => {
        if (!status) {
          e.currentTarget.style.boxShadow = isSimplifiedView
            ? `0 0 20px ${statusGlowColors[status || 'Success']}, 0 4px 12px rgba(0, 0, 0, 0.4)`
            : '0 8px 16px rgba(0, 0, 0, 0.3)'
        }
      }}
      onClick={handleFocus}
    >
      {/* Deployment Sticker */}
      {showDeploymentSticker && (
        <div className="absolute -top-6 -right-6 bg-yellow-500 text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-3 z-10 animate-pulse text-xl">
          <RefreshCwIcon className="w-8 h-8 animate-spin" />
          <span>Deploying</span>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <div
          className={cn(
            'flex items-center gap-6 transition-all duration-300',
            isSimplifiedView ? 'mb-8' : 'mb-6'
          )}
        >
          {data.icon && (
            <img
              src={getIconUrlWithFallback(data.icon)}
              alt={`${data.name} icon`}
              className={cn(
                'transition-transform duration-300',
                isSimplifiedView ? 'w-16 h-16' : 'w-16 h-16'
              )}
            />
          )}
          {!data.icon && (
            <div
              className={cn(
                'flex items-center justify-center rounded-full transition-all duration-300',
                isSimplifiedView ? 'w-14 h-14 bg-[#252528]/80' : 'w-16 h-16 bg-transparent'
              )}
            >
              <Icon
                className={cn(
                  'text-white/90 shrink-0 transition-transform duration-300',
                  isSimplifiedView ? 'w-16 h-16' : 'w-16 h-16'
                )}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1
              className={cn(
                'font-semibold text-white truncate tracking-tight transition-all duration-300',
                isSimplifiedView ? 'text-6xl' : 'text-6xl'
              )}
            >
              <CopyableText text={title} className="max-w-full" />
            </h1>
          </div>
          {status && (
            <div className={cn('flex items-center gap-4 transition-all duration-300')}>
              <div
                className={cn(
                  'rounded-full shrink-0 transition-all duration-300',
                  statusColors[status] || 'bg-white/50',
                  isSimplifiedView ? 'w-8 h-8' : 'w-3 h-3'
                )}
                style={{
                  boxShadow: isSimplifiedView
                    ? `0 0 15px ${statusGlowColors[status || 'Success']}`
                    : 'none',
                }}
              />
              {isSimplifiedView && (
                <span
                  className={cn(
                    'font-medium text-5xl transition-opacity duration-300',
                    status === 'Success'
                      ? 'text-green-400'
                      : status === 'Warning'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  )}
                >
                  {status}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Render all non-link items only when zoom level is sufficient */}
        {!isSimplifiedView && (
          <div className="space-y-8 animate-fadeIn">
            {/* Progress items */}
            {nonLinkItems
              .filter((item) => item.type === 'progress' || item.type === 'inversed_progress')
              .map((item, i) => renderField(i, item))}

            {/* Other fields (excluding progress, blocks, and links) */}
            {nonLinkItems
              .filter(
                (item) => !['progress', 'inversed_progress', 'blocks', 'links'].includes(item.type)
              )
              .map((item, i) => renderField(i, item))}

            {/* Blocks */}
            {nonLinkItems
              .filter((item) => item.type === 'blocks')
              .map((item, i) => renderField(i, item))}
          </div>
        )}

        {/* In simplified view, only show progress elements */}
        {isSimplifiedView && (
          <div className="space-y-12 animate-fadeIn mt-12">
            {nonLinkItems
              .filter((item) => item.type === 'progress' || item.type === 'inversed_progress')
              .map((item, i) => renderField(i, item))}
          </div>
        )}
      </div>

      {/* Show links section only when not in simplified view */}
      {!isSimplifiedView && linkItems.length > 0 && (
        <>
          <div className="flex-grow min-h-[20px]"></div>
          <div className="w-full h-px bg-[#3a3a3c] my-4"></div>
          <div className="animate-fadeIn">{linkItems.map((item, i) => renderField(i, item))}</div>
        </>
      )}
    </div>
  )

  return (
    <>
      {elementContent}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  )
}
