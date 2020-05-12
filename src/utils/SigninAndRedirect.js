import { Auth } from 'aws-amplify';
import { setCognitoUser } from '../store/action/index';
import { notification } from 'antd';

export const SigninAndRedirect = ({username, password, history, dispatch, t, setloading}) => {
  Auth.signIn(username, password)
  .then(res => {
    return new Promise((resolve, reject) => {
      dispatch(setCognitoUser(res));
      resolve();
    }).then(() => {history.push('/dashboard')})
  })
  .catch(err => {
    if (err.code === 'UserNotConfirmedException') {
      history.push({
        pathname: '/user/verify',
        state: { username: username, password: password }
      });
      return;
    } else {
      notification.error({
        message: t('user.error.login'),
        description: t(`user.error.${err.code}`)
      })
      setloading(false);
      return;
    }
  });
}
