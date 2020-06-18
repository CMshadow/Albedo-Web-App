import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PublicRoute = ({ children, ...rest }) => {
  const cognitoUser = useSelector(state => state.auth.cognitoUser);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !cognitoUser ? (
          children
        ) : (
          <Redirect
            to={{pathname: '/dashboard'}}
          />
        )
      }
    />
  );
};
export default PublicRoute;
