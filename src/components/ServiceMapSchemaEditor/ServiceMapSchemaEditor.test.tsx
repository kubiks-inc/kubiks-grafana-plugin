import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceMapSchemaEditor from './ServiceMapSchemaEditor';
import { testIds } from '../testIds';

// Mock Monaco editor since it's complex to test in Jest
jest.mock('monaco-editor', () => ({
  editor: {
    create: jest.fn(() => ({
      onDidChangeModelContent: jest.fn(),
      getValue: jest.fn(() => '{"version": "1.0", "services": []}'),
      setValue: jest.fn(),
      dispose: jest.fn(),
      getAction: jest.fn(() => ({ run: jest.fn() })),
    })),
    defineTheme: jest.fn(),
  },
}));

describe('ServiceMapSchemaEditor', () => {
  const mockOnChange = jest.fn();
  const mockOnValidate = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <ServiceMapSchemaEditor
        value=""
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    expect(screen.getByText('Service Map Schema')).toBeInTheDocument();
    expect(screen.getByText('Define the structure of your service map using JSON schema format')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(
      <ServiceMapSchemaEditor
        value=""
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    expect(screen.getByTestId(testIds.serviceMapSchemaEditor.formatButton)).toBeInTheDocument();
    expect(screen.getByTestId(testIds.serviceMapSchemaEditor.resetButton)).toBeInTheDocument();
  });

  it('renders editor container', () => {
    render(
      <ServiceMapSchemaEditor
        value=""
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    expect(screen.getByTestId(testIds.serviceMapSchemaEditor.editor)).toBeInTheDocument();
  });

  it('renders save button when onSave prop is provided', () => {
    render(
      <ServiceMapSchemaEditor
        value=""
        onChange={mockOnChange}
        onValidate={mockOnValidate}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByTestId(testIds.serviceMapSchemaEditor.saveButton)).toBeInTheDocument();
  });

  it('does not render save button when onSave prop is not provided', () => {
    render(
      <ServiceMapSchemaEditor
        value=""
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    expect(screen.queryByTestId(testIds.serviceMapSchemaEditor.saveButton)).not.toBeInTheDocument();
  });
}); 
