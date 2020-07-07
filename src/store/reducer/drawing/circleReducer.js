import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const setCircle = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: {
      entity: action.entity,
      props: action.props || state[action.entity.entityId].props,
      centerPointId: action.centerPointId || state[action.entity.entityId].centerPointId,
      edgePointId: action.edgePointId  || state[action.entity.entityId].edgePointId,
    }
  }
}

const deleteCircle = (state, action) => {
  const newState = {...state}
  delete newState[action.circleId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CIRCLE_SET:
      return setCircle(state, action)
    case actionTypes.CIRCLE_DELETE:
      return deleteCircle(state, action)
    default: return state;
  }
};

export default reducer;
