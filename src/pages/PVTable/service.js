import { Auth } from 'aws-amplify'
import { setSignOut } from '../../store/action/index'
import { notification } from 'antd'
import axios from '../../axios.config'

export const addPV = ({ values }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .post(`/pv/${auth.username}`, values, {
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

export const getPV = () => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/pv/${auth.username}`, {
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

export const getOfficialPV = region => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/pv/official`, {
        params: { region: region },
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

export const deletePV = ({ pvID }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .delete(`/pv/${auth.username}`, {
        params: { pvID: pvID },
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

export const updatePV = ({ pvID, values }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .put(`/pv/${auth.username}`, values, {
        params: { pvID: pvID },
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

export const getIVCurve = ({ pvID, userID }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/pv/ivcurve`, {
        params: { pvID: pvID, userID: userID },
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

export const parsePAN = (fileText, extraParam) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .post(`/parsepan`, fileText, {
        ...extraParam,
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
