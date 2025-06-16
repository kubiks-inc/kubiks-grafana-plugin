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

export const generateRecords = (elements: Element[], dataFrames: DataFrame[]) => {
    const records = []

    for (const element of elements) {
        const queryRef = element.source
        const queryResults = dataFrames.filter((frame: DataFrame) => frame.refId === queryRef)
        if (queryResults) {
            const queryRecords = queryResults.map((series: DataFrame, index: number) => {
                const layoutItems = []

                for (const layoutItem of element.layout ?? []) {
                    if (layoutItem.source == queryRef) {
                        const layoutItemValue = series.fields[1].labels['service_name']
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
                            return series.fields[1].labels['service_name'] === queryResults[index].fields[1].labels['service_name']
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
        }
    }

    return records
}