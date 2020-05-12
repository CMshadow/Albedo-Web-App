import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const cognitoUser = useSelector(state => state.auth.cognitoUser);

  return (
    <Route {...rest} render={props => {
      if (cognitoUser === 'invalid') {
        return <Redirect to='/user/login' />
      } else if (cognitoUser && !cognitoUser.attributes.email_verified) {
        return <Redirect to='/user/verify' />
      } else{
        return <Component {...props} />
      }
    }}
    />
  );
};
export default PrivateRoute;
