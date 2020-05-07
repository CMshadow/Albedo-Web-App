import React from 'react';
import Register from '../pages/user/register/index';
import Verification from '../pages/user/verification/index';
import Login from '../pages/user/login/index';
import UserLayout from '../layouts/UserLayout/UserLayout';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const Router = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/user">
          <UserLayout>
            <Switch>
              <Route path='/user/login' component={Login} />
              <Route path="/user/register" component={Register} />
              <Route path="/user/verify/:userSub" component={Verification} />
            </Switch>
          </UserLayout>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
