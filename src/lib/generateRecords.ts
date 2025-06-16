import { DataFrame } from "@grafana/data";
import { Element } from "./model/view";
import { Record } from "./model/view";

const getIcon = (element: Element) => {
    for (const layoutItem of element.layout ?? []) {
        if (layoutItem.type === 'icon') {
            return layoutItem.value?.data
        }
    }
    return null
}

const generateLayoutItems = (element: Element, dataFrames: DataFrame[], record: DataFrame | null) => {
    const layoutItems = []

    for (const layoutItem of element.layout ?? []) {
        switch (layoutItem.sourceType) {
            case 'value':
                layoutItems.push({
                    "type": layoutItem.type,
                    "value": layoutItem.value
                })
                break;
            case 'dashboard':
                layoutItems.push({
                    "type": layoutItem.type,
                    "value": layoutItem.source,
                })
                break;
            case 'query':
                const layoutItemValue = record?.fields?.[1]?.labels?.['service_name']
                layoutItems.push({
                    "type": layoutItem.type,
                    "value": {
                        "data": layoutItemValue
                    }
                })
                break;
        }
    }
    return layoutItems
}

export const generateRecords = (elements: Element[], dataFrames: DataFrame[]): Record[] => {
    const records = []

    for (const element of elements) {
        if (element?.source) {
            const queryResults = dataFrames.filter((frame: DataFrame) => frame.refId === element.source)
            const queryRecords = queryResults.map((series: DataFrame) => {
                const layoutItems = generateLayoutItems(element, dataFrames, series)
                return {
                    "component": element.type,
                    "icon": getIcon(element),
                    "id": crypto.randomUUID(),
                    "key": crypto.randomUUID(),
                    "layout": layoutItems,
                    "layoutSpec": element,
                    "parentId": "",
                    "type": ""
                } as Record
            })
            records.push(...queryRecords)
        } else {
            records.push({
                "component": element.type,
                "icon": getIcon(element),
                "id": element.name,
                "key": element.name,
                "layout": generateLayoutItems(element, dataFrames, null),
                "layoutSpec": element,
                "parentId": "",
                "type": ""
            } as Record)
        }
    }

    return records
}