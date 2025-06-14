import { DataQuery } from '@grafana/data';

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
export const getQueryOptions = (queries: DataQuery[] = []): QueryOption[] => {
    if (!queries || queries.length === 0) {
        return [{ label: 'No queries available', value: '', description: 'Add queries in the Query tab' }];
    }

    return queries.map((query, index) => ({
        label: query.refId || `Query ${index + 1}`,
        value: query.refId || `query-${index}`,
        description: getQueryDescription(query),
    }));
};

/**
 * Gets a readable description for a query
 * @param query - The query object
 * @returns A description string for the query
 */
const getQueryDescription = (query: DataQuery): string => {
    // Try to extract meaningful info from the query
    if ('expr' in query && query.expr) {
        return `Prometheus: ${String(query.expr).substring(0, 50)}${String(query.expr).length > 50 ? '...' : ''}`;
    }

    if ('rawSql' in query && query.rawSql) {
        return `SQL: ${String(query.rawSql).substring(0, 50)}${String(query.rawSql).length > 50 ? '...' : ''}`;
    }

    if ('query' in query && query.query) {
        return `${String(query.query).substring(0, 50)}${String(query.query).length > 50 ? '...' : ''}`;
    }

    // Fallback to datasource info
    if (query.datasource) {
        const dsName = typeof query.datasource === 'string' ? query.datasource : query.datasource.type || 'Unknown';
        return `${dsName} query`;
    }

    return 'Query';
};

/**
 * Validates if a query reference exists in the available queries
 * @param refId - The reference ID to validate
 * @param queries - Available queries
 * @returns Whether the reference is valid
 */
export const isValidQueryRef = (refId: string, queries: DataQuery[] = []): boolean => {
    if (!refId || !queries.length) {
        return false;
    }

    return queries.some(query => query.refId === refId);
};

/**
 * Gets query by reference ID
 * @param refId - The reference ID
 * @param queries - Available queries
 * @returns The query object or undefined
 */
export const getQueryByRef = (refId: string, queries: DataQuery[] = []): DataQuery | undefined => {
    return queries.find(query => query.refId === refId);
}; 