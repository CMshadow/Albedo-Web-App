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
