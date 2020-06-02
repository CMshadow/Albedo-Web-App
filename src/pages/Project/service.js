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

export const saveProject = (projectID) => async (dispatch, getState) => {
  const projectData = getState().project
  const session = await Auth.currentSession()
  dispatch(setCognitoUserSession(session))
  return axios.put(
    `/project/${session.idToken.payload.sub}/${projectID}`,
    projectData,
    {headers: {'COG-TOKEN': session.idToken.jwtToken}}
  )
  .then(res => res.data)
}
