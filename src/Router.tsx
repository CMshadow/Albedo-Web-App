import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import Register from './pages/user/Register/index'
import Verification from './pages/user/Verification/index'
import Login from './pages/user/Login/index'
import ForgetPassword from './pages/user/ForgetPwd/index'
import EmptyLayout from './layouts/EmptyLayout/EmptyLayout'
import UserLayout from './layouts/UserLayout/UserLayout'
import BasicLayout from './layouts/BasicLayout/BasicLayout'
import ProjectLayout from './layouts/ProjectLayout/ProjectLayout'
import ProjectTable from './pages/ProjectTable/ProjectTable'
import NotFound404 from './pages/404'
import Dashboard from './pages/Project/Dashboard'
const Report = lazy(() => import('./pages/Report/Report'))
const ParamsForm = lazy(() => import('./pages/ParamsForm/ParamsForm'))
const PowerGrid = lazy(() => import('./pages/PowerGrid/PowerGrid'))
const PVTable = lazy(() => import('./pages/PVTable'))
const InverterTable = lazy(() => import('./pages/InverterTable'))
const SLD = lazy(() => import('./pages/SingleLineDiagram'))
const WeatherManager = lazy(() => import('./pages/WeatherManager'))
const WeatherPortfolio = lazy(() => import('./pages/WeatherPortfolio'))

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<EmptyLayout />}>
        <ScrollToTop />
        <Switch>
          <Route path='/user'>
            <UserLayout>
              <Switch>
                <PublicRoute path='/user/login'>
                  <Login />
                </PublicRoute>
                <PublicRoute path='/user/forget'>
                  <ForgetPassword />
                </PublicRoute>
                <PublicRoute path='/user/register'>
                  <Register />
                </PublicRoute>
                <PublicRoute path='/user/verify'>
                  <Verification />
                </PublicRoute>
              </Switch>
            </UserLayout>
          </Route>
          <PrivateRoute path='/project/:projectID'>
            <ProjectLayout>
              <Switch>
                <PrivateRoute path='/project/:projectID/dashboard'>
                  <Dashboard />
                </PrivateRoute>
                <PrivateRoute path='/project/:projectID/powergrid'>
                  <PowerGrid />
                </PrivateRoute>
                <PrivateRoute path='/project/:projectID/params'>
                  <ParamsForm />
                </PrivateRoute>
                <PrivateRoute path='/project/:projectID/report/:buildingID'>
                  <Report />
                </PrivateRoute>
                <PrivateRoute path='/project/:projectID/singleLineDiagram/:buildingID'>
                  <SLD />
                </PrivateRoute>
              </Switch>
            </ProjectLayout>
          </PrivateRoute>
          <PrivateRoute path='/pv'>
            <BasicLayout>
              <PVTable />
            </BasicLayout>
          </PrivateRoute>
          <PrivateRoute path='/inverter'>
            <BasicLayout>
              <InverterTable />
            </BasicLayout>
          </PrivateRoute>
          <PrivateRoute path='/weather'>
            <BasicLayout>
              <Switch>
                <PrivateRoute path='/weather/:portfolioID'>
                  <WeatherPortfolio />
                </PrivateRoute>
                <PrivateRoute path='/weather'>
                  <WeatherManager />
                </PrivateRoute>
              </Switch>
            </BasicLayout>
          </PrivateRoute>
          <PrivateRoute path='/' exact>
            <BasicLayout>
              <ProjectTable />
            </BasicLayout>
          </PrivateRoute>
          <Route path='*' component={NotFound404} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
