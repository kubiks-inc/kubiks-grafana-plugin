import React from 'react'
import { Record } from '@/lib/model/view'
import { NodeProps, useStore } from '@xyflow/react'
import { memo } from 'react'
import { getTitle } from '@/components/Canvas/helpers'
import { LayoutItem } from '@/lib/model/view'

interface NodeLabelProps extends NodeProps {
  data: {
    record: Record
    onClick: () => void
  }
}

const NodeLabel = ({ data }: NodeLabelProps) => {
  // Get the current zoom level from the store
  const zoom = useStore((state) => state.transform[2])

  // Define text size class based on zoom level
  const textSizeClass = zoom > 0.4 ? 'text-4xl' : 'text-6xl'

  return (
    <div
      className="px-4 py-2 rounded-xl w-full whitespace-nowrap text-center cursor-pointer hover:bg-[#2a2a2e] transition-colors"
      style={{
        backgroundColor: 'rgba(24, 24, 28, 0.9)',
        border: '0.5px solid rgba(60, 60, 65, 0.4)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
      }}
      onClick={data.onClick}
    >
      <span
        className={`font-semibold text-white/90 ${textSizeClass} tracking-tight hover:text-white`}
      >
        {getTitle(data.record.layout as unknown as LayoutItem[])}
      </span>
    </div>
  )
}

export default memo(NodeLabel)
