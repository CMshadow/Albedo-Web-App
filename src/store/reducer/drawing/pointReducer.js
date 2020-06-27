import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const setPoint = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: {
      entity: action.entity,
      polygonMap: action.polygonMap || state[action.entity.entityId].polygonMap,
      polylineMap: action.polylineMap || state[action.entity.entityId].polylineMap
    }
  }
}

const deletePoint = (state, action) => {
  const newState = {...state}
  delete newState[action.pointId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.POINT_SET:
      return setPoint(state, action)
    case actionTypes.POINT_DELETE:
      return deletePoint(state, action)
    default: return state;
  }
};

export default reducer;
