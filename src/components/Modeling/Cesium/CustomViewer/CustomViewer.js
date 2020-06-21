import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Viewer, ImageryLayer } from 'resium';
import * as Cesium from 'cesium';

import { setViewer } from '../../../../store/action/index'

export const CustomViewer = (props) => {
  const dispatch = useDispatch()
  const mapKey = useSelector(state => state.cesium.key)
  const selectedMap = useSelector(state => state.cesium.selectedMap)

  const bingMap = new Cesium.BingMapsImageryProvider({
    url: 'https://dev.virtualearth.net',
    key: 'As64gVAZeHzxhCOAbMeEOUVdz4cuZmyoVccWqH4-QNKOyu56J9zov8qMtQv6M92K',
    mapStyle: Cesium.BingMapsStyle.AERIAL
  });

  const aMap = new Cesium.UrlTemplateImageryProvider({
    url: 'https://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6',
    maximumLevel: 18
  });

  const googleMap = new Cesium.UrlTemplateImageryProvider({
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maximumLevel: 22
  });

  const worldTerrain = Cesium.createWorldTerrain();
  return (
    <Viewer
      ref={ref => {
        if (ref && ref.cesiumElement) {
          dispatch(setViewer(ref.cesiumElement))
        }
      }}
      style={{position: "absolute", top: 64, left: 0, right: 0, bottom: 0}}
      terrainProvider={props.enableTerrain ? worldTerrain : null}
      imageryProvider={googleMap}
      geocoder={false}
      fullscreenButton={false}
      vrButton={false}
      infoBox={false}
      sceneModePicker={false}
      homeButton={false}
      navigationHelpButton={false}
      baseLayerPicker={false}
      animation={false}
      timeline={false}
      shadows={false}
      sceneMode={Cesium.SceneMode.SCENE3D}
    >
      {
        selectedMap === 'bing' ? <ImageryLayer imageryProvider={bingMap}/> : null
      }
      {
        selectedMap === 'aMap' ? <ImageryLayer imageryProvider={aMap}/> : null
      }
      {props.children}
    </Viewer>
  );
};
