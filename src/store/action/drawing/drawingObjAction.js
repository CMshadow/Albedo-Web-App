import * as actionTypes from '../actionTypes'
import * as objTypes from './objTypes'
import * as actions from '../index'

export const setDrawingObj = (objType, entityId) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_DRAWING_OBJECT,
    entityId: entityId,
    drawingType: objType
  })
}

export const releaseDrawingObj = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.RELEASE_DRAWING_OBJECT
  })
}

export const setPickedObj = (objType, entityId) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PICKED_OBJECT,
    entityId: entityId,
    pickedType: objType
  })
}

export const releasePickedObj = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.RELEASE_PICKED_OBJECT
  })
}

export const setHoverObj = (objType, entityId) => (dispatch, getState) => {
  const hoverId = getState().undoable.present.drawing.hoverId
  const hoverType = getState().undoable.present.drawing.hoverType
  // dehighlight已有的hover object
  switch (hoverType) {
    case objTypes.POINT:
      dispatch(actions.pointDeHighlight(hoverId))
      break
    case objTypes.POLYLINE:
      dispatch(actions.polylineDeHighlight(hoverId))
      break
    case objTypes.POLYGON:
      dispatch(actions.polygonDeHighlight(hoverId))
      break
    case objTypes.CIRCLE:
      dispatch(actions.circleDeHighlight(hoverId))
      break
    case objTypes.SECTOR:
      dispatch(actions.sectorDeHighlight(hoverId))
      break
    default:
      break
  }
  // highlight 新hover object
  switch (objType) {
    case objTypes.POINT:
      dispatch(actions.pointHighlight(entityId))
      break
    case objTypes.POLYLINE:
      dispatch(actions.polylineHighlight(entityId))
      break
    case objTypes.POLYGON:
      dispatch(actions.polygonHighlight(entityId))
      break
    case objTypes.CIRCLE:
      dispatch(actions.circleHighlight(entityId))
      break
    case objTypes.SECTOR:
      dispatch(actions.sectorHighlight(entityId))
      break
    default:
      break
  }
  return dispatch({
    type: actionTypes.SET_HOVER_OBJECT,
    hoverId: entityId,
    hoverType: objType
  })
}

export const releaseHoverObj = () => (dispatch, getState) => {
  const hoverId = getState().undoable.present.drawing.hoverId
  const hoverType = getState().undoable.present.drawing.hoverType
  switch (hoverType) {
    case objTypes.POINT:
      dispatch(actions.pointDeHighlight(hoverId))
      break
    case objTypes.POLYLINE:
      dispatch(actions.polylineDeHighlight(hoverId))
      break
    case objTypes.POLYGON:
      dispatch(actions.polygonDeHighlight(hoverId))
      break
    case objTypes.CIRCLE:
      dispatch(actions.circleDeHighlight(hoverId))
      break
    case objTypes.SECTOR:
      dispatch(actions.sectorDeHighlight(hoverId))
      break
    default:
      break
  }
  return dispatch({
    type: actionTypes.RELEASE_HOVER_OBJECT
  })
}
