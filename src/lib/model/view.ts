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