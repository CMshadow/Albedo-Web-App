import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop'
import { getLanguage } from './utils/getLanguage'
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Register from './pages/user/Register/index';
import Verification from './pages/user/Verification/index';
import Login from './pages/user/Login/index';
import EmptyLayout from './layouts/EmptyLayout/EmptyLayout'
import UserLayout from './layouts/UserLayout/UserLayout';
import BasicLayout from './layouts/BasicLayout/BasicLayout';
import ProjectLayout from './layouts/ProjectLayout/ProjectLayout'
import ProjectTable from './pages/ProjectTable/ProjectTable';
import NotFound404 from './pages/404';
import Term from './pages/static/Term'
import Cookie from './pages/static/Cookie'
import Privacy from './pages/static/Privacy'
import ModelingLayout from './layouts/Modeling/ModelingLayout/ModelingLayout'
import DisplayPage from './pages/static/DisplayPage/index'
import EnDisplayPage from './pages/static/EnDisplayPage/index'
import VideoPage from './pages/static/VideoPage/VideoPage'
import EnVideoPage from './pages/static/EnVideoPage/EnVideoPage'
const Report = lazy(() => import('./pages/Report/Report'))
const ParamsForm = lazy(() => import('./pages/ParamsForm/ParamsForm'))
const Dashboard = lazy(() => import('./pages/Project/Dashboard'))
const PVTable = lazy(() => import('./pages/PVTable/index'))
const InverterTable = lazy(() => import('./pages/InverterTable/index'))
const ModelingPage = lazy(() => import('./pages/Modeling/Modeling'))
const SLD = lazy(() => import('./pages/SingleLineDiagram/index'))

const Router = () => {
  return(
    <BrowserRouter>
      <Suspense fallback={<EmptyLayout/>} >
        <ScrollToTop />
        <Switch>
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
          <PrivateRoute path="/project/:projectID">
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
                <PrivateRoute path="/project/:projectID/singleLineDiagram/:buildingID">
                 <SLD/>
                </PrivateRoute>
                <PrivateRoute path='*'>
                  <NotFound404/>
                </PrivateRoute>
              </Switch>
            </ProjectLayout>
          </PrivateRoute>
          <PrivateRoute path='/modeling'>
            <ModelingLayout>
              <Switch>
                <PrivateRoute path='/modeling/:projectID'>
                  <ModelingPage/>
                </PrivateRoute>
              </Switch>
            </ModelingLayout>
          </PrivateRoute>
          <Route path="/terms">
            <Term />
          </Route>
          <Route path="/cookie">
            <Cookie />
          </Route>
          <Route path="/privacy">
            <Privacy />
          </Route>
          <PrivateRoute path='/dashboard'>
            <BasicLayout>
              <ProjectTable/>
            </BasicLayout>
          </PrivateRoute>
          <Route path="/">
            <Switch>
              <Route path="/cn/tutorial" component={VideoPage} />
              <Route path="/en/tutorial" component={EnVideoPage} />
              <Route path="/cn" component={DisplayPage} />
              <Route path="/en" component={EnDisplayPage} />
              <Route path="/">
                {
                  getLanguage() === 'zh-CN' ?
                  <DisplayPage /> : <EnDisplayPage />
                }
              </Route>
              <Route path='*' component={NotFound404} />
            </Switch>
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
