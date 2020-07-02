import { Auth } from 'aws-amplify';
import { notification } from 'antd';
import { setCognitoUserSession } from '../../store/action/index';
import axios from '../../axios.config';

export const getProject = ({projectID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}/${projectID}`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const globalOptTiltAzimuth = ({projectID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/project/${session.idToken.payload.sub}/${projectID}/opttiltazimuth`,
    {},
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    console.log(err)
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const allTiltAzimuthPOA = ({projectID, startAzi, endAzi}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/project/${session.idToken.payload.sub}/${projectID}/alltiltazimuthpoa`,
    {},
    {
      params: {startAzi: startAzi, endAzi: endAzi},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => res.data)
  .catch(err => {
    console.log(err)
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const saveProject = (projectID) => async (dispatch, getState) => {
  const projectData = getState().project
  console.log(projectData)
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))
  return axios.put(
    `/project/${session.idToken.payload.sub}/${projectID}`,
    projectData,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
}

export const manualInverter = ({projectID, invID, invUserID, pvID, pvUserID, ttlPV}) =>
async (dispatch, getState) => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}/${projectID}/manualinverter`,
    {
      params: {
        inverterModel: {
          inverterID: invID,
          userID: invUserID
        },
        pvModel: {
          pvID: pvID,
          userID: pvUserID
        },
        ttlPV: ttlPV,
        pvMode: 'single'
      },
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => res.data)
  .catch(err => {
    console.log(err)
    notification.error({message: err.response.data.message})
    throw err
  })
}
