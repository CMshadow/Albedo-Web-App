import { Auth } from 'aws-amplify'
import { notification } from 'antd'
import { setSignOut } from '../../store/action/index'
import axios from '../../axios.config'

export const getProject = ({ projectID }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/project/${auth.username}/${projectID}`, {
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const globalOptTiltAzimuth = ({ projectID }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .post(
        `/project/${auth.username}/${projectID}/opttiltazimuth`,
        {},
        { headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken } }
      )
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const allTiltAzimuthPOA = ({ projectID, startAzi, endAzi }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .post(
        `/project/${auth.username}/${projectID}/alltiltazimuthpoa`,
        {},
        {
          params: { startAzi: startAzi, endAzi: endAzi },
          headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
        }
      )
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const saveProject = projectID => async (dispatch, getState) => {
  try {
    const projectData = getState().project
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .put(`/project/${auth.username}/${projectID}`, projectData, {
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const manualInverter = ({ projectID, invID, invUserID, pvID, pvUserID, ttlPV }) => async (
  dispatch,
  getState
) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/project/${auth.username}/${projectID}/manualinverter`, {
        params: {
          inverterModel: {
            inverterID: invID,
            userID: invUserID,
          },
          pvModel: {
            pvID: pvID,
            userID: pvUserID,
          },
          ttlPV: ttlPV,
          pvMode: 'single',
        },
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const inverterLimit = ({ projectID, invID, invUserID, pvID, pvUserID }) => async (
  dispatch,
  getState
) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/project/${auth.username}/${projectID}/inverterlimit`, {
        params: {
          inverterModel: {
            inverterID: invID,
            userID: invUserID,
          },
          pvModel: {
            pvID: pvID,
            userID: pvUserID,
          },
        },
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const wiringOptions = ({ type, ...values }) => async (dispatch, getState) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/wiringoptions`, {
        params: {
          type: type,
          ut: values.Ut,
        },
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const wiringChoice = ({ type, ...values }) => async (dispatch, getState) => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/wiringchoice`, {
        params: {
          type: type,
          ut: values.Ut,
          se: values.Se,
          transformercablelen: values.TransformerCableLen,
          allowacvoldropfac: values.allowACVolDropFac,
          ib: values.Ib,
        },
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification.error({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}
