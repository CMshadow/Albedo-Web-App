import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PublicRoute = ({ component: Component, ...rest }) => {
  const cognitoUser = useSelector(state => state.auth.cognitoUser);

  return (
    <Route {...rest} render={props =>
      cognitoUser === 'invalid' ? (
        <Component {...props} />
      ) : (
        <Redirect to='/dashboard' />
      )
    }
    />
  );
};
export default PublicRoute;
