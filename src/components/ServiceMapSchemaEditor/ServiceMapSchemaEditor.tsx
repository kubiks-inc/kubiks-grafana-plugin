import React, { useEffect, useRef, useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Button, Field, useStyles2, Alert } from '@grafana/ui';
import * as monaco from 'monaco-editor';
import { testIds } from '../testIds';

interface ServiceMapSchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean, errors: string[]) => void;
  onSave?: (value: string) => void;
}

const ServiceMapSchemaEditor: React.FC<ServiceMapSchemaEditorProps> = ({
  value,
  onChange,
  onValidate,
  onSave,
}) => {
  const s = useStyles2(getStyles);
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const validateSchema = useCallback((schemaValue: string) => {
    const errors: string[] = [];
    let valid = true;

    try {
      JSON.parse(schemaValue);
      setIsValid(true);
      if (onValidate) {
        onValidate(true, []);
      }
    } catch (e) {
      errors.push('Invalid JSON format');
      valid = false;
    }

    setValidationErrors(errors);
    setIsValid(valid);
    if (onValidate) {
      onValidate(valid, errors);
    }
  }, [onValidate]);

  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      // Configure Monaco editor theme to match Grafana
      monaco.editor.defineTheme('grafana-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1a1a1a',
          'editor.foreground': '#d4d4d8',
          'editorLineNumber.foreground': '#6b7280',
          'editor.selectionBackground': '#374151',
          'editor.inactiveSelectionBackground': '#374151',
        },
      });

      monaco.editor.defineTheme('grafana-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#374151',
          'editorLineNumber.foreground': '#9ca3af',
          'editor.selectionBackground': '#e5e7eb',
          'editor.inactiveSelectionBackground': '#e5e7eb',
        },
      });

      // Create the editor instance
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: value || getDefaultSchema(),
        language: 'json',
        theme: 'grafana-dark', // You might want to detect theme from Grafana context
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
        folding: true,
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        wordWrap: 'on',
        contextmenu: true,
        mouseWheelZoom: true,
        formatOnPaste: true,
        formatOnType: true,
      });

      // Listen for content changes
      monacoRef.current.onDidChangeModelContent(() => {
        if (monacoRef.current) {
          const newValue = monacoRef.current.getValue();
          onChange(newValue);
          validateSchema(newValue);
        }
      });

      // Initial validation
      validateSchema(value || getDefaultSchema());
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
        monacoRef.current = null;
      }
    };
  }, [onChange, validateSchema, value]);

  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value || getDefaultSchema());
    }
  }, [value]);

  const formatSchema = () => {
    if (monacoRef.current) {
      monacoRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const resetToDefault = () => {
    const defaultSchema = getDefaultSchema();
    if (monacoRef.current) {
      monacoRef.current.setValue(defaultSchema);
    }
    onChange(defaultSchema);
  };

  const handleSave = () => {
    if (isValid && monacoRef.current) {
      const currentValue = monacoRef.current.getValue();
      onSave?.(currentValue);
    }
  };

  return (
    <div className={s.container}>
      <Field
        label="Service Map Schema"
        description="Define the structure of your service map using JSON schema format"
      >
        <div className={s.editorContainer}>
          <div className={s.editorActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={formatSchema}
              data-testid={testIds.serviceMapSchemaEditor.formatButton}
            >
              Format JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetToDefault}
              data-testid={testIds.serviceMapSchemaEditor.resetButton}
            >
              Reset to Default
            </Button>
            {onSave && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!isValid}
                data-testid={testIds.serviceMapSchemaEditor.saveButton}
              >
                Save Schema
              </Button>
            )}
          </div>
          <div
            ref={editorRef}
            className={s.editor}
            data-testid={testIds.serviceMapSchemaEditor.editor}
          />
        </div>
      </Field>

      {!isValid && validationErrors.length > 0 && (
        <Alert
          title="Schema Validation Error"
          severity="error"
          data-testid={testIds.serviceMapSchemaEditor.validationError}
        >
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {isValid && (
        <Alert
          title="Schema Valid"
          severity="success"
          data-testid={testIds.serviceMapSchemaEditor.validationSuccess}
        >
          Your service map schema is valid and ready to use.
        </Alert>
      )}
    </div>
  );
};

const getDefaultSchema = () => {
  return JSON.stringify({
    version: "1.0",
    elements: [
      {
        name: "frontend",
        type: "web",
        description: "Frontend web application",
        metrics: {
          requests_per_second: "sum(rate(http_requests_total[5m]))",
          error_rate: "sum(rate(http_requests_total{status=~\"5..\"}[5m]))",
          response_time: "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))"
        }
      },
      {
        name: "api",
        type: "service",
        description: "Backend API service",
        metrics: {
          requests_per_second: "sum(rate(api_requests_total[5m]))",
          error_rate: "sum(rate(api_requests_total{status=~\"5..\"}[5m]))",
          response_time: "histogram_quantile(0.95, sum(rate(api_request_duration_seconds_bucket[5m])) by (le))"
        }
      },
      {
        name: "database",
        type: "database",
        description: "Primary database",
        metrics: {
          connections: "pg_stat_database_numbackends",
          query_time: "pg_stat_statements_mean_time",
          active_queries: "pg_stat_activity_count"
        }
      }
    ],
    connections: [
      {
        from: "frontend",
        to: "api",
        type: "http",
        description: "Frontend calls to API"
      },
      {
        from: "api",
        to: "database",
        type: "sql",
        description: "API database queries"
      }
    ]
  }, null, 2);
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    margin-bottom: ${theme.spacing(2)};
  `,
  editorContainer: css`
    border: 1px solid ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
    overflow: hidden;
  `,
  editorActions: css`
    display: flex;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(1)};
    background: ${theme.colors.background.secondary};
    border-bottom: 1px solid ${theme.colors.border.medium};
  `,
  editor: css`
    height: 400px;
    width: 100%;
  `,
});

export default ServiceMapSchemaEditor; 
