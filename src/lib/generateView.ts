import { DataFrame } from "@grafana/data";

export const generateRecords = (elements: Element[], dataFrames: DataFrame[]) => {
    const records = []

    for (const element of elements) {
        const queryRef = element.source
        const queryResults = dataFrames.filter((frame: DataFrame) => frame.refId === queryRef)
        if (queryResults) {
            const queryRecords = queryResults.map((series: DataFrame, index: number) => {
                return {
                    "component": "element_component",
                    "icon": "/icons/cloudflare.svg",
                    "id": index.toString(),
                    "key": index.toString(),
                    "layout": [
                        {
                            "label": "",
                            "selector": ".value.metadata.name",
                            "selectorType": "record",
                            "type": "title",
                            "value": {
                                "data": series.fields[1].labels['service_name']
                            },
                        },
                    ],
                    "parentId": "",
                    "type": ""
                }
            })
            records.push(...queryRecords)
        }
    }

    return records
}