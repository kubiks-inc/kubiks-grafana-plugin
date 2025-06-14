import { DataFrame } from '@grafana/data';
import { Element, LayoutItem } from '../../lib/model/view';

export interface BaseLayoutItemProps {
    layoutItem: LayoutItem;
    elementIndex: number;
    layoutIndex: number;
    element: Element;
    elements: Element[];
    queries: string[];
    data: DataFrame[];
    onUpdateLayoutItem: (elementIndex: number, layoutIndex: number, updates: Partial<LayoutItem>) => void;
    onRemoveLayoutItem: (elementIndex: number, layoutIndex: number) => void;
}

export interface DashboardOption {
    label: string;
    value: string;
}

export interface PanelOption {
    label: string;
    value: string;
} 