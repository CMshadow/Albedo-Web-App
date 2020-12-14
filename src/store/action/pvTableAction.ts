import * as actionTypes from './actionTypes'
import { ThunkAction } from 'redux-thunk'
import { RootState, PVTableActionTypes, PV } from '../../@types'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, PVTableActionTypes>

interface IAction<T> {
  (data: Array<PV>): ThunkResult<T>
}

export const setPVData: IAction<void> = data => dispatch => {
  dispatch({
    type: actionTypes.SET_PV_DATA,
    data: data,
  })
}

export const setOfficialPVData: IAction<void> = data => dispatch => {
  dispatch({
    type: actionTypes.SET_OFFICIAL_PV_DATA,
    data: data,
  })
}
