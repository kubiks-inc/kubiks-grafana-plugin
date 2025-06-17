import { DataFrame } from '@grafana/data';

export interface QueryReference {
    refId: string;
    alias?: string;
    datasource?: string;
}

export interface QueryOption {
    label: string;
    value: string;
    description?: string;
}

/**
 * Fetches available queries from the current panel context
 * @param queries - Array of queries from the panel
 * @returns Array of query options for dropdown selection
 */
export const getQueryOptions = (queries: string[] = []): QueryOption[] => {
    if (!queries || queries.length === 0) {
        return [{ label: 'No queries available', value: '', description: 'Add queries in the Query tab' }];
    }

    return queries.map((query, index) => ({
        label: query,
        value: query,
        description: getQueryDescription(query),
    }));
};

/**
 * Gets a readable description for a query
 * @param query - The query object
 * @returns A description string for the query
 */
const getQueryDescription = (query: string): string => {
    return '';
};

/**
 * Validates if a query reference exists in the available queries
 * @param refId - The reference ID to validate
 * @param queries - Available queries
 * @returns Whether the reference is valid
 */
export const isValidQueryRef = (refId: string, queries: string[] = []): boolean => {
    if (!refId || !queries.length) {
        return false;
    }

    return queries.some(query => query === refId);
};

/**
 * Gets query by reference ID
 * @param refId - The reference ID
 * @param queries - Available queries
 * @returns The query object or undefined
 */
export const getQueryByRef = (refId: string, queries: string[] = []): string | undefined => {
    return queries.find(query => query === refId);
};

/**
 * Gets field options from a query by extracting label keys
 * @param query - The query object
 * @returns Array of field options for dropdown selection
 */
export const getFieldOptionsFromQuery = (query: string, data: DataFrame[]): QueryOption[] => {
    if (!query) {
        return [{ label: 'No query selected', value: '' }];
    }

    const fieldOptions: QueryOption[] = [
        { label: 'value', value: 'value', description: 'Metric value' },
    ];
    const record = data.find(d => d.refId === query);

    const valueField = record?.fields?.find(f => f.name === 'Value');
    if (valueField) {
        fieldOptions.push(...Object.keys(valueField.labels || {}).map((l: string) => ({
            label: l,
            value: l,
            description: 'Metric label'
        })));
    }

    return fieldOptions;
}; 
