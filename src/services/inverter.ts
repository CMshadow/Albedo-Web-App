import axios from '../axios.config'
import injectAuth from './injectAuth'
import { Inverter, IAxiosRequest, InverterPreUpload, OND } from '../@types'

const addInvRequest: IAxiosRequest<
  { values: InverterPreUpload; username: string; jwtToken: string },
  Inverter
> = args =>
  axios
    .post<Inverter>(`/inverter/${args.username}`, args.values, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const getInvRequest: IAxiosRequest<{ username: string; jwtToken: string }, Inverter[]> = args =>
  axios
    .get<Inverter[]>(`/inverter/${args.username}`, { headers: { 'COG-TOKEN': args.jwtToken } })
    .then(res => res.data)

const getOfficialInvRequest: IAxiosRequest<
  { region: string; jwtToken: string },
  Inverter[]
> = args =>
  axios
    .get<Inverter[]>(`/inverter/official`, {
      params: { region: args.region },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const deleteInvRequest: IAxiosRequest<
  { inverterID: string; username: string; jwtToken: string },
  void
> = args =>
  axios
    .delete<void>(`/inverter/${args.username}`, {
      params: { inverterID: args.inverterID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const updateInvRequest: IAxiosRequest<
  { inverterID: string; values: InverterPreUpload; username: string; jwtToken: string },
  void
> = args =>
  axios
    .put<void>(`/inverter/${args.username}`, args.values, {
      params: { inverterID: args.inverterID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

type PerformanceCurve = { pdc: number[]; pac: number[]; eff: number[] }

const getPerformanceCurveRequest: IAxiosRequest<
  { inverterID: string; userID: string; jwtToken: string },
  PerformanceCurve
> = args =>
  axios
    .get<PerformanceCurve>(`/inverter/inverterperformance`, {
      params: { inverterID: args.inverterID, userID: args.userID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

type parseONDArgs = {
  fileText: string | ArrayBuffer
  jwtToken: string
  onUploadProgress: (args: { total: number; loaded: number }) => void
}

const parseONDRequest: IAxiosRequest<parseONDArgs, OND> = args =>
  axios
    .post<OND>(`/parseond`, args.fileText, {
      onUploadProgress: args.onUploadProgress,
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

export const addInverter = injectAuth(addInvRequest)

export const getInverter = injectAuth(getInvRequest)

export const getOfficialInverter = injectAuth(getOfficialInvRequest)

export const deleteInverter = injectAuth(deleteInvRequest)

export const updateInverter = injectAuth(updateInvRequest)

export const getPerformanceCurve = injectAuth(getPerformanceCurveRequest)

export const parseOND = injectAuth(parseONDRequest)
