import { ScreenSpaceEventType, Cartesian3, Matrix4, Math as CesiumMath } from 'cesium';
import * as actionTypes from '../action/actionTypes';

const initialState = {
  key: '',
  selectedMap: 'google',
  viewer: null,
  enableRotate: true,
  showLength: true,
  showAngle: true,
  rightClickCor: null,
  showVertex: true,
};

const setMapKey = (state, action) => {
  return {
    ...state,
    key: action.key
  }
}

const resetCamera = (state, action) => {
  state.viewer.camera.setView({
    destination: state.viewer.camera.position,
    orientation: {
      heading : 0,
      pitch : CesiumMath.toRadians(-90),
      roll : 0
    }
  })
  return {
    ...state
  }
}

const setViewer = (state, action) => {
  action.viewer.cesiumWidget.creditContainer.style.display = "none";
  action.viewer.scene.globe.depthTestAgainstTerrain = true;
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_CLICK
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_UP
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_DOWN
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.MOUSE_MOVE
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.PINCH_START
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.PINCH_END
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.PINCH_MOVE
  );

  // action.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500;
  action.viewer.camera.lookAt(
    Cartesian3.fromDegrees(-117.842453, 33.645769, 500),
    new Cartesian3(0, 0, 180)
  )
  action.viewer.camera.lookAtTransform(Matrix4.IDENTITY);
  return {
    ...state,
    viewer: action.viewer,
  }
}

const enableRotate = (state, action) => {
  return {
    ...state,
    enableRotate: true
  };
};

const disableRotate = (state, action) => {
  return {
    ...state,
    enableRotate: false
  };
};

const selectMap = (state, action) => {
  return {
    ...state,
    selectedMap: action.selectedMap
  };
}

const setRightClickCor = (state, action) => {
  return {
    ...state,
    rightClickCor: action.rightClickCor
  }
}

const setShowLength = (state, action) => {
  return {
    ...state,
    showLength: action.showLength
  }
}

const setShowAngle = (state, action) => {
  return {
    ...state,
    showAngle: action.showAngle
  }
}

const setShowVertex = (state, action) => {
  return {
    ...state,
    showVertex: action.showVertex
  }
}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MAP_KEY:
      return setMapKey(state, action);
    case actionTypes.SET_VIEWER:
      return setViewer(state, action);
    case actionTypes.RESET_CAMERA:
      return resetCamera(state, action)
    case actionTypes.ENABLE_ROTATION:
      return enableRotate(state, action);
    case actionTypes.DISABLE_ROTATION:
      return disableRotate(state, action);
    case actionTypes.SELECT_MAP:
      return selectMap(state, action);
    case actionTypes.SET_SHOWLENGTH:
      return setShowLength(state, action)
    case actionTypes.SET_SHOWANGLE:
      return setShowAngle(state, action)
    case actionTypes.SET_SHOWVERTEX:
      return setShowVertex(state, action)
    case actionTypes.SET_RIGHT_CLICK_COR:
      return setRightClickCor(state, action)
    default: return state;
  }
};

export default reducer;