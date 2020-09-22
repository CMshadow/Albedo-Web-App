import { Auth } from 'aws-amplify';
import { setCognitoUserSession, setSignOut } from '../../store/action/index';
import { notification } from 'antd';
import axios from '../../axios.config';

export const addPV = ({values}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.post(
      `/pv/${session.idToken.payload.sub}`,
      values,
      {headers: {'COG-TOKEN': session.idToken.jwtToken}}
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

export const getPV = () => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.get(
      `/pv/${session.idToken.payload.sub}`,
      {headers: {'COG-TOKEN': session.idToken.jwtToken}}
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

export const getOfficialPV = (region) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.get(
      `/pv/official`,
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

export const deletePV = ({pvID}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.delete(
      `/pv/${session.idToken.payload.sub}`,
      {
        params: {pvID: pvID},
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

export const updatePV = ({pvID, values}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.put(
      `/pv/${session.idToken.payload.sub}`,
      values,
      {
        params: {pvID: pvID},
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

export const getIVCurve = ({pvID, userID}) => async dispatch => {
  try {
    const session = await Auth.currentSession()
    dispatch(setCognitoUserSession(session))

    return axios.get(
      `/pv/ivcurve`,
      {
        params: {pvID: pvID, userID: userID},
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