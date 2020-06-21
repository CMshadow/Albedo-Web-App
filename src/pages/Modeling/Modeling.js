import React from 'react';
import { ContextMenuTrigger } from "react-contextmenu";
import { CustomViewer } from '../../components/Modeling/Cesium/CustomViewer/CustomViewer'
import { CesiumNavigator } from '../../components/Modeling/Cesium/CesiumNavigator/CesiumNavigator'
import { CesiumScreenSpaceCameraController } from '../../components/Modeling/Cesium/CesiumScreenSpaceCameraController/CesiumScreenSpaceCameraController'
import { FlyTo } from '../../components/Modeling/Cesium/FlyTo/FlyTo'
import { CesiumEventHandlers } from '../../components/Modeling/Cesium/CesiumEventHandler/CesiumEventHandler'

const ModelingPage = (props) => {
  return (
    <ContextMenuTrigger id="cesium_context_menu">
      <CustomViewer enableTerrain={false}>
        <CesiumNavigator/>
        <CesiumScreenSpaceCameraController />
        <FlyTo flyTo={[-117.842453, 33.645769, 500]} />
        <CesiumEventHandlers/>
      </CustomViewer>
    </ContextMenuTrigger>
  );
}

export default ModelingPage;
