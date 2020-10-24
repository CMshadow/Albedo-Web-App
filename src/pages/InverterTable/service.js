import { Auth } from 'aws-amplify';
import { setCognitoUserSession, setSignOut } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const addInverter = ({values}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.post(
      `/inverter/${session.idToken.payload.sub}`,
      values,
      {headers: {'COG-TOKEN': session.idToken.jwtToken}}
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

export const getInverter = () => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.get(
      `/inverter/${session.idToken.payload.sub}`,
      {headers: {'COG-TOKEN': session.idToken.jwtToken}}
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

export const getOfficialInverter = (region) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.get(
      `/inverter/official`,
      {
        params: {region: region},
        headers: {'COG-TOKEN': session.idToken.jwtToken}
      }
    )
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}

export const deleteInverter = ({inverterID}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.delete(
      `/inverter/${session.idToken.payload.sub}`,
      {
        params: {inverterID: inverterID},
        headers: {'COG-TOKEN': session.idToken.jwtToken}
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

export const updateInverter = ({inverterID, values}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.put(
      `/inverter/${session.idToken.payload.sub}`,
      values,
      {
        params: {inverterID: inverterID},
        headers: {'COG-TOKEN': session.idToken.jwtToken}
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

export const parseOND = (fileText, extraParam) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.post(
      `/parseond`,
      fileText,
      {
        ...extraParam,
        headers: {'COG-TOKEN': session.idToken.jwtToken}
      }
    )
    .then(res => res.data)
    .catch(err => {
      console.log(err)
      notification.error({message: err.response.data.message})
      throw err
    })
  } catch(err) {
    Auth.signOut()
    dispatch(setSignOut())
  }
}