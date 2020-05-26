import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import axios from '../../axios.config';

export const getProject = (projectID) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}`,
    {
      params: {projectID: projectID},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
}
