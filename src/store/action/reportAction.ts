import * as actionTypes from './actionTypes'
import { ThunkAction } from 'redux-thunk'
import { RootState, ReportActionTypes, CommercialReport, DomesticReport } from '../../@types'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, ReportActionTypes>

interface IAction<P, R> {
  (param: P): ThunkResult<R>
}

type BuildingIDParam = { buildingID: string }
type SetReportDataParams = BuildingIDParam & { data: CommercialReport | DomesticReport }
type UpdateReportAttributesParams = BuildingIDParam & Partial<CommercialReport | DomesticReport>

export const setReportData: IAction<SetReportDataParams, void> = ({
  buildingID,
  data,
}) => dispatch => {
  dispatch({
    type: actionTypes.SET_REPORTDATA,
    buildingID: buildingID,
    data: data,
  })
}

export const updateReportAttributes: IAction<UpdateReportAttributesParams, void> = ({
  buildingID,
  ...values
}) => dispatch => {
  dispatch({
    type: actionTypes.UPDATE_REPORTATTRIBUTES,
    buildingID: buildingID,
    values: values,
  })
}

export const releaseReportData: IAction<void, void> = () => dispatch => {
  dispatch({
    type: actionTypes.RELEASE_REPORTDATA,
  })
}

export const deleteReportData: IAction<string, void> = buildingID => dispatch => {
  dispatch({
    type: actionTypes.DELETE_REPORTDATA,
    buildingID: buildingID,
  })
}
