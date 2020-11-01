import { Auth } from 'aws-amplify';
import { notification } from 'antd';
import { setSignOut } from '../../store/action/index';
import axios from '../../axios.config';

export const googleGeocoder = async ({address, key}) => {
  return axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {params: {address: address, key: key}}
  )
}

export const googleRevGeocoder = ({lon, lat, key}) => {
  return axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json?',
    {params: {latlng: `${lat},${lon}`, key: key}}
  )
}

export const amapGeocoder = async ({address, key}) => {
  return axios.get(
    'https://restapi.amap.com/v3/geocode/geo',
    {params: {address: address, key: key}}
  )
}

export const amapRevGeocoder = async ({lon, lat, key}) => {
  return axios.get(
    'https://restapi.amap.com/v3/geocode/regeo',
    {params: {location: `${lon},${lat}`, key: key}}
  )
}

export const getApiKey = () => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.get(
      '/apikeysender',{headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      notification({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const createProject = (values) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.post(
      `/project/${auth.username}`,
      values,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      notification({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getProject = () => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.get(
      `/project/${auth.username}`,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      notification({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const deleteProject = ({projectID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.delete(
      `/project/${auth.username}`,
      {
        params: {projectID: projectID},
        headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}
      }
    )
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      notification({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}
