import React from 'react';
import { ContextMenuTrigger } from "react-contextmenu";
import { CustomViewer } from '../../components/Cesium/CustomViewer/CustomViewer'
import { CesiumNavigator } from '../../components/Cesium/CesiumNavigator/CesiumNavigator'
import { CesiumScreenSpaceCameraController } from '../../components/Cesium/CesiumScreenSpaceCameraController/CesiumScreenSpaceCameraController'
// import { FlyTo } from '../../components/Cesium/FlyTo/FlyTo'
import { CesiumEventHandlers } from '../../components/Cesium/CesiumEventHandler/CesiumEventHandler'
import { DrawingPointRender } from '../../components/Cesium/CesiumRenders/DrawingPointRender'
import { DrawingPolygonRender } from '../../components/Cesium/CesiumRenders/DrawingPolygonRender'
import { DrawingPolylineRender } from '../../components/Cesium/CesiumRenders/DrawingPolylineRender'
import { DrawingCircleRender } from '../../components/Cesium/CesiumRenders/DrawingCircleRender'
import { CustomContextMenu } from '../../components/Cesium/CustomContextMenu/CustomContextMenu'

const ModelingPage = (props) => {
  return (
    <>
      <ContextMenuTrigger id="cesium_context_menu">
        <CustomViewer enableTerrain={false}>
          <CesiumNavigator/>
          <CesiumScreenSpaceCameraController />
          {/* <FlyTo flyTo={[-117.842453, 33.645769, 500]} /> */}
          <CesiumEventHandlers/>
          <DrawingPointRender />
          <DrawingPolygonRender />
          <DrawingPolylineRender />
          <DrawingCircleRender />
        </CustomViewer>
      </ContextMenuTrigger>
      <CustomContextMenu />
    </>
  )
}

export default ModelingPage;
