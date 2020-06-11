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
    notification.error({message: err.response.data.message})
    throw err
  })
}

export const saveReport = ({projectID, buildingID}) => async (dispatch, getState) => {
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))
  const reportData = getState().report[buildingID]

  return axios.put(
    `/project/${session.idToken.payload.sub}/${projectID}/report`,
    reportData,
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
