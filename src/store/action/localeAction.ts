import { ThunkAction } from 'redux-thunk'
import * as actionTypes from './actionTypes';
import { LocalActionTypes, Locale } from '../types/locale'
import { RootState } from '../reducer/index'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, LocalActionTypes>

export const setLocale = (locale: Locale): ThunkResult<void> => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_LOCALE,
    locale: locale
  });
}
