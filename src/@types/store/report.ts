import {
  SET_REPORTDATA,
  UPDATE_REPORTATTRIBUTES,
  RELEASE_REPORTDATA,
  DELETE_REPORTDATA,
} from '../../store/action/actionTypes'
import { DomesticReport, CommercialReport, Report } from '../../@types'

export interface IReportState {
  [key: string]: DomesticReport | CommercialReport
}

export interface SetReportDataAction {
  type: typeof SET_REPORTDATA
  buildingID: string
  data: DomesticReport | CommercialReport
}

export interface UpdateReportAttributesAction {
  type: typeof UPDATE_REPORTATTRIBUTES
  buildingID: string
  values: Partial<Report>
}

export interface ReleaseReportDataAction {
  type: typeof RELEASE_REPORTDATA
}

export interface DeleteReportDataAction {
  type: typeof DELETE_REPORTDATA
  buildingID: string
}

export type ReportActionTypes =
  | SetReportDataAction
  | UpdateReportAttributesAction
  | ReleaseReportDataAction
  | DeleteReportDataAction
