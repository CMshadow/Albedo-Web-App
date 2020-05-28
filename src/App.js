import React from 'react';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import './App.scss';
import Amplify from 'aws-amplify';
import cognitoConfig from './auth.config';
import configureStore from './store.config';
import AntdConfig from './antd.config'
import Router from './Router';

Amplify.configure(cognitoConfig);

const App = () => {
  const {store, persistor} = configureStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AntdConfig>
          <Router />
        </AntdConfig>
      </PersistGate>
    </Provider>
  );
}

export default App;
