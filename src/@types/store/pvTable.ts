import { SET_PV_DATA, SET_OFFICIAL_PV_DATA } from '../../store/action/actionTypes' 
import { PV } from '../../@types'


export interface IPVTableState {
  data: Array<PV>,
  officialData: Array<PV>
}

export interface SetPVDataAction {
  type: typeof SET_PV_DATA,
  data: Array<PV>
}

export interface SetOfficialPVDataAction {
  type: typeof SET_OFFICIAL_PV_DATA
  data: Array<PV>
}

export type PVTableActionTypes = SetPVDataAction | SetOfficialPVDataAction