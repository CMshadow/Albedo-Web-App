import * as actionTypes from '../action/actionTypes';
import { 
  DeleteReportDataAction, IReportState, ReleaseReportDataAction, 
  ReportActionTypes, SetReportDataAction, UpdateReportAttributesAction 
} from '../../@types'

const initialState: IReportState = {};

interface IReducer<A> {
  (state: IReportState, action: A): IReportState
}

const setReportData: IReducer<SetReportDataAction> = (state, action) => {
  return {
    ...state,
    [action.buildingID]: action.data
  }
}

const updateReportAttributes: IReducer<UpdateReportAttributesAction> = (state, action) => {
  return {
    ...state,
    [action.buildingID]: {
      ...state[action.buildingID],
      ...action.values
    }
  }
}

const releaseReportData: IReducer<ReleaseReportDataAction> = (state, action) => {
  return {}
}

const deleteReportData: IReducer<DeleteReportDataAction> = (state, action) => {
  const newState = { ...state }
  delete newState[action.buildingID]
  return newState
}

const reducer = (state=initialState, action: ReportActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_REPORTDATA:
      return setReportData(state, action);
    case actionTypes.UPDATE_REPORTATTRIBUTES:
      return updateReportAttributes(state, action)
    case actionTypes.RELEASE_REPORTDATA:
      return releaseReportData(state, action)
    case actionTypes.DELETE_REPORTDATA:
      return deleteReportData(state, action)
    default: return state;
  }
};

export default reducer;
