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

/**
 * Gets field options from a query
 * @param query - The query object
 * @returns Array of field options for dropdown selection
 */
export const getFieldOptionsFromQuery = (query: DataQuery): QueryOption[] => {
    if (!query) {
        return [{ label: 'No query selected', value: '' }];
    }

    const fieldOptions: QueryOption[] = [];

    // For Prometheus queries, extract common field names
    if ('expr' in query && query.expr) {
        // Common Prometheus fields
        fieldOptions.push(
            { label: 'Value', value: 'value', description: 'Query result value' },
            { label: 'Timestamp', value: 'timestamp', description: 'Query result timestamp' },
            { label: 'Metric Name', value: '__name__', description: 'Metric name' }
        );

        // Try to extract label names from the query expression
        const labelMatches = String(query.expr).match(/\{([^}]+)\}/g);
        if (labelMatches) {
            labelMatches.forEach(match => {
                const labels = match.slice(1, -1).split(',');
                labels.forEach(label => {
                    const [key] = label.trim().split(/[=!~]/);
                    if (key && !fieldOptions.some(opt => opt.value === key)) {
                        fieldOptions.push({ label: key, value: key, description: `Label: ${key}` });
                    }
                });
            });
        }
    }

    // For SQL queries, common fields
    if ('rawSql' in query && query.rawSql) {
        // Try to extract SELECT fields from SQL query
        const sqlQuery = String(query.rawSql).toLowerCase();
        const selectMatch = sqlQuery.match(/select\s+(.+?)\s+from/);
        if (selectMatch) {
            const selectClause = selectMatch[1];
            if (selectClause !== '*') {
                const fields = selectClause.split(',').map(field => field.trim());
                fields.forEach(field => {
                    // Remove aliases and functions to get basic field name
                    const cleanField = field.replace(/\s+as\s+\w+/i, '').replace(/\w+\(([^)]+)\)/, '$1').trim();
                    if (cleanField && !fieldOptions.some(opt => opt.value === cleanField)) {
                        fieldOptions.push({ label: cleanField, value: cleanField, description: `Field: ${cleanField}` });
                    }
                });
            }
        }

        // Add common SQL result fields
        fieldOptions.push(
            { label: 'Value', value: 'value', description: 'Query result value' },
            { label: 'Time', value: 'time', description: 'Query result time' }
        );
    }

    // For other query types, add generic options
    if (fieldOptions.length === 0) {
        fieldOptions.push(
            { label: 'Value', value: 'value', description: 'Query result value' },
            { label: 'Time', value: 'time', description: 'Query result time' },
            { label: 'Text', value: 'text', description: 'Text field' },
            { label: 'Label', value: 'label', description: 'Label field' }
        );
    }

    return fieldOptions;
}; 