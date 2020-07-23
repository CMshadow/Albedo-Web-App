import React from 'react';
import { useSelector } from 'react-redux';
import { ScreenSpaceCameraController } from 'resium';

export const CesiumScreenSpaceCameraController = (props) => {
  const enableRotate = useSelector(state => state.cesium.enableRotate)
  return (
    <ScreenSpaceCameraController
      enableRotate={enableRotate}
      enableLook={false}
    />
  );
}
