import * as actionTypes from '../../action/actionTypes'
import * as objTypes from '../../action/drawing/objTypes'

const initialState = {
  status: objTypes.IDLE,
  props: null
};

const setDrwStatIdle = (state, action) => {
  return {
    status: objTypes.IDLE,
    props: {
      ...state.props,
      ...action.props
    }
  }
}

const setDrwStatPoint = (state, action) => {
  return {
    status: objTypes.POINT
  }
}

const setDrwStatPolygon = (state, action) => {
  return {
    status: objTypes.POLYGON,
    props: {
      ...state.props,
      ...action.props
    }
  }
}

const setDrwStatePolyline = (state, action) => {
  return {
    status: objTypes.POLYLINE,
    props: {
      ...state.props,
      ...action.props
    }
  }
}

const setDrwStateLine = (state, action) => {
  return {
    status: objTypes.LINE,
    props: {
      ...state.props,
      ...action.props
    }
  }
}

const setDrwStateCircle = (state, action) => {
  return {
    status: objTypes.CIRCLE,
    props: {
      ...state.props,
      ...action.props
    }
  }
}

const setDrwStateSector = (state, action) => {
  return {
    status: objTypes.SECTOR,
    props: {
      ...state.props,
      ...action.props
    }
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAWING_STATUS_IDLE:
      return setDrwStatIdle(state, action)
    case actionTypes.DRAWING_STATUS_POINT:
      return setDrwStatPoint(state, action)
    case actionTypes.DRAWING_STATUS_POLYGON:
      return setDrwStatPolygon(state, action);
    case actionTypes.DRAWING_STATUS_POLYLINE:
      return setDrwStatePolyline(state, action)
    case actionTypes.DRAWING_STATUS_LINE:
      return setDrwStateLine(state, action)
    case actionTypes.DRAWING_STATUS_CIRCLE:
      return setDrwStateCircle(state, action)
    case actionTypes.DRAWING_STATUS_SECTOR:
      return setDrwStateSector(state, action)
    default: return state;
  }
};

export default reducer;
