import { SET_INVERTER_DATA, SET_OFFICIAL_INVERTER_DATA } from '../../store/action/actionTypes' 
import { Inverter } from '../../@types'


export interface IInverterTableState {
  data: Array<Inverter>,
  officialData: Array<Inverter>
}

export interface SetInverterDataAction {
  type: typeof SET_INVERTER_DATA,
  data: Array<Inverter>
}

export interface SetOfficialInverterDataAction {
  type: typeof SET_OFFICIAL_INVERTER_DATA
  data: Array<Inverter>
}

export type InverterTableActionTypes = SetInverterDataAction | SetOfficialInverterDataAction