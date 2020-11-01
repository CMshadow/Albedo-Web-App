import React from 'react';
import { Provider } from 'react-redux'
import AuthGateway from './components/AuthGateway'
import './App.less';
import Amplify from 'aws-amplify';
import cognitoConfig from './auth.config';
import { store } from './store.config'
import AntdConfig from './antd.config'
import Router from './Router';

Amplify.configure(cognitoConfig);

const App = () => {

  return (
    <Provider store={store}>
      <AntdConfig>
        <AuthGateway>
          <Router />
        </AuthGateway>
      </AntdConfig>
    </Provider>
  );
}

export default App;
