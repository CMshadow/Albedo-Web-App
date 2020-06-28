import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const setPolygon = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: {
      entity: action.entity,
      pointMap: action.pointMap || state[action.entity.entityId].pointMap,
      outPolylineId: action.outPolylineId || state[action.entity.entityId].outPolylineId
    }
  }
}

const deletePolygon = (state, action) => {
  const newState = {...state}
  delete newState[action.pointId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.POLYGON_SET:
      return setPolygon(state, action)
    case actionTypes.POLYGON_DELETE:
      return deletePolygon(state, action)
    default: return state;
  }
};

export default reducer;
