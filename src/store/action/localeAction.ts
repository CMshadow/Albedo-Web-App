import { ThunkAction } from 'redux-thunk'
import * as actionTypes from './actionTypes';
import { RootState, LocalActionTypes } from '../../@types'
import { Locale } from '../../@types';

type ThunkResult<R> = ThunkAction<R, RootState, undefined, LocalActionTypes>

export const setLocale = (locale: Locale): ThunkResult<void> => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_LOCALE,
    locale: locale
  });
}
