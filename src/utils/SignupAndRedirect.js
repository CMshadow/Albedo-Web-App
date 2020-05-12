import { Auth } from 'aws-amplify';
import { setCognitoUser } from '../store/action/index';
import { notification } from 'antd';
import { getLanguage } from './getLanguage';

export const SignupAndRedirect = ({email, password, lastname, firstname, history, dispatch, t, setloading}) => {
  Auth.signUp({
    username: email,
    password: password,
    attributes: {
      family_name: lastname,
      given_name: firstname,
      locale: getLanguage()
    }
  })
  .then(res => {
    const cognitoUser = res.user;
    return new Promise((resolve, reject) => {
      setloading(false);
      dispatch(setCognitoUser(cognitoUser));
      resolve();
    }).then(() => {
      history.push({
        pathname: '/user/verify',
        state: { username: cognitoUser.getUsername(), password: password }
      });
    })
  })
  .catch(err => {
    notification.error({
      message: t('user.error.register'),
      description: t(`user.error.${err.code}`)
    })
    setloading(false);
    return;
  })
}
