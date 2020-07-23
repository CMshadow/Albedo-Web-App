import React from 'react';
import { CameraFlyTo } from 'resium';
import { Cartesian3 } from 'cesium';

export const FlyTo = (props) => {
return (
  <CameraFlyTo
    destination={Cartesian3.fromDegrees(...props.flyTo)}
  />
)
}
