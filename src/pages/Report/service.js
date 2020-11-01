import { Auth } from 'aws-amplify';
import { setSignOut } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const genReport = ({projectID, buildingID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.post(
      `/project/${auth.username}/${projectID}/${buildingID}/report`,
      {},
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getReport = ({projectID, buildingID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.get(
      `/project/${auth.username}/${projectID}/${buildingID}/report`,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      // notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const saveReport = ({projectID}) => async (dispatch, getState) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    const reportData = getState().report
    const allPromise = Object.keys(reportData).map(buildingID =>
      axios.put(
        `/project/${auth.username}/${projectID}/${buildingID}/report`,
        reportData[buildingID],
        {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
      )
    )
    return Promise.all(allPromise)
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const deleteReport = ({projectID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.delete(
      `/project/${auth.username}/${projectID}/_/report`,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getProductionData = ({projectID, buildingID, month, day, dataKey}) =>
async (dispatch, getState) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.get(
      `/project/${auth.username}/${projectID}/${buildingID}/production`,
      {
        params: {month: month, day: day, dataKey: dataKey},
        headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}
      }
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const deleteProductionData = ({projectID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.delete(
      `/project/${auth.username}/${projectID}/_/production`,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getIrradianceData = ({projectID, buildingID, month, day, tilt, azimuth}) =>
async (dispatch, getState) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.get(
      `/project/${auth.username}/${projectID}/${buildingID}/irradiance`,
      {
        params: {month: month, day: day, tilt: tilt, azimuth: azimuth},
        headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}
      }
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const deleteIrradianceData = ({projectID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.delete(
      `/project/${auth.username}/${projectID}/_/irradiance`,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const downloadReportCSV = ({projectID, buildingID}) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios.get(
      `/project/${auth.username}/${projectID}/${buildingID}/csv`,
      {headers: {'COG-TOKEN': auth.signInUserSession.idToken.jwtToken}}
    )
    .then(res => res.data)
    .catch(err => {
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}