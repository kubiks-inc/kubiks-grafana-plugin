import { DataFrame, Field } from "@grafana/data";
import { DashboardElementSource, DashboardElementValue, Element, LayoutItem, LayoutItemType, QueryElementSource } from "./model/view";
import { Record } from "./model/view";

const getIcon = (element: Element): string | null => {
    for (const layoutItem of element.layout ?? []) {
        if (layoutItem.type === 'icon') {
            return layoutItem.value?.data as string
        }
    }
    return null
}

const JOIN_KEY = 'service_name'

const generateLayoutItems = (layout: LayoutItem[], dataFrames: DataFrame[], joinKey: string | null): LayoutItem[] => {
    const layoutItems: LayoutItem[] = []

    for (const layoutItem of layout) {
        switch (layoutItem.sourceType) {
            case 'value':
                layoutItems.push({
                    type: layoutItem.type as LayoutItemType,
                    value: layoutItem.value,
                    icon: layoutItem.icon,
                    label: layoutItem.label
                })
                break;
            case 'dashboard':
                const dashboard = {
                    type: 'panel' as LayoutItemType,
                    value: {
                        data: {
                            source: layoutItem.source as DashboardElementSource,
                            variables: new Map<string, string>()
                        }
                    },
                    label: layoutItem.label,
                    icon: layoutItem.icon,
                }

                for (const variable of layoutItem.panelVariableMappings ?? []) {
                    const variableResult = dataFrames.filter((frame: DataFrame) => frame.refId === variable.queryRef)
                    const variableResultValue = variableResult.find((series: DataFrame) => {
                        return series.fields?.[1]?.labels?.[JOIN_KEY] === joinKey
                    })

                    if (variableResultValue) {
                        dashboard.value.data.variables.set(variable.panelVariable, variableResultValue.fields[1].labels?.[variable.field] as string)
                    }
                }

                if (dashboard.value.data.variables.size > 0) {
                    console.log('dashboard', dashboard)
                }

                layoutItems.push(dashboard)
                break;
            case 'query':
                const ref = layoutItem.source as QueryElementSource
                const layoutQueryResult = dataFrames.filter((frame: DataFrame) => frame.refId === ref?.queryRef)
                //correlate layoutQueryResult with queryResults
                const result = layoutQueryResult.filter((series: DataFrame) => {
                    return series.fields?.[1]?.labels?.[JOIN_KEY] === joinKey
                })

                if (result.length > 0 && layoutItem.field) {
                    if (layoutItem.field === 'value') {
                        layoutItems.push({
                            type: layoutItem.type as LayoutItemType,
                            label: layoutItem.label,
                            icon: layoutItem.icon,
                            value: {
                                data: result[0].fields[1].values[0]
                            }
                        })
                    } else {
                        layoutItems.push({
                            type: layoutItem.type as LayoutItemType,
                            label: layoutItem.label,
                            icon: layoutItem.icon,
                            value: {
                                data: result[0].fields[1].labels?.[layoutItem.field] || ''
                            }
                        })
                    }
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
                    const layoutItems = generateLayoutItems(element.layout ?? [], dataFrames, series?.fields?.[1]?.labels?.[JOIN_KEY] as string)
                    return {
                        component: element.type,
                        icon: getIcon(element) || "",
                        id: series.fields?.[1]?.labels?.[JOIN_KEY],
                        key: series.fields?.[1]?.labels?.[JOIN_KEY],
                        layout: layoutItems,
                        layoutSpec: element,
                    }
                })
                records.push(...queryRecords)
            } else {
                const queryRecords = extractRecordsFromNodeGraph(dataFrames, element)
                records.push(...queryRecords)
            }
        } else {
            records.push({
                component: element.type,
                icon: getIcon(element) || "",
                id: element.name,
                key: element.name,
                layout: generateLayoutItems(element.layout ?? [], dataFrames, null),
                layoutSpec: element,
            })
        }
    }

    console.log('records', records)

    return records
}

const extractRecordsFromNodeGraph = (dataFrames: DataFrame[], element: Element): Record[] => {
    switch (element.type) {
        case 'element':
            const queryResults = dataFrames.filter((frame: DataFrame) => frame.meta?.preferredVisualisationType === element.source)
            const dataFrame = queryResults.find((frame: DataFrame) => frame.fields?.find((field: Field) => field.name === 'title'))
            const values = dataFrame?.fields.find((field: Field) => field.name === 'title')?.values
            const queryRecords = values?.map((title: string, index: number): Record => {
                return {
                    component: element.type,
                    icon: getIcon(element) || "",
                    id: title,
                    key: title,
                    layout: [
                        {
                            type: 'title' as LayoutItemType,
                            value: {
                                data: title
                            }
                        },
                        ...generateLayoutItems(element.layout ?? [], dataFrames, title),
                    ],
                    details: [
                        {
                            type: 'title' as LayoutItemType,
                            value: {
                                data: title
                            }
                        },
                        ...generateLayoutItems(element.details ?? [], dataFrames, title),
                    ],
                    layoutSpec: element,
                } as Record
            })
            return queryRecords || []
        case 'connection':
            const connectionDataFrame = dataFrames.find((frame: DataFrame) => frame.fields?.find((field: Field) => field.name === 'source'))
            const sourceValues = connectionDataFrame?.fields.find((field: Field) => field.name === 'source')?.values
            const targetValues = connectionDataFrame?.fields.find((field: Field) => field.name === 'target')?.values
            const connectionRecords = sourceValues?.map((source: string, index: number) => {
                return {
                    component: element.type,
                    icon: getIcon(element) || "",
                    id: crypto.randomUUID(),
                    key: crypto.randomUUID(),
                    layout: [
                        {
                            type: "to" as LayoutItemType,
                            value: {
                                data: targetValues?.[index]
                            },
                        },
                        {
                            type: "from" as LayoutItemType,
                            value: {
                                data: source
                            },
                        }
                    ],
                    layoutSpec: element,
                }
            })
            return connectionRecords || []
    }

    return []
}