import { Auth } from 'aws-amplify'
import { AxiosBasicParams, CognitoUserExt } from '../@types'

const injectAuth = <T extends AxiosBasicParams, R>(func: (p: T) => Promise<R>) => {
  return async (params: Omit<T, keyof AxiosBasicParams>) => {
    const auth: CognitoUserExt = await Auth.currentAuthenticatedUser()
    const username = auth.getUsername()
    const session = auth.getSignInUserSession()
    const jwtToken = session?.getIdToken().getJwtToken() || ''
    const newParams = { ...params, username: username, jwtToken: jwtToken } as T

    return func(newParams)
  }
}

export default injectAuth
