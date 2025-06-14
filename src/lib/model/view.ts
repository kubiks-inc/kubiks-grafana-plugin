export interface ViewSource {
  integrationId: number
  recordType: string
  join: ViewSource[]
  operator?: string
  condition?: Condition[]
}

export interface Condition {
  field: string
  operator: string
  value: any
}

export interface Selector {
  data: string
}

export interface Element {
  name: string;
  type: 'group' | 'element';
  source?: string; // Query reference ID
  layout?: LayoutItem[]; // Array of configurable layout items
}

export interface LayoutItem {
  type: 'title' | 'parentId' | 'text' | 'tags' | 'keyValue' | 'progress' | 'inversed_progress' | 'blocks' | 'links' | 'icon' | 'status'
  source?: string // Query reference
  sourceMode?: 'query' | 'manual' // Mode for source selection
  selector?: Selector
  label?: string
  value?: { data: number | string | object }
}

export interface ViewElement {
  source?: ViewSource
  component: string
  color: string
  layoutId: string
  parentId: string
  order: number
  id: string
}

export interface LayoutMetadata {
  layout: LayoutItem[]
  id: string
}

export interface ViewDefinition {
  layouts: LayoutMetadata[]
  elements: ViewElement[]
}

export interface View {
  id: number
  name: string
  description: string
  type: string
  organizationId: string
  metadata: ViewDefinition
  createdAt: string
  updatedAt: string
  snapshotsEnabled: boolean
  layoutType: string
}
