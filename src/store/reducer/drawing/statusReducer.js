import * as actionTypes from '../../action/actionTypes'
import * as drawingTypes from '../../action/drawing/drawingTypes'

const initialState = {
  status: drawingTypes.IDLE,
};

const setDrwStatIdle = (state, action) => {
  return {
    status: drawingTypes.IDLE
  }
}

const setDrwStatPoint = (state, action) => {
  return {
    status: drawingTypes.POINT
  }
}

const setDrwStatFoundline = (state, action) => {
  return {
    status: drawingTypes.FOUNDLINE
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAWING_STATUS_IDLE:
      return setDrwStatIdle(state, action)
    case actionTypes.DRAWING_STATUS_POINT:
      return setDrwStatPoint(state, action)
    case actionTypes.DRAWING_STATUS_FOUNDLINE:
      return setDrwStatFoundline(state, action);
    default: return state;
  }
};

export default reducer;
