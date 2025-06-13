import { LayoutItem } from '@/lib/model/view'
import { ViewRecord } from '@/lib/model/record'
export function getTitle(layout: LayoutItem[] | undefined): string {
  const titleItem = layout?.find((item) => item.type === 'title')
  return titleItem?.value?.data as string
}

export function isHiddenBeDefault(layout: LayoutItem[] | undefined): boolean {
  const hiddenItem = layout?.find((item) => item.type === 'hiddenByDefault')
  return (hiddenItem?.value?.data as unknown as boolean) || false
}

export const getParentId = (record: ViewRecord) => {
  const parentIdItem = record.layout?.find((item) => item.type === 'parentId')
  return parentIdItem?.value?.data || (record.parentId as string)
}

export const getParentIdFromLayout = (layout: LayoutItem[] | undefined) => {
  const parentIdItem = layout?.find((item) => item.type === 'parentId')
  return parentIdItem?.value?.data as string
}

export const getExploreLink = (data: LayoutItem[] | undefined) => {
  const linkItems = data?.filter((item) => item.type === 'explore') || []
  return linkItems[0]?.value?.data as string
}

// Time range options for the logs query
export type TimeRange = {
  label: string
  value: number // Minutes
}

export const timeRanges: TimeRange[] = [
  { label: '5 mins', value: 5 },
  { label: '10 mins', value: 10 },
  { label: '15 mins', value: 15 },
  { label: '30 mins', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '3 hours', value: 180 },
  { label: '6 hours', value: 360 },
  { label: '12 hours', value: 720 },
  { label: '24 hours', value: 1440 },
  { label: '2 days', value: 2880 },
  { label: '7 days', value: 10080 },
  { label: '14 days', value: 20160 },
  { label: '30 days', value: 43200 },
]

export function getTimeRangeLabel(timeRange: number | undefined): TimeRange {
  const timeRangeLabel = timeRanges.find((range) => range.value === timeRange)
  return timeRangeLabel || { label: `${timeRange || 0} mins`, value: timeRange || 0 }
}
