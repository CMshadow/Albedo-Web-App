import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, ...rest }) => {
  const cognitoUser = useSelector(state => state.auth.cognitoUser);
  return (
    <Route
      {...rest}
      render={() => cognitoUser ? children : <Redirect to={{pathname: "/user/login"}}/>}
    />
  );
};
export default PrivateRoute;
