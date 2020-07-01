import * as uiTypes from '../../action/modeling/modelingUITypes'
import * as actionTypes from '../../action/actionTypes';

const initialState = {
  modelingUI: uiTypes.IDLE
}

const setUICreateBuilding = (state, action) => {
  return {
    modelingUI: uiTypes.CREATE_BUILDING
  }
}

const setUIDrawing = (state, action) => {
  return {
    modelingUI: uiTypes.DRAWING
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UI_CREATE_BUILDING:
      return setUICreateBuilding(state, action)
    case actionTypes.SET_UI_DRAWING:
      return setUIDrawing(state, action)
    default: return state;
  }
};

export default reducer;
