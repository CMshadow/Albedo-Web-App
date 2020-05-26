import * as actionTypes from './actionTypes';

export const setMetaInfo = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PROJECT_METAINFO,
    metaInfo: data
  });
}
