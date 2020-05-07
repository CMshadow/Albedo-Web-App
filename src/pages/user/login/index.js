import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { userPool, CreateAuthDetails } from '../../../utils/cognito';
import { useHistory } from "react-router-dom";
import { Form, Button, Input, notification, Row, Checkbox } from 'antd';
import * as actions from '../../../store/action/index';
const FormItem = Form.Item;

const Login = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [check, setcheck] = useState(true);

  const onFinish = (values) => {
    props.setAuthLoading(true);
    Auth.signIn(values.mail, values.password).then(res => {
      console.log(res)
    })
    .catch(err => {
      alert(err.message || JSON.stringify(err));
      return;
    });
  }

  return (
    <div className={styles.main}>
      <h2>
        {t('user.login.welcome')}
      </h2>
      <Form form={form} name="Login" onFinish={onFinish}>
        <Row>
          {t('user.required.email')}
        </Row>
        <FormItem
          name="mail"
          rules={[
            {
              required: true,
              message: t('user.required'),
            },
            {
              type: 'email',
              message: t('user.format.email'),
            },
          ]}
        >
          <Input size="large" placeholder={t('user.placeholder.email')} />
        </FormItem>
        <Row>
          {t('user.required.password')}
        </Row>
        <FormItem
          name="password"
          className={styles.password}
          rules={[
            {
              required: true,
              message: t('user.required'),
            },
          ]}
        >
          <Input size="large" type="password" placeholder={t('user.required.password')}/>
        </FormItem>
        <Checkbox className={styles.floatleft} checked={check} onChange={e => setcheck(!check)}>
          {t('user.save-login')}
        </Checkbox>
        <Link className={styles.floatright} to="/user/register">
          {t('user.forget-password')}
        </Link>
        <FormItem className={styles.submit}>
          <Button
            size="large"
            loading={props.authLoading}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            {t('user.login')}
          </Button>
        </FormItem>
        <Link className={styles.floatright} to="/user/register">
          {t('user.to-sign-up')}
        </Link>
      </Form>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    authLoading: state.auth.loading
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setCognitoUser: (cognitoUser) => dispatch(actions.setCognitoUser(cognitoUser)),
    setVerified: (bool) => dispatch(actions.setVerified(bool)),
    setAuthLoading: (bool) => dispatch(actions.setAuthLoading(bool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
