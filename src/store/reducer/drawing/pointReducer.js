import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const addPoint = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: action.entity
  }
}

const updatePoint = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: action.entity
  }
}

const deletePoint = (state, action) => {
  const newState = {...state}
  delete newState[action.pointId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.POINT_ADD:
      return addPoint(state, action)
    case actionTypes.POINT_UPDATE:
      return updatePoint(state, action)
    case actionTypes.POINT_DELETE:
      return deletePoint(state, action)
    default: return state;
  }
};

export default reducer;
