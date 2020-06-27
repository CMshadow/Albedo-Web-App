import * as ActionTypes from './actionTypes'

export const setPVDist = (newPVDist) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_PV_DIST,
    pvDist: newPVDist,
    
  })
}

export const setInverterWidth = (newWidth, newAccessPorts, newPvGap) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_INVERTER_WIDTH,
    width: newWidth,
    pvGap: newPvGap,
    accessPoints: newAccessPorts
  })
}

export const InverterDataExport = (newAccessPorts) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_INVERTER_DATA_SLD,
    accessPoints: newAccessPorts
  })
}

export const setInterConnectData = (newAccessPorts, newStartPosition, newSize) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_INTERCONNECT_DATA,
    startPosition: newStartPosition,
    accessPoints: newAccessPorts,
    size: newSize
  })
}

export const setResize = (newWidth, newHeight) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_SIZE,
    width: newWidth,
    height: newHeight
  })
}

export const setServerPanel = (newAccessPorts, newStartPosition) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_SERVER_PANEL,
    startPosition: newStartPosition,
    accessPoints: newAccessPorts
  })
}

export const setMeter = (newAccessPorts, newStartPosition) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_METER,
    startPosition: newStartPosition,
    accessPoints: newAccessPorts
  })
}

export const setGrid = (newAccessPorts, newStartPosition) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_GRID,
    startPosition: newStartPosition,
    accessPoints: newAccessPorts
  })
}