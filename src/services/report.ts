import axios from '../axios.config'
import injectAuth from './injectAuth'
import { IAxiosRequest, Report } from '../@types'

const genReportRequest: IAxiosRequest<
  { projectID: string; buildingID: string; username: string; jwtToken: string },
  Report
> = args =>
  axios
    .post<Report>(
      `/project/${args.username}/${args.projectID}/${args.buildingID}/report`,
      {},
      { headers: { 'COG-TOKEN': args.jwtToken } }
    )
    .then(res => res.data)

const getReportRequest: IAxiosRequest<
  { projectID: string; buildingID: string; username: string; jwtToken: string },
  Report
> = args =>
  axios
    .get(`/project/${args.username}/${args.projectID}/${args.buildingID}/report`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const deleteReportRequest: IAxiosRequest<
  { projectID: string; username: string; jwtToken: string },
  void
> = args =>
  axios
    .delete<void>(`/project/${args.username}/${args.projectID}/_/report`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const saveReportRequest: IAxiosRequest<
  {
    projectID: string
    buildingID: string
    values: Report
    username: string
    jwtToken: string
  },
  { Attributes: Report }
> = args =>
  axios
    .put<{ Attributes: Report }>(
      `/project/${args.username}/${args.projectID}/${args.buildingID}/report`,
      args.values,
      {
        headers: { 'COG-TOKEN': args.jwtToken },
      }
    )
    .then(res => res.data)

const getProductionDataRequest: IAxiosRequest<
  {
    projectID: string
    buildingID: string
    month: number
    day: number
    dataKey: 'hour_AC_power' | 'hour_DC_power'
    username: string
    jwtToken: string
  },
  number[]
> = args =>
  axios
    .get<number[]>(`/project/${args.username}/${args.projectID}/${args.buildingID}/production`, {
      params: { month: args.month, day: args.day, dataKey: args.dataKey },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const deleteProductionDataRequest: IAxiosRequest<
  {
    projectID: string
    username: string
    jwtToken: string
  },
  void
> = args =>
  axios
    .delete<void>(`/project/${args.username}/${args.projectID}/_/production`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const getIrradianceDataRequest: IAxiosRequest<
  {
    projectID: string
    buildingID: string
    month: number
    day: number
    tilt: number
    azimuth: number
    username: string
    jwtToken: string
  },
  number[]
> = args =>
  axios
    .get<number[]>(`/project/${args.username}/${args.projectID}/${args.buildingID}/irradiance`, {
      params: { month: args.month, day: args.day, tilt: args.tilt, azimuth: args.azimuth },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const deleteIrradianceDataRequest: IAxiosRequest<
  {
    projectID: string
    username: string
    jwtToken: string
  },
  void
> = args =>
  axios
    .delete(`/project/${args.username}/${args.projectID}/_/irradiance`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const downloadReportCSVRequest: IAxiosRequest<
  {
    projectID: string
    buildingID: string
    username: string
    jwtToken: string
  },
  string
> = args =>
  axios
    .get<string>(`/project/${args.username}/${args.projectID}/${args.buildingID}/csv`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

export const genReport = injectAuth(genReportRequest)
export const getReport = injectAuth(getReportRequest)
export const deleteReport = injectAuth(deleteReportRequest)
export const saveReport = injectAuth(saveReportRequest)
export const getProductionData = injectAuth(getProductionDataRequest)
export const deleteProductionData = injectAuth(deleteProductionDataRequest)
export const getIrradianceData = injectAuth(getIrradianceDataRequest)
export const deleteIrradianceData = injectAuth(deleteIrradianceDataRequest)
export const downloadReportCSV = injectAuth(downloadReportCSVRequest)
