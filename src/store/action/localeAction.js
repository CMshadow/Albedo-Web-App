import * as actionTypes from './actionTypes';

export const setLocale = (locale) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_LOCALE,
    locale: locale
  });
}
