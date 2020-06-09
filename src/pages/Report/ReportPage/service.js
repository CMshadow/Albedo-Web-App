import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../../store/action/index';
import { notification } from 'antd';
import axios from '../../../axios.config';

export const getReport = ({projectID, buildingIndex, year}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}/${projectID}/report`,
    {
      params: {buildingIndex: buildingIndex, year: year},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}
