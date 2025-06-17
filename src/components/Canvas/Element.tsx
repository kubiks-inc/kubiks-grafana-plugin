import React, { useEffect, useState, useRef, useCallback } from 'react'
import { LayoutItem, DashboardElementSource } from '@/lib/model/view'
import { Handle, Position } from '@xyflow/react'
import {
  CpuIcon,
  ServerIcon,
  LayersIcon,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2, Badge } from '@grafana/ui'
import { getBackendSrv } from '@grafana/runtime'
import { getTitle } from './helpers'
import { useViewStore } from '@/store/ViewStoreProvider'
import { getIconUrlWithFallback } from '@/utils/iconMapper'

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

const icons = {
  Service: ServerIcon,
  Deployment: LayersIcon,
  Pod: CpuIcon,
}

type Status = 'Success' | 'Warning' | 'Failed' | 'Running' | 'Online'

/*
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
*/

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
  const styles = useStyles2(getCopyableTextStyles)

  const handleCopy = () => {
    if (disabled) { return }
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 600)
  }

  return (
    <span
      onClick={disabled ? undefined : handleCopy}
      className={`${styles.copyableText} ${disabled ? styles.disabled : styles.enabled} ${className || ''}`}
      title={text}
    >
      <span className={styles.textContent}>{text}</span>
      {copied && !disabled && (
        <span className={styles.copiedOverlay}>
          Copied
        </span>
      )}
    </span>
  )
}

// Component to visualize pods as blocks
const BlocksComponent = ({
  blocks,
  disabled = false,
}: {
  blocks: Array<{ name: string; status: Status; url: string }>
  disabled?: boolean
}) => {
  const styles = useStyles2(getBlocksStyles)

  return (
    <div className={styles.container}>
      <div className={styles.blocksGrid}>
        {blocks?.map((block, index) => (
          <div
            key={index}
            className={`${styles.block} ${disabled
              ? styles.blockDisabled
              : block.url
                ? styles.blockClickable
                : styles.blockDefault
              }`}
          >
            <div className={styles.blockHeader}>
              <div className={`${styles.statusDot} ${styles[`statusDot${block.status}` as keyof typeof styles]}`} />
              <span className={styles.blockName}>{block.name}</span>
            </div>
            <div className={styles.blockStatus}>
              <Badge
                text={block.status}
                color={getStatusBadgeColor(block.status)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PanelPreview = ({ config }: { config: DashboardElementSource }) => {
  const styles = useStyles2(getElementStyles)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchPanelImage = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get the current time range (you might want to make this configurable)
        const from = Date.now() - 6 * 60 * 60 * 1000 // 6 hours ago
        const to = Date.now()

        // Construct the render URL for the panel
        const renderUrl = `/render/d-solo/${config.dashboardUid}?panelId=${config.panelId}&from=${from}&to=${to}&width=400&height=300`

        // Use Grafana's backend service to fetch the rendered image
        const response = await getBackendSrv().fetch({
          url: renderUrl,
          method: 'GET',
          responseType: 'blob'
        })

        const result = await response.toPromise()
        if (result && result.data && result.data instanceof Blob) {
          const imageObjectUrl = URL.createObjectURL(result.data)
          setImageUrl(imageObjectUrl)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching panel image:', err)
        setError('Failed to load panel preview')
      } finally {
        setLoading(false)
      }
    }

    if (config.dashboardUid && config.panelId) {
      fetchPanelImage()
    }

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [config.dashboardUid, config.panelId, imageUrl])

  const handleClick = () => {
    const dashboardUrl = `/d/${config.dashboardUid}?viewPanel=${config.panelId}`
    window.open(dashboardUrl, '_blank')
  }

  if (loading) {
    return (
      <div className={styles.panelPreviewPlaceholder}>
        <RefreshCw className={styles.loadingIcon} />
        <span>Loading panel preview...</span>
      </div>
    )
  }

  if (error || !imageUrl) {
    return (
      <div className={styles.panelPreviewPlaceholder}>
        <AlertTriangle className={styles.errorIcon} />
        <span>{error || 'No preview available'}</span>
      </div>
    )
  }

  return (
    <div
      className={styles.panelPreviewContainer}
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt="Panel Preview"
        className={styles.panelPreviewImage}
        onError={() => setError('Failed to load image')}
      />
    </div>
  )
}

const getStatusBadgeColor = (status: Status) => {
  switch (status) {
    case 'Success':
    case 'Running':
    case 'Online':
      return 'green'
    case 'Warning':
      return 'orange'
    case 'Failed':
      return 'red'
    default:
      return 'blue'
  }
}

export const ElementComponent = ({ data }: GenericNodeProps) => {
  const Icon = icons[data.type as keyof typeof icons] || ServerIcon
  const status = getStatus(data.layout)
  const title = getTitle(data.layout)
  const [showDeploymentSticker, setShowDeploymentSticker] = useState(false)
  const { setIsServiceDrawerOpen, setSelectedServiceDetails } = useViewStore((state) => state)
  const containerRef = useRef<HTMLDivElement>(null)
  const styles = useStyles2(getElementStyles)

  const isSimplifiedView = false

  // Find link items from layout
  const linkItems = data.layout?.filter((item) => item.type === 'link') || []
  const nonLinkItems = data.layout?.filter((item) => item.type !== 'link') || []

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
      if (data.onClick) {
        data.onClick(data.key)
      }
    },
    [data, setSelectedServiceDetails, setIsServiceDrawerOpen]
  )

  const renderField = (i: number, item: LayoutItem) => {
    // In simplified view, only render progress elements
    if (isSimplifiedView && item.type !== 'progress') {
      return null
    }

    switch (item.type) {
      case 'status':
        const statusValue = item.value?.data as Status | undefined
        return (
          <div className={styles.statusContainer} key={`${data.key}-status-${i}`}>
            {statusValue && (
              <div className={`${styles.statusDot} ${styles[`statusDot${statusValue}` as keyof typeof styles]}`} />
            )}
            <Badge
              text={statusValue || 'Unknown'}
              color={getStatusBadgeColor(statusValue as Status)}
            />
          </div>
        )
      case 'text':
        return (
          <div className={styles.textField} key={`${data.key}-label-${i}`}>
            {item.label && (
              <span className={styles.fieldLabel}>{item.label}:</span>
            )}
            <CopyableText text={item.value?.data as string} disabled={true} />
          </div>
        )
      case 'tags':
        return (
          <div className={styles.tagsContainer} key={`${data.key}-label-${i}`}>
            <div className={styles.tagsHeader}>
              <div className={styles.fieldLabel}>{item.label}:</div>
              <div className={styles.tagsGrid}>
                {Object.entries(item.value?.data || {}).map(([_, val]) => (
                  <Badge
                    key={val}
                    text={val}
                    color="blue"
                  />
                ))}
              </div>
            </div>
          </div>
        )
      case 'keyValue':
        return (
          <div key={item.label} className={styles.keyValueContainer}>
            {item.label && <div className={styles.fieldLabel}>{item.label}</div>}
            <div className={styles.keyValueGrid}>
              {Object.entries(item.value?.data || {}).map(([key, val], index) => (
                <div key={index} className={styles.keyValuePair}>
                  <span className={styles.keyValueKey}>{key}:</span>{' '}
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
            className={`${styles.progressContainer} ${isSimplifiedView ? styles.progressSimplified : ''}`}
            key={`${data.key}-label-${i}`}
          >
            <div className={styles.progressHeader}>
              <span className={`${styles.progressLabel} ${isSimplifiedView ? styles.progressLabelLarge : ''}`}>
                {item.label}
              </span>
              <span className={`${styles.progressValue} ${isSimplifiedView ? styles.progressValueLarge : ''} ${isDanger ? styles.progressDanger : isWarning ? styles.progressWarning : styles.progressSuccess
                }`}>
                {percentage.toFixed(2)}%
              </span>
            </div>
            <div className={`${styles.progressBar} ${isSimplifiedView ? styles.progressBarLarge : ''}`}>
              <div
                className={`${styles.progressFill} ${isDanger ? styles.progressFillDanger : isWarning ? styles.progressFillWarning : styles.progressFillSuccess
                  }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )
      case 'inversed_progress':
        const inversePercentage = Math.max(Number(item.value?.data), 0)
        const isInverseDanger = inversePercentage <= 20
        const isInverseWarning = inversePercentage > 20 && inversePercentage <= 30
        return (
          <div
            className={`${styles.progressContainer} ${isSimplifiedView ? styles.progressSimplified : ''}`}
            key={`${data.key}-label-${i}`}
          >
            <div className={styles.progressHeader}>
              <span className={`${styles.progressLabel} ${isSimplifiedView ? styles.progressLabelLarge : ''}`}>
                {item.label}
              </span>
              <span className={`${styles.progressValue} ${isSimplifiedView ? styles.progressValueLarge : ''} ${isInverseDanger ? styles.progressDanger : isInverseWarning ? styles.progressWarning : styles.progressSuccess
                }`}>
                {inversePercentage.toFixed(2)}%
              </span>
            </div>
            <div className={`${styles.progressBar} ${isSimplifiedView ? styles.progressBarLarge : ''}`}>
              <div
                className={`${styles.progressFill} ${isInverseDanger ? styles.progressFillDanger : isInverseWarning ? styles.progressFillWarning : styles.progressFillSuccess
                  }`}
                style={{ width: `${Math.min(inversePercentage, 100)}%` }}
              />
            </div>
          </div>
        )
      case 'blocks':
        return (
          <div className={styles.blocksSection} key={`${data.key}-blocks-${i}`}>
            {item.label && <div className={styles.fieldLabel}>{item.label}</div>}
            <BlocksComponent blocks={item.value?.data as any} disabled={true} />
          </div>
        )
      case 'panel':
        const config = item.value?.data as DashboardElementSource
        return <PanelPreview key={`${data.key}-panel-${i}`} config={config} />
      default:
        return null
    }
  }

  const elementContent = (
    <div
      ref={containerRef}
      className={`${styles.elementContainer} ${isSimplifiedView ? styles.elementSimplified : styles.elementDetailed
        } ${status ? styles[`elementStatus${status}` as keyof typeof styles] : styles.elementDefault}`}
      onClick={handleFocus}
    >
      {/* Deployment Sticker */}
      {showDeploymentSticker && (
        <div className={styles.deploymentSticker}>
          <Icon name="refresh" className={styles.deploymentIcon} />
          <span>Deploying</span>
        </div>
      )}

      <div className={styles.elementContent}>
        <div className={`${styles.elementHeader} ${isSimplifiedView ? styles.elementHeaderSimplified : ''}`}>
          {data.icon && (
            <img
              src={getIconUrlWithFallback(data.icon)}
              alt={`${data.name} icon`}
              className={`${styles.elementIcon} ${isSimplifiedView ? styles.elementIconLarge : ''}`}
            />
          )}
          {!data.icon && (
            <div className={`${styles.elementIconPlaceholder} ${isSimplifiedView ? styles.elementIconPlaceholderSimplified : ''}`}>
              <Icon
                name="cloud"
                className={`${styles.elementIconSvg} ${isSimplifiedView ? styles.elementIconSvgLarge : ''}`}
              />
            </div>
          )}
          <div className={styles.elementTitleContainer}>
            <h1 className={`${styles.elementTitle} ${isSimplifiedView ? styles.elementTitleLarge : ''}`}>
              <CopyableText text={title} />
            </h1>
          </div>
          {status && (
            <div className={styles.elementStatusContainer}>
              <div
                className={`${styles.statusIndicator} ${isSimplifiedView ? styles.statusIndicatorLarge : ''} ${styles[`statusIndicator${status}` as keyof typeof styles]
                  }`}
              />
              {isSimplifiedView && (
                <Badge
                  text={status}
                  color={getStatusBadgeColor(status)}
                />
              )}
            </div>
          )}
        </div>

        {/* Render all non-link items only when zoom level is sufficient */}
        {!isSimplifiedView && (
          <div className={styles.fieldsContainer}>
            {/* Progress items */}
            {nonLinkItems
              .filter((item) => item.type === 'progress' || item.type === 'inversed_progress')
              .map((item, i) => renderField(i, item))}

            {/* Other fields (excluding progress, blocks, and links) */}
            {nonLinkItems
              .filter(
                (item) => !['progress', 'inversed_progress', 'blocks', 'link'].includes(item.type)
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
          <div className={styles.fieldsContainerSimplified}>
            {nonLinkItems
              .filter((item) => item.type === 'progress' || item.type === 'inversed_progress')
              .map((item, i) => renderField(i, item))}
          </div>
        )}
      </div>

      {/* Show links section at the very bottom when not in simplified view */}
      {!isSimplifiedView && linkItems.length > 0 && (
        <div className={styles.linksContainer}>
          <div className={styles.linksGrid}>
            {linkItems.map((item, i) => (
              <div
                key={`${data.key}-link-${i}`}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(item.value?.data as string, '_blank', 'noopener,noreferrer')
                }}
                className={styles.linkButton}
              >
                <div className={styles.linkButtonContent}>
                  <div className={styles.linkIconContainer}>
                    <img
                      src={getIconUrlWithFallback(item.icon || '')}
                      alt={item.label}
                      className={styles.linkIcon}
                    />
                  </div>
                  <span className={styles.linkLabel}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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

const getCopyableTextStyles = (theme: GrafanaTheme2) => ({
  copyableText: css`
    position: relative;
    display: inline-block;
    padding: ${theme.spacing(0.5, 1)};
    border-radius: ${theme.shape.radius.default};
    transition: all 0.2s ease;
    word-break: break-all;
    max-width: 100%;
  `,
  enabled: css`
    cursor: pointer;
    background: ${theme.colors.background.canvas};
    &:hover {
      background: ${theme.colors.emphasize(theme.colors.background.canvas, 0.03)};
    }
  `,
  disabled: css`
    cursor: default;
    background: transparent;
  `,
  textContent: css`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${theme.colors.text.primary};
  `,
  copiedOverlay: css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    border-radius: ${theme.shape.radius.default};
    font-weight: ${theme.typography.fontWeightMedium};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
})

const getBlocksStyles = (theme: GrafanaTheme2) => ({
  container: css`
    margin-top: ${theme.spacing(1)};
  `,
  blocksGrid: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
  block: css`
    padding: ${theme.spacing(1, 1.5)};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
  `,
  blockDefault: css`
    cursor: default;
  `,
  blockClickable: css`
    cursor: pointer;
    &:hover {
      border-color: ${theme.colors.border.strong};
      background: ${theme.colors.emphasize(theme.colors.background.secondary, 0.03)};
    }
  `,
  blockDisabled: css`
    cursor: default;
    opacity: 0.6;
  `,
  blockHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex: 1;
    min-width: 0;
  `,
  blockName: css`
    font-size: ${theme.typography.body.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  blockStatus: css`
    flex-shrink: 0;
  `,
  statusDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  `,
  statusDotSuccess: css`
    background: ${theme.colors.success.main};
  `,
  statusDotWarning: css`
    background: ${theme.colors.warning.main};
  `,
  statusDotFailed: css`
    background: ${theme.colors.error.main};
  `,
  statusDotRunning: css`
    background: ${theme.colors.success.main};
  `,
  statusDotOnline: css`
    background: ${theme.colors.success.main};
  `,
})

const getElementStyles = (theme: GrafanaTheme2) => ({
  elementContainer: css`
    background: ${theme.colors.background.primary};
    border: 2px solid ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow: ${theme.shadows.z1};
    display: flex;
    flex-direction: column;
    
    &:hover {
      border-color: ${theme.colors.border.strong};
      box-shadow: ${theme.shadows.z2};
    }
  `,
  elementDetailed: css`
    min-width: 600px;
    min-height: 400px;
    padding: ${theme.spacing(3)};
  `,
  elementSimplified: css`
    min-width: 320px;
    min-height: 180px;
    padding: ${theme.spacing(2)};
    border-width: 6px;
  `,
  elementDefault: css`
    border-color: ${theme.colors.border.medium};
    &:hover {
      border-color: ${theme.colors.border.strong};
    }
  `,
  elementStatusSuccess: css`
    border-color: ${theme.colors.success.border};
    box-shadow: 0 0 20px ${theme.colors.success.transparent};
  `,
  elementStatusWarning: css`
    border-color: ${theme.colors.warning.border};
    box-shadow: 0 0 20px ${theme.colors.warning.transparent};
  `,
  elementStatusFailed: css`
    border-color: ${theme.colors.error.border};
    box-shadow: 0 0 20px ${theme.colors.error.transparent};
  `,
  elementStatusRunning: css`
    border-color: ${theme.colors.success.border};
    box-shadow: 0 0 20px ${theme.colors.success.transparent};
  `,
  elementStatusOnline: css`
    border-color: ${theme.colors.success.border};
    box-shadow: 0 0 20px ${theme.colors.success.transparent};
  `,
  deploymentSticker: css`
    position: absolute;
    top: -${theme.spacing(3)};
    right: -${theme.spacing(3)};
    background: ${theme.colors.warning.main};
    color: ${theme.colors.warning.contrastText};
    font-weight: ${theme.typography.fontWeightBold};
    padding: ${theme.spacing(1, 2)};
    border-radius: ${theme.shape.radius.pill};
    box-shadow: ${theme.shadows.z2};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    z-index: 10;
    animation: pulse 2s infinite;
    font-size: ${theme.typography.bodySmall.fontSize};
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `,
  deploymentIcon: css`
    animation: spin 1s linear infinite;
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  elementContent: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  `,
  elementHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(2)};
    transition: all 0.3s ease;
  `,
  elementHeaderSimplified: css`
    margin-bottom: ${theme.spacing(3)};
  `,
  elementIcon: css`
    width: 64px;
    height: 64px;
    object-fit: contain;
    transition: transform 0.3s ease;
  `,
  elementIconLarge: css`
    width: 80px;
    height: 80px;
  `,
  elementIconPlaceholder: css`
    width: 64px;
    height: 64px;
    background: ${theme.colors.background.secondary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  `,
  elementIconPlaceholderSimplified: css`
    width: 80px;
    height: 80px;
    background: ${theme.colors.emphasize(theme.colors.background.secondary, 0.8)};
  `,
  elementIconSvg: css`
    width: 32px;
    height: 32px;
    color: ${theme.colors.text.secondary};
    transition: transform 0.3s ease;
  `,
  elementIconSvgLarge: css`
    width: 40px;
    height: 40px;
  `,
  elementTitleContainer: css`
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  `,
  elementTitle: css`
    font-size: calc(${theme.typography.h2.fontSize} * 2);
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.025em;
    transition: all 0.3s ease;
    margin: 0;
  `,
  elementTitleLarge: css`
    font-size: calc(${theme.typography.h1.fontSize} * 2);
  `,
  elementStatusContainer: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    transition: all 0.3s ease;
  `,
  statusIndicator: css`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.3s ease;
  `,
  statusIndicatorLarge: css`
    width: 24px;
    height: 24px;
  `,
  statusIndicatorSuccess: css`
    background: ${theme.colors.success.main};
    box-shadow: 0 0 8px ${theme.colors.success.transparent};
  `,
  statusIndicatorWarning: css`
    background: ${theme.colors.warning.main};
    box-shadow: 0 0 8px ${theme.colors.warning.transparent};
  `,
  statusIndicatorFailed: css`
    background: ${theme.colors.error.main};
    box-shadow: 0 0 8px ${theme.colors.error.transparent};
  `,
  statusIndicatorRunning: css`
    background: ${theme.colors.success.main};
    box-shadow: 0 0 8px ${theme.colors.success.transparent};
  `,
  statusIndicatorOnline: css`
    background: ${theme.colors.success.main};
    box-shadow: 0 0 8px ${theme.colors.success.transparent};
  `,
  fieldsContainer: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
    animation: fadeIn 0.3s ease-in-out;
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  fieldsContainerSimplified: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(4)};
    margin-top: ${theme.spacing(4)};
    animation: fadeIn 0.3s ease-in-out;
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  statusContainer: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1)};
  `,
  statusDot: css`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  `,
  statusDotSuccess: css`
    background: ${theme.colors.success.main};
  `,
  statusDotWarning: css`
    background: ${theme.colors.warning.main};
  `,
  statusDotFailed: css`
    background: ${theme.colors.error.main};
  `,
  statusDotRunning: css`
    background: ${theme.colors.success.main};
  `,
  statusDotOnline: css`
    background: ${theme.colors.success.main};
  `,
  textField: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    font-size: ${theme.typography.body.fontSize};
  `,
  fieldLabel: css`
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
  `,
  tagsContainer: css`
    max-width: 600px;
  `,
  tagsHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  `,
  tagsGrid: css`
    display: flex;
    gap: ${theme.spacing(0.5)};
    flex-wrap: wrap;
  `,
  keyValueContainer: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
  `,
  keyValueGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.spacing(0.5)};
  `,
  keyValuePair: css`
    font-size: ${theme.typography.body.fontSize};
  `,
  keyValueKey: css`
    color: ${theme.colors.text.secondary};
  `,
  progressContainer: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
  progressSimplified: css`
    gap: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(1)};
  `,
  progressHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  progressLabel: css`
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeightMedium};
    font-size: ${theme.typography.body.fontSize};
  `,
  progressLabelLarge: css`
    font-size: ${theme.typography.h4.fontSize};
  `,
  progressValue: css`
    font-size: ${theme.typography.body.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    padding-left: ${theme.spacing(2)};
  `,
  progressValueLarge: css`
    font-size: ${theme.typography.h4.fontSize};
    padding-left: ${theme.spacing(3)};
  `,
  progressSuccess: css`
    color: ${theme.colors.success.text};
  `,
  progressWarning: css`
    color: ${theme.colors.warning.text};
  `,
  progressDanger: css`
    color: ${theme.colors.error.text};
  `,
  progressBar: css`
    width: 100%;
    background: ${theme.colors.background.canvas};
    border-radius: ${theme.shape.radius.default};
    height: 12px;
    overflow: hidden;
  `,
  progressBarLarge: css`
    height: 20px;
  `,
  progressFill: css`
    height: 100%;
    border-radius: ${theme.shape.radius.default};
    transition: all 0.3s ease;
  `,
  progressFillSuccess: css`
    background: ${theme.colors.success.main};
  `,
  progressFillWarning: css`
    background: ${theme.colors.warning.main};
  `,
  progressFillDanger: css`
    background: ${theme.colors.error.main};
  `,
  blocksSection: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
  `,
  linksSeparator: css`
    flex-grow: 1;
    min-height: 20px;
    border-top: 1px solid ${theme.colors.border.weak};
    margin-top: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(2)};
  `,
  linksContainer: css`
    margin-top: auto;
    padding-top: ${theme.spacing(3)};
    border-top: 1px solid ${theme.colors.border.weak};
    animation: fadeIn 0.3s ease-in-out;
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  linksGrid: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(2)};
  `,
  linkButton: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
    box-shadow: ${theme.shadows.z1};
    padding: ${theme.spacing(2, 3)};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${theme.colors.emphasize(theme.colors.background.secondary, 0.03)};
      border-color: ${theme.colors.border.strong};
      box-shadow: ${theme.shadows.z2};
    }
    
    &:active {
      transform: translateY(1px);
    }
  `,
  linkButtonContent: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
  `,
  linkIconContainer: css`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.canvas};
    border-radius: 50%;
  `,
  linkIcon: css`
    width: 24px;
    height: 24px;
    object-fit: contain;
  `,
  linkLabel: css`
    font-size: ${theme.typography.h6.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  externalLinkIcon: css`
    width: 16px;
    height: 16px;
    color: ${theme.colors.text.secondary};
    margin-left: ${theme.spacing(1)};
  `,
  panelPreviewContainer: css`
    cursor: pointer;
    border-radius: ${theme.shape.radius.default};
    overflow: hidden;
    transition: all 0.2s ease;
    margin-bottom: ${theme.spacing(2)};
  `,
  panelPreviewImage: css`
    width: 100%;
    height: auto;
    display: block;
    border-radius: ${theme.shape.radius.default};
  `,
  panelPreviewPlaceholder: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(4)};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing(2)};
  `,
  loadingIcon: css`
    height: 16px;
    width: 16px;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  errorIcon: css`
    height: 16px;
    width: 16px;
    color: ${theme.colors.error.text};
  `,
})
