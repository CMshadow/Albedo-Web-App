import { Auth } from 'aws-amplify';
import { setCognitoUserSession } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const genReport = ({projectID, buildingID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.post(
    `/project/${session.idToken.payload.sub}/${projectID}/report`,
    {},
    {
      params: {buildingID: buildingID},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
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
    `/project/${session.idToken.payload.sub}/${projectID}/report`,
    {
      params: {buildingID: buildingID},
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
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
      `/project/${session.idToken.payload.sub}/${projectID}/report`,
      reportData[buildingID],
      {
        params: {buildingID: buildingID},
        headers: {'COG-TOKEN': session.idToken.jwtToken}
      }
    )
  )
  return Promise.all(allPromise)
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const deleteReport = ({projectID}) => async dispatch => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))

  return axios.delete(
    `/project/${session.idToken.payload.sub}/${projectID}/report`,
    {
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
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
    `/project/${session.idToken.payload.sub}/${projectID}/production`,
    {
      params: {buildingID: buildingID, month: month, day: day, dataKey: dataKey},
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
    `/project/${session.idToken.payload.sub}/${projectID}/production`,
    {
      headers: {'COG-TOKEN': session.idToken.jwtToken}
    }
  )
  .then(res => res.data)
  .catch(err => {
    notification.error({message: err.response.data.message})
    throw err
  })
}
