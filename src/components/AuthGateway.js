import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { setCognitoUser } from '../store/action/index'

const AuthGateway = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [authenticated, setauthenticated] = useState(false)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
    .then(res => {
      dispatch(setCognitoUser(res))
      setauthenticated(true)
    })
    .catch(err => {
      setauthenticated(true)
    })
  }, [dispatch, history])

  return (
    <div>
      {authenticated ? children : null}
    </div>
  );
};
export default AuthGateway;
