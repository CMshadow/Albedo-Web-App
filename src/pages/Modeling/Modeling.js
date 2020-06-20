import React from 'react';
import { Layout } from 'antd';
import { ContextMenuTrigger } from "react-contextmenu";

import 'antd/dist/antd.css';

import { CustomViewer } from '../../components/Modeling/Cesium/CustomViewer/CustomViewer';
// import FlyTo from './CesiumComponents/FlyTo/FlyTo';
// import CesiumEventHandlers from './CesiumComponents/CesiumEventHandler/CesiumEventHandler';
// import CesiumScreenSpaceCameraController from './CesiumComponents/ScreenSpaceCameraController/CesiumScreenSpaceCameraController';
// import CesiumRender from './CesiumComponents/CesiumRenders/CesiumRender';
// import LeftSider from '../../containers/ui/LeftSider/LeftSider';
// import RightSider from '../../containers/ui/RightSider/RightSider';
// import CustomContextMenu from '../ui/CustomContextMenu/CustomContextMenu';
import { CesiumNavigator } from '../../components/Modeling/Cesium/CesiumNavigator/CesiumNavigator';

const { Content } = Layout;

const ModelingPage = () => {
  return (
    <Layout>
      <Content>
        <ContextMenuTrigger id="cesium_context_menu">
          <CustomViewer enableTerrain={false}>
            <CesiumNavigator/>
            {/* <CesiumScreenSpaceCameraController /> */}
            {/* <FlyTo flyTo={[
              props.projectInfo.projectLon,
              props.projectInfo.projectLat,
              props.projectInfo.projectZoom]}
            /> */}
            {/* <CesiumEventHandlers />
            <CesiumRender /> */}
          </CustomViewer>
        </ContextMenuTrigger>
        {/* <CustomContextMenu /> */}
        {/* <LeftSider /> */}
      </Content>
      {/* <RightSider /> */}
    </Layout>
  );
};

export default ModelingPage
