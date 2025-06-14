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
  type: 'group' | 'element' | 'connection';
  source?: string; // Query reference ID
  layout?: LayoutItem[]; // Array of configurable layout items
  details?: LayoutItem[]; // Array of layout items for details view
}

export interface LayoutItem {
  type: 'title' | 'parentId' | 'text' | 'tags' | 'keyValue' | 'progress' | 'inversed_progress' | 'blocks' | 'links' | 'icon' | 'status' | 'panel'
  source?: string | { panelId: string; dashboardUid: string } // Query reference or dashboard panel reference
  sourceMode?: 'query' | 'manual' | 'dashboard' // Mode for source selection
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
