import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import axios from '../../axios.config';

export const googleGeocoder = async ({address, key}) => {
  return axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {params: {address: address, key: key}}
  )
}

export const amapGeocoder = async ({address, key}) => {
  return axios.get(
    'https://restapi.amap.com/v3/geocode/geo',
    {params: {address: address, key: key}}
  )
}

export const getApiKey = () => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    '/apikeysender',{headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
}
