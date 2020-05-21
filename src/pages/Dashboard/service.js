import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const googleGeocoder = ({address}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    '/geocoder/google',
    {
      params: {address: address},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
}

export const getApiKey = () => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    '/apikeysender',{headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
}
