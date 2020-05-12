import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { Auth } from 'aws-amplify';
import { useHistory } from "react-router-dom";
import { Form, Button, Input, notification, Row, Checkbox } from 'antd';
import * as actions from '../../../store/action/index';
const FormItem = Form.Item;

const Login = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [check, setcheck] = useState(true);
  const [loading, setloading] = useState(false);

  const onFinish = (values) => {
    setloading(true);
    Auth.signIn(values.mail, values.password)
    .then(res => {
      setloading(false);
      return new Promise((resolve, reject) => {
        props.setCognitoUser(res);
        resolve();
      }).then(() => {history.push(`/dashboard`)})
    })
    .catch(err => {
      console.log(err)
      if (err.code === 'UserNotConfirmedException') {
        history.push({
          pathname: '/user/verify',
          state: { username: values.mail }
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
            loading={loading}
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

const mapDispatchToProps = dispatch => {
  return {
    setCognitoUser: (cognitoUser) => dispatch(actions.setCognitoUser(cognitoUser)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
