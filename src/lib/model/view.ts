export interface Element {
  name: string;
  type: 'group' | 'element' | 'connection';
  source?: string;
  layout?: LayoutItem[];
  details?: LayoutItem[];
}

export interface QueryElementSource {
  queryRef: string
}

export interface DashboardElementValue {
  source: DashboardElementSource
  variables: Map<string, string>
}

export interface DashboardElementSource {
  panelId: string
  dashboardUid: string
}

export interface PanelVariableMapping {
  panelVariable: string
  queryRef: string
  field: string
}

export type LayoutItemType = 'title' | 'parentId' | 'text' | 'tags' | 'keyValue' | 'progress' | 'inversed_progress' | 'blocks' | 'link' | 'icon' | 'status' | 'panel' | 'from' | 'to'

export interface LayoutItem {
  type: LayoutItemType
  source?: QueryElementSource | DashboardElementSource
  sourceType?: 'query' | 'value' | 'dashboard'
  field?: string
  label?: string
  icon?: string
  value?: { data: number | string | object }
  panelVariableMappings?: PanelVariableMapping[]
}

export interface Record {
  component: string
  icon: string
  id: string
  key: string
  layout: LayoutItem[]
  details: LayoutItem[]
  layoutSpec: Element
}