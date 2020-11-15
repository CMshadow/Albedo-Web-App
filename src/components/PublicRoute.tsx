import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../@types'

const PublicRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  return (
    <Route
      {...rest}
      render={() => (!cognitoUser ? children : <Redirect to={{ pathname: '/dashboard' }} />)}
    />
  )
}
export default PublicRoute
