import axios from '../axios.config'
import withAuth from './withAuth'
import { PV } from '../@types'

interface ITestRequest<R> {
  (): Promise<R>
}

const getPV = async (username: string, jwtToken: string) => {
  return await axios.get<Array<PV>>(
    `/pv/${username}`,
    {headers: {'COG-TOKEN': jwtToken}}
  )
  .then(res => res.data)
}

export const testRequest: ITestRequest<Array<PV>> = () => withAuth(getPV)