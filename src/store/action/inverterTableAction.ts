import * as actionTypes from './actionTypes'
import { ThunkAction } from 'redux-thunk'
import { Inverter, RootState } from '../../@types'
import { InverterTableActionTypes } from '../../@types'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, InverterTableActionTypes>

interface IAction<T> {
  (data: Array<Inverter>): ThunkResult<T>
}

export const setInverterData: IAction<void> = data => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_INVERTER_DATA,
    data: data,
  })
}

export const setOfficialInverterData: IAction<void> = data => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_OFFICIAL_INVERTER_DATA,
    data: data,
  })
}
