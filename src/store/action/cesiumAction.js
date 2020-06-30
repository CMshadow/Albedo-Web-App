import * as actionTypes from './actionTypes';

export const setMapKey = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_MAP_KEY,
    key: data
  });
}

export const setViewer = (viewer) => {
  return {
    type: actionTypes.SET_VIEWER,
    viewer: viewer
  };
};

export const resetCamera = () => {
  return {
    type: actionTypes.RESET_CAMERA
  }
}

export const enableRotate = () => {
  return {
    type: actionTypes.ENABLE_ROTATION
  };
};

export const disableRotate = () => {
  return {
    type: actionTypes.DISABLE_ROTATION
  };
};

export const selectMap = (map) => {
  return {
    type: actionTypes.SELECT_MAP,
    selectedMap: map
  };
}

export const setRightClickCor = (rightClickCor) => {
  return {
    type: actionTypes.SET_RIGHT_CLICK_COR,
    rightClickCor: rightClickCor
  }
}

export const setShowLength = (showLength) => {
  return {
    type: actionTypes.SET_SHOWLENGTH,
    showLength: showLength
  }
}

export const setShowAngle = (showAngle) => {
  return {
    type: actionTypes.SET_SHOWANGLE,
    showAngle: showAngle
  }
}

export const setShowVertex = (showVertex) => {
  return {
    type: actionTypes.SET_SHOWVERTEX,
    showVertex: showVertex
  }
}
