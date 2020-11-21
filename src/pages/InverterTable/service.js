import { Auth } from 'aws-amplify'
import { setSignOut } from '../../store/action/index'
import { notification } from 'antd'
import axios from '../../axios.config'

export const addInverter = ({ values }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()
    return axios
      .post(`/inverter/${auth.username}`, values, {
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getInverter = () => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/inverter/${auth.username}`, {
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getOfficialInverter = region => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/inverter/official`, {
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

export const deleteInverter = ({ inverterID }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .delete(`/inverter/${auth.username}`, {
        params: { inverterID: inverterID },
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const updateInverter = ({ inverterID, values }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .put(`/inverter/${auth.username}`, values, {
        params: { inverterID: inverterID },
        headers: { 'COG-TOKEN': auth.signInUserSession.idToken.jwtToken },
      })
      .then(res => res.data)
      .catch(err => {
        console.log(err)
        notification({ message: err.response.data.message })
        throw err
      })
  } catch (err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const getPerformanceCurve = ({ inverterID, userID }) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .get(`/inverter/inverterperformance`, {
        params: { inverterID: inverterID, userID: userID },
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

export const parseOND = (fileText, extraParam) => async dispatch => {
  try {
    const auth = await Auth.currentAuthenticatedUser()

    return axios
      .post(`/parseond`, fileText, {
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
