import CesiumNavigation from 'cesium-navigation-es6';
import { useSelector } from 'react-redux'

export const CesiumNavigator = (props) => {
  const viewer = useSelector(state => state.cesium.viewer)
  const options = {
    // 用于启用或禁用罗盘
    enableCompass: true,
    // 用于启用或禁用缩放控件
    enableZoomControls: false,
    // 用于启用或禁用距离图例
    enableDistanceLegend: false,
    // 用于启用或禁用指南针外环
    enableCompassOuterRing: true,
  };

  if (viewer) CesiumNavigation(viewer, options)
  return null;
};
