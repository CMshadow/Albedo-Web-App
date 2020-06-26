import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const setPolygon = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: action.entity
  }
}

const deletePolygon = (state, action) => {
  const newState = {...state}
  delete newState[action.pointId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.POLYGON_CREATE:
      return setPolygon(state, action)
    case actionTypes.POLYGON_UPDATE:
      return setPolygon(state, action)
    case actionTypes.POLYGON_DELETE:
      return deletePolygon(state, action)
    default: return state;
  }
};

export default reducer;
