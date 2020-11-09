import * as actionTypes from '../action/actionTypes'
import { IPVTableState, PVTableActionTypes } from '../../@types'

const initialState: IPVTableState = {
  data: [],
  officialData: [],
}

interface IReducer {
  (state: IPVTableState, action: PVTableActionTypes): IPVTableState
}

const setPVData: IReducer = (state, action) => {
  return {
    ...state,
    data: action.data,
  }
}

const setOfficialPVData: IReducer = (state, action) => {
  return {
    ...state,
    officialData: action.data,
  }
}

const reducer = (state = initialState, action: PVTableActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_PV_DATA:
      return setPVData(state, action)
    case actionTypes.SET_OFFICIAL_PV_DATA:
      return setOfficialPVData(state, action)
    default:
      return state
  }
}

export default reducer
