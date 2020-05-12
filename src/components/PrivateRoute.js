import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const cognitoUser = useSelector(state => state.auth.cognitoUser);
  return (
    <Route {...rest} render={props => {
      if (!cognitoUser) {
        return <Redirect to='/user/login' />
      } else {
        return <Component {...props} />
      }
    }}
    />
  );
};
export default PrivateRoute;
