import { SET_UNIT } from '../action/actionTypes'

export type Unit = 'm' | 'ft'

export interface IUnitState {
  unit: Unit
}

interface SetUnitAction {
  type: typeof SET_UNIT
  unit: Unit
}

export type UnitActionTypes = SetUnitAction