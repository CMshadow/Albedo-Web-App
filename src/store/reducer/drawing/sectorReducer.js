import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const setSector = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: {
      entity: action.entity,
      centerPointId: action.centerPointId || state[action.entity.entityId].centerPointId,
      edgePointId: action.edgePointId  || state[action.entity.entityId].edgePointId,
      anglePointId: action.anglePointId  || state[action.entity.entityId].anglePointId,
      brngPointId: action.brngPointId  || state[action.entity.entityId].brngPointId,
    }
  }
}

const deleteSector = (state, action) => {
  const newState = {...state}
  delete newState[action.circleId]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SECTOR_SET:
      return setSector(state, action)
    case actionTypes.SECTOR_DELETE:
      return deleteSector(state, action)
    default: return state;
  }
};

export default reducer;
