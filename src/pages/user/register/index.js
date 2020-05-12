import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { useHistory } from "react-router-dom";
import { SignupAndRedirect } from '../../../utils/SignupAndRedirect';
import { Form, Button, Input, Popover, Progress, Row } from 'antd';
const FormItem = Form.Item;

const Register = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [visible, setvisible] = useState(false);
  const [popover, setpopover] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setloading(true);
    SignupAndRedirect({
      email: values.mail,
      password: values.password,
      lastname: values.lastname,
      firstname: values.firstname,
      history, dispatch, t, setloading
    })
  }

  const checkPassword = (rule, value) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setvisible(!!value);
      return promise.reject(t('user.required.password'));
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (
      value.length < 8 ||
      !value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    ) {
      return promise.reject('');
    }
    return promise.resolve();
  };

  const getPasswordStatus = () => {
    const password = form.getFieldValue('password');
    if (password && password.length > 10) {
      return 'success';
    }
    if (password && password.length > 7) {
      return 'normal';
    }
    return 'exception';
  };

  const passwordStatusMap = {
  success: (
    <div className={styles.success}>
      {t('user.strength.strong')}
    </div>
  ),
  normal: (
    <div className={styles.warning}>
      {t('user.strength.medium')}
    </div>
  ),
  exception: (
    <div className={styles.error}>
      {t('user.strength.short')}
    </div>
  ),
};

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div>
        <Progress
          status={passwordStatus}
          className={styles.progress}
          strokeWidth={8}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.main}>
      <h2>
        {t('user.register.welcome')}
      </h2>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <Row>
          {t('user.required.fullname')}
        </Row>
        <FormItem
          name="firstname"
          className={styles.firstname}
          rules={[
            {
              required: true,
              message: t('user.required'),
            }
          ]}
        >
          <Input size="large" placeholder={t('user.placeholder.firstname')} />
        </FormItem>
        <FormItem
          name="lastname"
          className={styles.lastname}
          rules={[
            {
              required: true,
              message: t('user.required'),
            }
          ]}
        >
          <Input size="large" placeholder={t('user.placeholder.lastname')} />
        </FormItem>
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
        <Popover
          content={
            visible && (
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  {t('user.hint.password')}
                </div>
              </div>
            )
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            className={styles.password}
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input size="large" type="password" placeholder={t('user.placeholder.password')}/>
          </FormItem>
        </Popover>
        <FormItem>
          <Button
            size="large"
            loading={loading}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            {t('user.register')}
          </Button>
          <Link className={styles.login} to="/user/login">
            {t('user.to-sign-in')}
          </Link>
        </FormItem>
      </Form>
    </div>
  );
}

export default Register;
