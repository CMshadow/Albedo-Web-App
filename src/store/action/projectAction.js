import * as actionTypes from './actionTypes';

export const setProjectData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PROJECTDATA,
    data: data
  });
}
