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
                const layoutQueryResult = dataFrames.filter((frame: DataFrame) => frame.refId === layoutItem.source)
                //correlate layoutQueryResult with queryResults
                const result = layoutQueryResult.filter((series: DataFrame) => {
                    return series.fields?.[1]?.labels?.['service_name'] === record?.fields?.[1]?.labels?.['service_name']
                })
                if (result.length > 0) {
                    layoutItems.push({
                        "type": layoutItem.type,
                        "value": {
                            "data": result[0].fields[1].values[0]
                        }
                    })
                }
                break;
        }
    }
    return layoutItems
}

export const generateRecords = (elements: Element[], dataFrames: DataFrame[]): Record[] => {
    const records = []

    for (const element of elements) {
        if (element?.source) {
            let queryResults = dataFrames.filter((frame: DataFrame) => frame.refId === element.source)
            if (queryResults.length > 0) {
                const queryRecords = queryResults.map((series: DataFrame) => {
                    const layoutItems = generateLayoutItems(element, dataFrames, series)
                    return {
                        component: element.type,
                        icon: getIcon(element) || "",
                        id: series.fields?.[1]?.labels?.['service_name'],
                        key: series.fields?.[1]?.labels?.['service_name'],
                        layout: layoutItems,
                        layoutSpec: element,
                        parentId: "",
                        type: ""
                    }
                })
                records.push(...queryRecords)
            } else {
                queryResults = dataFrames.filter((frame: DataFrame) => frame.meta?.preferredVisualisationType === element.source)
                const queryRecords = queryResults[1].fields[1].values.map((target: string, index: number) => {
                    // const layoutItems = generateLayoutItems(element, dataFrames, series)
                    return {
                        component: element.type,
                        icon: getIcon(element) || "",
                        id: crypto.randomUUID(),
                        key: crypto.randomUUID(),
                        layout: [
                            {
                                "type": "to",
                                "value": {
                                    "data": target
                                },
                            },
                            {
                                "type": "from",
                                "value": {
                                    "data": queryResults[1].fields[2].values[index]
                                },
                            }
                        ],
                        layoutSpec: element,
                        parentId: "",
                        type: ""
                    }
                })
                records.push(...queryRecords)
            }
        } else {
            records.push({
                component: element.type,
                icon: getIcon(element) || "",
                id: element.name,
                key: element.name,
                layout: generateLayoutItems(element, dataFrames, null),
                layoutSpec: element,
                parentId: "",
                type: ""
            })
        }
    }

    return records
}