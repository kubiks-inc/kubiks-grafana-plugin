import React from 'react'
// import { Panel } from './view-store'
import { BarChart2, FileText, MousePointer } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useViewStore } from './view-store-provider'

interface NodeContextMenuProps {}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({}) => {
  return null
  // const {
  //   contextMenu,
  //   setSelectedNode,
  //   setContextMenu,
  //   addPanel,
  //   setSelectedPanel,
  //   setPanelViewMode,
  //   setPanelDialogOpen,
  // } = useViewStore((state) => state)

  // const onSelect = () => {
  //   if (contextMenu.nodeId) {
  //     setSelectedNode(contextMenu.nodeId)
  //     setContextMenu({
  //       open: false,
  //       position: { x: 0, y: 0 },
  //       nodeId: undefined,
  //     })
  //   }
  // }

  // const onViewLogs = () => {
  //   const newPanel: Panel = {
  //     id: `panel-${Date.now()}`,
  //     type: 'logs',
  //     metadata: {
  //       searchQuery: '',
  //       selectedTimeRange: 5,
  //     },
  //   }
  //   addPanel(newPanel)
  //   setSelectedPanel(newPanel.id)
  //   setPanelViewMode('detail')
  //   setPanelDialogOpen(true)
  //   setContextMenu({
  //     open: false,
  //     position: { x: 0, y: 0 },
  //     nodeId: undefined,
  //   })
  // }

  // if (!contextMenu.open) return null

  // return (
  //   <div
  //     className="absolute bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-1.5 z-50 min-w-48"
  //     style={{
  //       left: contextMenu.position.x,
  //       top: contextMenu.position.y,
  //     }}
  //     onMouseDown={(e) => e.stopPropagation()}
  //   >
  //     <div className="flex flex-col space-y-0.5">
  //       <Button
  //         variant="ghost"
  //         className="justify-start px-2 py-1.5 text-sm h-auto"
  //         onClick={onSelect}
  //       >
  //         <MousePointer className="w-4 h-4" />
  //         <span>Select Node</span>
  //       </Button>
  //       {/* <Button
  //         variant="ghost"
  //         className="justify-start px-2 py-1.5 text-sm h-auto"
  //         onClick={() => {}}
  //       >
  //         <BarChart2 className="w-4 h-4" />
  //         <span>View Traces</span>
  //       </Button> */}
  //       <Button
  //         variant="ghost"
  //         className="justify-start px-2 py-1.5 text-sm h-auto"
  //         onClick={onViewLogs}
  //       >
  //         <BarChart2 className="w-4 h-4" />
  //         <span>View Logs</span>
  //       </Button>
  //       {/* <Button
  //         variant="ghost"
  //         className="justify-start px-2 py-1.5 text-sm h-auto"
  //         onClick={() => {}}
  //       >
  //         <FileText className="w-4 h-4" />
  //         <span>View Values.yaml</span>
  //       </Button> */}
  //     </div>
  //   </div>
  // )
}
