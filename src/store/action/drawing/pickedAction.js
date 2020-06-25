import * as actionTypes from '../actionTypes'

export const setPickedObj = (pickedType, entityId) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PICKED_OBJECT,
    entityId: entityId,
    pickedType: pickedType
  })
}

export const releasePickedObj = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.RELEASE_PICKED_OBJECT
  })
}
