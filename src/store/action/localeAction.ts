import { Dispatch } from 'redux';
import * as actionTypes from './actionTypes';


export const setLocale = (locale: string) => (dispatch: Dispatch, getState: state) => {
  return dispatch({
    type: actionTypes.SET_LOCALE,
    locale: locale
  });
}
