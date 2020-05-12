import React, {useEffect} from 'react';
import Router from './router/index';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './store/reducer/index';
import './App.scss';
import Amplify, { Auth } from 'aws-amplify';
import config from './auth.config';
import { SET_COGNITOUSER } from './store/action/actionTypes';
import { composeWithDevTools } from 'redux-devtools-extension';

Amplify.configure(config);
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

const App = () => {
  Auth.currentAuthenticatedUser({})
  .then(user => {
    console.log(user)
    store.dispatch({
      type: SET_COGNITOUSER,
      cognitoUser: user
    })
  })
  .catch(err => {
    console.log(err)
    store.dispatch({
      type: SET_COGNITOUSER,
      cognitoUser: 'invalid'
    })
  });

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
