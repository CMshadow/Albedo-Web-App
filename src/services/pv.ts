import axios from '../axios.config'
import withAuth from './withAuth'
import { PV, IAxiosRequest, IRequest, PVPreUpload } from '../@types'

const addPVRequest: IAxiosRequest<PVPreUpload, PV> = (username, jwtToken, values) =>
  axios
    .post<PV>(`/pv/${username}`, values, { headers: { 'COG-TOKEN': jwtToken } })
    .then(res => res.data)

const getPVRequest: IAxiosRequest<null, Array<PV>> = (username, jwtToken) =>
  axios
    .get<Array<PV>>(`/pv/${username}`, { headers: { 'COG-TOKEN': jwtToken } })
    .then(res => res.data)

const getOfficialPVRequest: IAxiosRequest<string, Array<PV>> = (username, jwtToken, region) =>
  axios
    .get<Array<PV>>(`/pv/official`, {
      params: { region: region },
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

const deletePVRequest: IAxiosRequest<string, void> = (username, jwtToken, pvID) =>
  axios
    .delete<void>(`/pv/${username}`, {
      params: { pvID: pvID },
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

export const addPV: IRequest<PVPreUpload, PV> = values => withAuth(addPVRequest, values)

export const getPV: IRequest<null, Array<PV>> = () => withAuth(getPVRequest)

export const getOfficialPV: IRequest<string, Array<PV>> = region =>
  withAuth(getOfficialPVRequest, region)

export const deletePV: IRequest<string, void> = pvID => withAuth(deletePVRequest, pvID)
