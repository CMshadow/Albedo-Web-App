import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Register from './pages/user/Register/index';
import Verification from './pages/user/Verification/index';
import Login from './pages/user/Login/index';
import UserLayout from './layouts/UserLayout/UserLayout';
import BasicLayout from './layouts/BasicLayout/BasicLayout';
import ProjectLayout from './layouts/ProjectLayout/ProjectLayout'
import ProjectTable from './pages/ProjectTable/ProjectTable';
import PVTable from './pages/PVTable/index';
import Dashboard from './pages/Project/Dashboard';
import InverterTable from './pages/InverterTable/index';
import NotFound404 from './pages/404';

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
        <PrivateRoute path="/project">
          <ProjectLayout>
            <Switch>
              <PrivateRoute path='/project/:projectID/dashboard' component={Dashboard} />
              <PrivateRoute path="/project/:projectID/pv" component={PVTable} />
              <PrivateRoute path="/project/:projectID/inverter" component={InverterTable} />
              <Route path='*' component={NotFound404} />
            </Switch>
          </ProjectLayout>
        </PrivateRoute>
        <PrivateRoute path="/">
          <BasicLayout>
            <Switch>
              <PrivateRoute path='/dashboard' component={ProjectTable} />
              <Route path='*' component={NotFound404} />
            </Switch>
          </BasicLayout>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
