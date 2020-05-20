import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Register from '../pages/user/register/index';
import Verification from '../pages/user/verification/index';
import Login from '../pages/user/login/index';
import UserLayout from '../layouts/UserLayout/UserLayout';
import BasicLayout from '../layouts/BasicLayout/BasicLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import PVTable from '../pages/PVTable/PVTable';
import InverterTable from '../pages/InverterTable/InverterTable';
import NotFound404 from '../pages/404';

const Router = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/user">
          <UserLayout>
            <Switch>
              <PublicRoute path='/user/login' component={Login} />
              <PublicRoute path="/user/register" component={Register} />
              <PublicRoute path="/user/verify" component={Verification} />
              <Route path='*' component={NotFound404} />
            </Switch>
          </UserLayout>
        </Route>
        <PrivateRoute path="/">
          <BasicLayout>
            <Switch>
              <PrivateRoute path='/dashboard' component={Dashboard} />
              <PrivateRoute path="/pv" component={PVTable} />
              <PrivateRoute path="/inverter" component={InverterTable} />
              <Route path='*' component={NotFound404} />
            </Switch>
          </BasicLayout>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
