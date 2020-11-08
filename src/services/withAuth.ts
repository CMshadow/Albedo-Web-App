import { Auth } from 'aws-amplify'
import { CognitoUserExt } from '../@types'


const withAuth = async (wrappedFunc: Function, ...args: any[]) => {
  const auth: CognitoUserExt = await Auth.currentAuthenticatedUser()
  const username = auth.getUsername()
  const session = auth.getSignInUserSession()
  const jwtToken = session?.getIdToken().getJwtToken()
  
  return wrappedFunc(...args, username, jwtToken)
}

export default withAuth