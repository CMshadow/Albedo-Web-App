import axios from '../axios.config'
import withAuth from './withAuth'
import { Inverter, IAxiosRequest, IRequest, InverterPreUpload } from '../@types'

const addINVRequest: IAxiosRequest<InverterPreUpload, Inverter> = (username, jwtToken, values) =>
  axios
    .post<Inverter>(`/inverter/${username}`, values, { headers: { 'COG-TOKEN': jwtToken } })
    .then(res => res.data)

const getINVRequest: IAxiosRequest<null, Array<Inverter>> = (username, jwtToken) =>
  axios
    .get<Array<Inverter>>(`/inverter/${username}`, { headers: { 'COG-TOKEN': jwtToken } })
    .then(res => res.data)

const getOfficialINVRequest: IAxiosRequest<string, Array<Inverter>> = (
  username,
  jwtToken,
  region
) =>
  axios
    .get<Array<Inverter>>(`/inverter/official`, {
      params: { region: region },
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

const deleteINVRequest: IAxiosRequest<string, void> = (username, jwtToken, inverterID) =>
  axios
    .delete<void>(`/inverter/${username}`, {
      params: { inverterID: inverterID },
      headers: { 'COG-TOKEN': jwtToken },
    })
    .then(res => res.data)

export const addInverter: IRequest<InverterPreUpload, Inverter> = values =>
  withAuth(addINVRequest, values)

export const getInverter: IRequest<null, Array<Inverter>> = () => withAuth(getINVRequest)

export const getOfficialInverter: IRequest<string, Array<Inverter>> = region =>
  withAuth(getOfficialINVRequest, region)

export const deleteInverter: IRequest<string, void> = inverterID =>
  withAuth(deleteINVRequest, inverterID)
