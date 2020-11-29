import axios from '../axios.config'
import injectAuth from './injectAuth'
import { PV, PVPreUpload, IAxiosRequest, PAN } from '../@types'

const addPVRequest: IAxiosRequest<
  { values: PVPreUpload; username: string; jwtToken: string },
  PV
> = args =>
  axios
    .post<PV>(`/pv/${args.username}`, args.values, { headers: { 'COG-TOKEN': args.jwtToken } })
    .then(res => res.data)

const getPVRequest: IAxiosRequest<{ username: string; jwtToken: string }, PV[]> = args =>
  axios
    .get<PV[]>(`/pv/${args.username}`, { headers: { 'COG-TOKEN': args.jwtToken } })
    .then(res => res.data)

const getOfficialPVRequest: IAxiosRequest<{ region: string; jwtToken: string }, PV[]> = args =>
  axios
    .get<PV[]>(`/pv/official`, {
      params: { region: args.region },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const deletePVRequest: IAxiosRequest<
  { pvID: string; username: string; jwtToken: string },
  void
> = args =>
  axios
    .delete<void>(`/pv/${args.username}`, {
      params: { pvID: args.pvID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const updatePVRequest: IAxiosRequest<
  { pvID: string; values: PVPreUpload; username: string; jwtToken: string },
  void
> = args =>
  axios
    .put<void>(`/pv/${args.username}`, args.values, {
      params: { pvID: args.pvID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

type IVEntry = { i_sc: number; i_mp: number; v_mp: number; v_oc: number; i_xx: number; i_x: number }

type IVCruve = {
  [key: string]: IVEntry
}

const getIVCurveRequest: IAxiosRequest<
  { pvID: string; userID: string; jwtToken: string },
  IVCruve
> = args =>
  axios
    .get<IVCruve>(`/pv/ivcurve`, {
      params: { pvID: args.pvID, userID: args.userID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

type parsePANArgs = {
  fileText: string | ArrayBuffer
  jwtToken: string
  onUploadProgress: (args: { total: number; loaded: number }) => void
}

const parsePANRequest: IAxiosRequest<parsePANArgs, PAN> = args =>
  axios
    .post<PAN>(`/parsepan`, args.fileText, {
      onUploadProgress: args.onUploadProgress,
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

export const addPV = injectAuth(addPVRequest)

export const getPV = injectAuth(getPVRequest)

export const getOfficialPV = injectAuth(getOfficialPVRequest)

export const deletePV = injectAuth(deletePVRequest)

export const updatePV = injectAuth(updatePVRequest)

export const getIVCurve = injectAuth(getIVCurveRequest)

export const parsePAN = injectAuth(parsePANRequest)
