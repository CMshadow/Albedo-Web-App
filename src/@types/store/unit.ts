import { SET_UNIT } from '../../store/action/actionTypes'
import { Unit } from '../../@types'

export interface IUnitState {
  unit: Unit
}

interface SetUnitAction {
  type: typeof SET_UNIT
  unit: Unit
}

export type UnitActionTypes = SetUnitAction
