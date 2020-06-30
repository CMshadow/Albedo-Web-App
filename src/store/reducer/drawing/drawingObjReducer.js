import * as actionTypes from '../../action/actionTypes'

const initialState = {
  drawingId: null,
  drawingType: null,
  pickedId: null,
  pickedType: null,
  hoverId: null,
  hoverType: null
};

const setDrawingObj = (state, action) => {
  return {
    ...state,
    drawingId: action.entityId,
    drawingType: action.drawingType
  }
}

const releaseDrawingObj = (state, action) => {
  return {
    ...state,
    drawingId: null,
    drawingType: null
  }
}

const setPickedObj = (state, action) => {
  return {
    ...state,
    pickedId: action.entityId,
    pickedType: action.pickedType
  }
}

const releasePickedObj = (state, action) => {
  return {
    ...state,
    pickedId: null,
    pickedType: null
  }
}

const setHoverObj = (state, action) => {
  return {
    ...state,
    hoverId: action.hoverId,
    hoverType: action.hoverType
  }
}

const releaseHoverObj = (state, action) => {
  return {
    ...state,
    hoverId: null,
    hoverType: null
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DRAWING_OBJECT:
      return setDrawingObj(state, action)
    case actionTypes.RELEASE_DRAWING_OBJECT:
      return releaseDrawingObj(state, action)
    case actionTypes.SET_PICKED_OBJECT:
      return setPickedObj(state, action)
    case actionTypes.RELEASE_PICKED_OBJECT:
      return releasePickedObj(state, action)
    case actionTypes.SET_HOVER_OBJECT:
      return setHoverObj(state, action);
    case actionTypes.RELEASE_HOVER_OBJECT:
      return releaseHoverObj(state, action);
    default: return state;
  }
};

export default reducer;
