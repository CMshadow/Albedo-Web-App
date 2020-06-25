import * as actionTypes from '../../action/actionTypes'

const initialState = {
};

const addPoint = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: action.entity
  }
}

const moveHoriPoint = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: action.entity
  }
}

const moveVertiPoint = (state, action) => {
  return {
    ...state,
    [action.entity.entityId]: action.entity
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.POINT_ADD:
      return addPoint(state, action)
    case actionTypes.POINT_MOVE_HORI:
      return moveHoriPoint(state, action)
    case actionTypes.POINT_MOVE_VERTI:
      return moveVertiPoint(state, action)
    default: return state;
  }
};

export default reducer;
