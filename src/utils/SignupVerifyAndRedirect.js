import { Auth } from 'aws-amplify';
import { notification } from 'antd';
import { SigninAndRedirect } from './SigninAndRedirect';

export const SignupVerifyAndRedirect = (
  {username, verification, password, history, dispatch, t, setloading}
) => {
  Auth.confirmSignUp(username, verification)
  .then(res => {
    setloading(false);
    SigninAndRedirect({
      username: username,
      password: password,
      history, dispatch, t, setloading
    })
  })
  .catch(err => {
    notification.error({
      message: t('user.error.verification'),
      description: t(`user.error.${err.code}`)
    })
    setloading(false);
    return;
  })
}
