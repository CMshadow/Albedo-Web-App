import { Auth } from 'aws-amplify';
import { setCognitoUser, setCognitoUserSession } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const addPV = ({values}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))
  
  return axios.post(`/pv/${session.idToken.payload.sub}`, values, {headers: {'COG-TOKEN': session.idToken.jwtToken}})
  .then(res => {
    console.log(res)
    return
  })
  .catch(err => {
    notification.error({
      message: err.errorType,
      description: err.errorMessage
    })
  })
}
