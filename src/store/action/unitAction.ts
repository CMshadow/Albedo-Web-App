import * as actionTypes from './actionTypes';
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducer/index'
import { UnitActionTypes, Unit } from '../types/unit'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, UnitActionTypes>

export const setUnit = (unit: Unit): ThunkResult<void> => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_UNIT,
    unit: unit
  })
}
