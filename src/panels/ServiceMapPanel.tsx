import React, { useEffect } from 'react';
import { PanelProps, GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';
import { InfiniteCanvas } from '@/containers/Canvas/InfiniteCanvas';
import { generateRecords } from '../lib/generateRecords';
import { useViewStore, ViewStoreProvider } from '@/store/ViewStoreProvider';
import { ServiceDrawer } from '@/components/Canvas/ServiceDrawer';
import { ReactFlowProvider } from '@xyflow/react'
import { ConnectionDetailsDrawer } from '@/components/Canvas/EdgeDetailsDrawer';

interface Props extends PanelProps { }

export const ServiceMapPanel: React.FC<Props> = (props) => {
    return (
        <PluginPage layout={PageLayoutType.Custom}>
            <ViewStoreProvider>
                <ServiceMapPanelContent {...props} />
            </ViewStoreProvider>
        </PluginPage>
    );
};

const ServiceMapPanelContent: React.FC<Props> = (props) => {
    const s = useStyles2(getStyles);

    console.log('props', props.data.series)

    const {
        setFilteredRecords,
        filteredRecords,
        isServiceDrawerOpen,
        setIsServiceDrawerOpen,
        selectedServiceDetails,
        setViewState,
        setOriginalViewState,
    } = useViewStore(state => state)
    const { elements } = props.options;

    useEffect(() => {
        const records = generateRecords(elements, props.data.series)

        setFilteredRecords(records)
        setViewState({
            records: records
        })
        setOriginalViewState({
            records: records
        })
    }, [props]);


    return (
        <PluginPage layout={PageLayoutType.Custom}>
            <ReactFlowProvider>
                <div className={s.container} style={{ width: props.width, height: props.height }}>
                    {/* <CanvasNavbar /> */}
                    <div className={s.canvasContainer}>
                        <InfiniteCanvas />
                    </div>
                    <ServiceDrawer
                        open={isServiceDrawerOpen}
                        onOpenChange={setIsServiceDrawerOpen}
                        record={filteredRecords?.find(record => record.key === selectedServiceDetails) || null} />
                    <ConnectionDetailsDrawer />
                </div>
            </ReactFlowProvider>
        </PluginPage>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        position: relative;
    `,
    canvasContainer: css`
        flex: 1;
        min-height: 0;
        position: relative;
    `,
    page: css`
        padding: ${theme.spacing(3)};
        background-color: ${theme.colors.background.secondary};
        display: flex;
        justify-content: center;
    `,
    content: css`
        margin-top: ${theme.spacing(6)};
    `,
});
