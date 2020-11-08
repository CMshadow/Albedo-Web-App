import axios from '../axios.config'
import { APIGatewayProxyResult } from 'aws-lambda'
import withAuth from './withAuth'
import { PV } from '../@types'

interface IGetPV<T> {
  (username: string, jwtToken: string): Promise<T>
}

const getPV: IGetPV<Array<PV>> = async (username, jwtToken) => {
  return await axios.get<Array<PV>>(
    `/pv/${username}`,
    {headers: {'COG-TOKEN': jwtToken}}
  )
  .then(res => {
    console.log(res)
    return res.data
  })
}

export const testRequest = () => withAuth(getPV)