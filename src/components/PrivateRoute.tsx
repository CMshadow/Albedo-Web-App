import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../@types'

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  return (
    <Route
      {...rest}
      render={() => (cognitoUser ? children : <Redirect to={{ pathname: '/user/login' }} />)}
    />
  )
}
export default PrivateRoute
