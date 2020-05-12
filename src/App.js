import React from 'react';
import Router from './components/Router';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import './App.scss';
import Amplify from 'aws-amplify';
import cognitoConfig from './auth.config';
import configureStore from './store.config';

Amplify.configure(cognitoConfig);

const App = () => {
  const {store, persistor} = configureStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
}

export default App;
