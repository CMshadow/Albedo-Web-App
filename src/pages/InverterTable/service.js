import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const addInverter = ({values}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/pv/${session.idToken.payload.sub}`,
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
  })
}

export const getInverter = () => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/pv/${session.idToken.payload.sub}`,
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
  })
}

export const deleteInverter = ({pvID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/pv/${session.idToken.payload.sub}`,
    {
      params: {pvID: pvID},
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
  })
}

export const updateInverter = ({pvID, values}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.put(
    `/pv/${session.idToken.payload.sub}`,
    values,
    {
      params: {pvID: pvID},
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
  })
}
