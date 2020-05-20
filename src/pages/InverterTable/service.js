import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const addInverter = ({values}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/inverter/${session.idToken.payload.sub}`,
    values,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => {
    console.log(res)
    return
  })
  .catch(err => {
    notification.error({
      message: err.errorType,
      description: err.errorMessage
    })
    throw err
  })
}

export const getInverter = () => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/inverter/${session.idToken.payload.sub}`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => {
    console.log(res)
    return res.data.payload
  })
  .catch(err => {
    notification.error({
      message: err.errorType,
      description: err.errorMessage
    })
    throw err
  })
}

export const deleteInverter = ({inverterID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/inverter/${session.idToken.payload.sub}`,
    {
      params: {inverterID: inverterID},
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

export const updateInverter = ({inverterID, values}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.put(
    `/inverter/${session.idToken.payload.sub}`,
    values,
    {
      params: {inverterID: inverterID},
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
