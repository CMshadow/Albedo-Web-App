import axios from '../axios.config'
import { APIGatewayProxyResult } from 'aws-lambda'
import withAuth from './withAuth'

interface test<R> {
  (username: string, jwtToken: string): Promise<R>
}

const testRequest: test<APIGatewayProxyResult> = (username, jwtToken) => {
  return axios.get(
    `/pv/${username}`,
    {headers: {'COG-TOKEN': jwtToken}}
  )
}

export testfunc = withAuth(testRequest)