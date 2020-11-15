import { Auth } from 'aws-amplify'
import { CognitoUserExt, AxiosBasicParams } from '../@types'

const withAuth = <T extends AxiosBasicParams, R>(wrappedFunc: (params: T) => Promise<R>) => {
  // const auth: CognitoUserExt = await Auth.currentAuthenticatedUser()
  // const username = auth.getUsername()
  // const session = auth.getSignInUserSession()
  // const jwtToken = session?.getIdToken().getJwtToken() || ''

  return (params: Omit<T, keyof AxiosBasicParams>) => {
    const newParams = { username: '1', jwtToken: '1', ...params } as T
    return wrappedFunc(newParams)
  }
}

export default withAuth
