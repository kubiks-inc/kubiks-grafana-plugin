import { DataFrame } from "@grafana/data";
import { Element } from "./model/view";

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
        if (layoutItem.sourceMode === 'manual') {
            layoutItems.push({
                "type": layoutItem.type,
                "value": layoutItem.value
            })
        } else if (layoutItem.source == element.source) {
            const layoutItemValue = record?.fields[1].labels['service_name']
            layoutItems.push({
                "type": layoutItem.type,
                "value": {
                    "data": layoutItemValue
                }
            })
        } else {
            const layoutQueryResult = dataFrames.filter((frame: DataFrame) => frame.refId === layoutItem.source)
            //correlate layoutQueryResult with queryResults
            const result = layoutQueryResult.filter((series: DataFrame) => {
                return series.fields[1].labels['service_name'] === record?.fields[1].labels['service_name']
            })
            console.log(layoutQueryResult, result)
            if (result.length > 0) {
                layoutItems.push({
                    "type": layoutItem.type,
                    "value": {
                        "data": result[0].fields[1].values[0]
                    }
                })
            }
        }
    }

    return layoutItems
}

export const generateRecords = (elements: Element[], dataFrames: DataFrame[]) => {
    const records = []

    for (const element of elements) {
        if (element.source) {
            const queryResults = dataFrames.filter((frame: DataFrame) => frame.refId === element.source)
            const queryRecords = queryResults.map((series: DataFrame, index: number) => {
                const layoutItems = generateLayoutItems(element, dataFrames, queryResults[index])
                return {
                    "component": element.type,
                    "icon": getIcon(element),
                    "id": index.toString(),
                    "key": index.toString(),
                    "layout": layoutItems,
                    "parentId": "",
                    "type": ""
                }
            })
            records.push(...queryRecords)
        } else {
            records.push({
                "component": element.type,
                "icon": getIcon(element),
                "id": crypto.randomUUID(),
                "key": crypto.randomUUID(),
                "layout": generateLayoutItems(element, dataFrames, null),
                "parentId": "",
                "type": ""
            })
        }
    }

    return records
}