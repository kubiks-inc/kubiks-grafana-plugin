import React, { ChangeEvent, useState } from 'react';
import { lastValueFrom } from 'rxjs';
import { css } from '@emotion/css';
import { AppPluginMeta, GrafanaTheme2, PluginConfigPageProps, PluginMeta } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button, Field, FieldSet, Input, useStyles2 } from '@grafana/ui';
import { testIds } from '../testIds';
import ServiceMapSchemaEditor from '../ServiceMapSchemaEditor';

type AppPluginSettings = {
  serviceMapSchema?: string;
};

type State = {
  // The service map schema configuration.
  serviceMapSchema: string;
  // Validation state for service map schema.
  isSchemaValid: boolean;
};

export interface AppConfigProps extends PluginConfigPageProps<AppPluginMeta<AppPluginSettings>> { }

const AppConfig = ({ plugin }: AppConfigProps) => {
  const s = useStyles2(getStyles);
  const { enabled, pinned, jsonData } = plugin.meta;
  const [state, setState] = useState<State>({
    serviceMapSchema: jsonData?.serviceMapSchema || '',
    isSchemaValid: true,
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onSchemaChange = (schema: string) => {
    setState({
      ...state,
      serviceMapSchema: schema,
    });
  };

  const onSchemaValidate = (isValid: boolean) => {
    setState({
      ...state,
      isSchemaValid: isValid,
    });
  };

  const onSchemaSave = async (schema: string) => {
    try {
      await updatePlugin(plugin.meta.id, {
        enabled,
        pinned,
        jsonData: {
          ...jsonData,
          serviceMapSchema: schema,
        },
      });

      setState({
        ...state,
        serviceMapSchema: schema,
      });

    } catch (e) {
      console.error('Error while saving schema', e);
    }
  };

  const onSubmit = () => {
    updatePluginAndReload(plugin.meta.id, {
      enabled,
      pinned,
      jsonData: {
        ...jsonData,
      },
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <FieldSet label="Service Map Configuration">
        <Field label="Service Map Schema" description="The schema for the service map">
          <Input
            width={60}
            name="serviceMapSchema"
            id="config-service-map-schema"
            data-testid={testIds.appConfig.serviceMapSchema}
            value={state.serviceMapSchema}
            placeholder={`E.g.: http://mywebsite.com/api/v1`}
            onChange={onChange}
          />
        </Field>

        <div className={s.marginTop}>
          <Button type="submit" data-testid={testIds.appConfig.submit}>
            Save Service Map Configuration
          </Button>
        </div>
      </FieldSet>

      <FieldSet label="Service Map Configuration" className={s.marginTop}>
        <ServiceMapSchemaEditor
          value={state.serviceMapSchema}
          onChange={onSchemaChange}
          onValidate={onSchemaValidate}
          onSave={onSchemaSave}
        />
      </FieldSet>
    </form>
  );
};

export default AppConfig;

const getStyles = (theme: GrafanaTheme2) => ({
  colorWeak: css`
    color: ${theme.colors.text.secondary};
  `,
  marginTop: css`
    margin-top: ${theme.spacing(3)};
  `,
});

const updatePluginAndReload = async (pluginId: string, data: Partial<PluginMeta<AppPluginSettings>>) => {
  try {
    await updatePlugin(pluginId, data);

    // Reloading the page as the changes made here wouldn't be propagated to the actual plugin otherwise.
    // This is not ideal, however unfortunately currently there is no supported way for updating the plugin state.
    window.location.reload();
  } catch (e) {
    console.error('Error while updating the plugin', e);
  }
};

const updatePlugin = async (pluginId: string, data: Partial<PluginMeta>) => {
  const response = await getBackendSrv().fetch({
    url: `/api/plugins/${pluginId}/settings`,
    method: 'POST',
    data,
  });

  return lastValueFrom(response);
};
