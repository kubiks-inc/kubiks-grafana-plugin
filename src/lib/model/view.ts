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

export interface DashboardElementSource {
  panelId: string
  dashboardUid: string
}

export interface LayoutItem {
  type: 'title' | 'parentId' | 'text' | 'tags' | 'keyValue' | 'progress' | 'inversed_progress' | 'blocks' | 'links' | 'icon' | 'status' | 'panel'
  source?: QueryElementSource | DashboardElementSource
  sourceType?: 'query' | 'value' | 'dashboard'
  field?: string
  label?: string
  value?: { data: number | string | object }
}

export interface Record {
  component: string
  icon: string
  id: string
  key: string
  layout: LayoutItem[]
  layoutSpec: Element
  parentId: string
  type: string
}