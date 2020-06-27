import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const setPolyline = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: {
      entity: action.entity,
      pointMap: action.pointMap
    }
  }
}

const deletePolyline = (state, action) => {
  const newState = {...state}
  delete newState[action.pointId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.POLYLINE_CREATE:
      return setPolyline(state, action)
    case actionTypes.POLYLINE_UPDATE:
      return setPolyline(state, action)
    case actionTypes.POLYLINE_DELETE:
      return deletePolyline(state, action)
    default: return state;
  }
};

export default reducer;
