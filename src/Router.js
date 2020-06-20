import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop'
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Register from './pages/user/Register/index';
import Verification from './pages/user/Verification/index';
import Login from './pages/user/Login/index';
import UserLayout from './layouts/UserLayout/UserLayout';
import BasicLayout from './layouts/BasicLayout/BasicLayout';
import ProjectLayout from './layouts/ProjectLayout/ProjectLayout'
import ProjectTable from './pages/ProjectTable/ProjectTable';
import ModelingPage from './pages/Modeling/Modeling'
import PVTable from './pages/PVTable/index';
import Report from './pages/Report/Report'
import ParamsForm from './pages/ParamsForm/ParamsForm'
import Dashboard from './pages/Project/Dashboard';
import InverterTable from './pages/InverterTable/index';
import NotFound404 from './pages/404';
import FakeParking from './components/FakeParking/FakeParking'

const Router = () => {
  return(
    <BrowserRouter>
      <ScrollToTop />
      <Switch>
        <Route path="/me" component={FakeParking} />
        <Route path="/user">
          <UserLayout>
            <Switch>
              <PublicRoute path='/user/login'>
                <Login/>
              </PublicRoute>
              <PublicRoute path="/user/register">
                <Register />
              </PublicRoute>
              <PublicRoute path="/user/verify">
                <Verification/>
              </PublicRoute>
              <Route path='*'>
                <NotFound404/>
              </Route>
            </Switch>
          </UserLayout>
        </Route>
        <PrivateRoute path="/project">
          <ProjectLayout>
            <Switch>
              <PrivateRoute path='/project/:projectID/dashboard'>
                <Dashboard/>
              </PrivateRoute>
              <PrivateRoute path="/project/:projectID/report/params">
                <ParamsForm/>
              </PrivateRoute>
              <PrivateRoute path="/project/:projectID/report/:buildingID">
                <Report/>
              </PrivateRoute>
              <PrivateRoute path="/project/:projectID/pv">
                <PVTable/>
              </PrivateRoute>
              <PrivateRoute path="/project/:projectID/inverter">
                <InverterTable/>
              </PrivateRoute>
              <PrivateRoute path='*'>
                <NotFound404/>
              </PrivateRoute>
            </Switch>
          </ProjectLayout>
        </PrivateRoute>
        <PrivateRoute path="/modeling">
          <Switch>
            <PrivateRoute path='/modeling/:projectID'>
              <ModelingPage/>
            </PrivateRoute>
            <PrivateRoute path='*'>
              <NotFound404/>
            </PrivateRoute>
          </Switch>
        </PrivateRoute>
        <PrivateRoute path="/">
          <BasicLayout>
            <Switch>
              <PrivateRoute path='/dashboard'>
                <ProjectTable/>
              </PrivateRoute>
              <Redirect path='*' to="/user/login"/>
              {/* <Route path='*' component={NotFound404} /> */}
            </Switch>
          </BasicLayout>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
