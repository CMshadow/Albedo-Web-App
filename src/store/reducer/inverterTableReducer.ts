import { IInverterTableState, InverterTableActionTypes } from '../../@types'
import * as actionTypes from '../action/actionTypes'

const initialState: IInverterTableState = {
  data: [],
  officialData: [],
}

interface IReducer {
  (state: IInverterTableState, action: InverterTableActionTypes): IInverterTableState
}

const setInverterData: IReducer = (state, action) => {
  return {
    ...state,
    data: action.data,
  }
}

const setOfficialInverterData: IReducer = (state, action) => {
  return {
    ...state,
    officialData: action.data,
  }
}

const reducer = (state = initialState, action: InverterTableActionTypes): IInverterTableState => {
  switch (action.type) {
    case actionTypes.SET_INVERTER_DATA:
      return setInverterData(state, action)
    case actionTypes.SET_OFFICIAL_INVERTER_DATA:
      return setOfficialInverterData(state, action)
    default:
      return state
  }
}

export default reducer
