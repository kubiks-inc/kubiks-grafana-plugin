import React, { useState, useCallback } from 'react'
import {
  Search,
  Command,
} from 'lucide-react'
import { Button, useStyles2, Tooltip } from '@grafana/ui'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { RecordSearch } from '@/components/Canvas/RecordSearch'
import { useViewStore } from '@/store/ViewStoreProvider'
import { getTitle } from '@/components/Canvas/helpers'
// import { saveLayoutPositions } from '@/lib/api/actions/view'

interface CanvasNavbarProps { }

export const CanvasNavbar: React.FC<CanvasNavbarProps> = ({ }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const {
    selectedNode,
    setSelectedNode,
    viewState,
    setLiveMode,
    editLayout,
    setEditLayout,
  } = useViewStore((state) => state)
  const record = viewState?.records?.find((record: any) => record.key === selectedNode)
  const styles = useStyles2(getStyles)

  const handleSaveLayout = useCallback(async () => {
    console.log('Saving layout changes')


    setEditLayout(false)
    setLiveMode(true)
  }, [setEditLayout, setLiveMode])

  const handleDiscardLayout = () => {
    console.log('Discarding layout changes')
    setEditLayout(false)
    setLiveMode(true)
  }

  return (
    <div className={styles.canvasNavbarContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.leftSection}>
            {selectedNode && (
              <>
                <Tooltip content="Go back">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedNode('')}
                    className={styles.backButton}
                    aria-label="Go back"
                    icon="arrow-left"
                  />
                </Tooltip>
                <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
                  <ol className={styles.breadcrumbList}>
                    <li key={record?.key} className={styles.breadcrumbItem}>
                      <span className={styles.title}>{getTitle(record?.layout)}</span>
                    </li>
                  </ol>
                </nav>
              </>
            )}
          </div>

          {/* Center - Empty space */}
          <div className={styles.centerSection} />

          {/* Right side - Search and Controls */}
          <div className={styles.rightSection}>
            {!editLayout && (
              <div className={styles.searchContainer}>
                <div className={styles.searchIconContainer}>
                  <Search className={styles.searchIcon} />
                </div>
                <div
                  className={styles.searchButton}
                  onClick={() => setSearchOpen(true)}
                >
                  <span className={styles.searchText}>Search records...</span>
                  <div className={styles.keyboardShortcut}>
                    <kbd className={styles.kbd}>
                      <Command className={styles.commandIcon} />F
                    </kbd>
                  </div>
                </div>
              </div>
            )}

            {editLayout && (
              <div className={styles.editLayoutControls}>
                {/* Save/Discard buttons for edit layout mode */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDiscardLayout}
                  icon="times"
                >
                  Discard
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveLayout}
                  icon="save"
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <RecordSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => ({
  canvasNavbarContainer: css`
    position: relative;
  `,
  navbar: css`
    border-bottom: 1px solid ${theme.colors.border.medium};
    background: ${theme.colors.background.primary};
    backdrop-filter: blur(8px);
    position: relative;
    z-index: 50;
  `,
  navbarContent: css`
    display: flex;
    align-items: center;
    padding: 0 ${theme.spacing(2)};
    height: 56px;
    max-width: 100%;
    container: layout / inline-size;
  `,
  leftSection: css`
    display: flex;
    align-items: center;
  `,
  backButton: css`
    margin-right: ${theme.spacing(1)};
  `,
  breadcrumb: css`
    display: flex;
    align-items: center;
    font-size: ${theme.typography.bodySmall.fontSize};
    padding-left: ${theme.spacing(2)};
  `,
  breadcrumbList: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    margin: 0;
    padding: 0;
    list-style: none;
  `,
  breadcrumbItem: css`
    display: flex;
    align-items: center;
  `,
  title: css`
    font-weight: ${theme.typography.fontWeightBold};
    font-size: ${theme.typography.h4.fontSize};
    color: ${theme.colors.text.primary};
  `,
  centerSection: css`
    flex: 1;
  `,
  rightSection: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
  searchContainer: css`
    position: relative;
    width: 256px;
  `,
  searchIconContainer: css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: ${theme.spacing(1.5)};
    pointer-events: none;
  `,
  searchIcon: css`
    height: 16px;
    width: 16px;
    color: ${theme.colors.text.secondary};
  `,
  searchButton: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 36px;
    border-radius: ${theme.shape.radius.default};
    border: 1px solid ${theme.colors.border.medium};
    background: ${theme.colors.background.primary};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    font-size: ${theme.typography.bodySmall.fontSize};
    box-shadow: ${theme.shadows.z1};
    transition: all 0.2s ease;
    padding-left: ${theme.spacing(4.5)};
    
    &:hover {
      background: ${theme.colors.background.secondary};
      color: ${theme.colors.text.primary};
    }
  `,
  searchText: css`
    color: ${theme.colors.text.secondary};
  `,
  keyboardShortcut: css`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.5)};
  `,
  kbd: css`
    display: flex;
    height: 20px;
    align-items: center;
    gap: ${theme.spacing(0.5)};
    border-radius: ${theme.shape.radius.default};
    border: 1px solid ${theme.colors.border.medium};
    background: ${theme.colors.background.secondary};
    padding: 0 ${theme.spacing(0.75)};
    font-size: 10px;
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.secondary};
  `,
  commandIcon: css`
    height: 12px;
    width: 12px;
  `,
  editLayoutControls: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
})

export default CanvasNavbar
