import * as actionTypes from '../../action/actionTypes'

const initialState = {
  pickedId: null,
  pickedType: null
};

const setPickedObj = (state, action) => {
  return {
    pickedId: action.entityId,
    pickedType: action.pickedType
  }
}

const releasePickedObj = (state, action) => {
  return {
    pickedId: null,
    pickedType: null
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PICKED_OBJECT:
      return setPickedObj(state, action)
    case actionTypes.RELEASE_PICKED_OBJECT:
      return releasePickedObj(state, action)
    default: return state;
  }
};

export default reducer;
