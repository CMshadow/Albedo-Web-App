import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const genReport = ({projectID, buildingID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/project/${session.idToken.payload.sub}/${projectID}/${buildingID}/report`,
    {},
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const getReport = ({projectID, buildingID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}/${projectID}/${buildingID}/report`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    // notification.error({message: err.response.data.message})
    throw err
  })
}

export const saveReport = ({projectID}) => async (dispatch, getState) => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))
  const reportData = getState().report
  const allPromise = Object.keys(reportData).map(buildingID =>
    axios.put(
      `/project/${session.idToken.payload.sub}/${projectID}/${buildingID}/report`,
      reportData[buildingID],
      {headers: {'COG-TOKEN': session.idToken.jwtToken}}
    )
  )
  return Promise.all(allPromise)
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const deleteReport = ({projectID, buildingID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/project/${session.idToken.payload.sub}/${projectID}/${buildingID}/report`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const getProductionData = ({projectID, buildingID, month, day, dataKey}) =>
async (dispatch, getState) => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}/${projectID}/${buildingID}/production`,
    {
      params: {month: month, day: day, dataKey: dataKey},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const deleteProductionData = ({projectID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/project/${session.idToken.payload.sub}/${projectID}/_/production`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const getIrradianceData = ({projectID, buildingID, month, day, tilt, azimuth}) =>
async (dispatch, getState) => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.get(
    `/project/${session.idToken.payload.sub}/${projectID}/${buildingID}/irradiance`,
    {
      params: {month: month, day: day, tilt: tilt, azimuth: azimuth},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const deleteIrradianceData = ({projectID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/project/${session.idToken.payload.sub}/${projectID}/_/irradiance`,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}
