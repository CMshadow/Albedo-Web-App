import { Auth } from 'aws-amplify';
import { notification } from 'antd';
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

export const createProject = (values) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/project/${session.idToken.payload.sub}`,
    values,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
}

export const getProject = () => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    notification.error({
      message: err.errorType,
      description: err.errorMessage
    })
    throw err
  })
}

export const deleteProject = ({projectID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/project/${session.idToken.payload.sub}`,
    {
      params: {projectID: projectID},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => {
    console.log(res)
    return res.data.payload
  })
  .catch(err => {
    console.log(err)
    notification.error({
      message: err.errorType,
      description: err.errorMessage
    })
    throw err
  })
}
