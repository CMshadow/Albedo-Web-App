import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { useHistory } from "react-router-dom";
import { Signup } from '../service';
import { Form, Button, Input, Popover, Progress, Row, notification } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
const FormItem = Form.Item;

const Register = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [visible, setvisible] = useState(false);
  const [popover, setpopover] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setloading(true);
    Signup({
      email: values.mail,
      password: values.password,
      lastname: values.lastname,
      firstname: values.firstname,
    }).then(res => {
      setloading(false);
      history.push({
        pathname: '/user/verify',
        state: { username: values.mail, password: values.password }
      });
    })
    .catch(err => {
      console.log(err)
      notification.error({
        message: t('user.error.register'),
        description: t(`user.error.${err.code}`)
      })
      setloading(false);
    })
  }

  const passwordLengthValidator = (rule, value) => {
    const promise = Promise;
    if (!value) {
      setvisible(!!value);
      return promise.reject(t('user.required.password'));
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 8) return promise.reject('');
    return promise.resolve();
  }

  const passwordCapLetterValidator = (rule, value) => {
    const promise = Promise;
    setpopover(!popover);
    if (value === value.toLowerCase()) return promise.reject('');
    return promise.resolve();
  }

  const passwordLowLetterValidator = (rule, value) => {
    const promise = Promise;
    setpopover(!popover);
    if (value === value.toUpperCase()) return promise.reject('');
    return promise.resolve();
  }

  const passwordNumberValidator = (rule, value) => {
    const promise = Promise;
    setpopover(!popover);
    if (/\d/.test(value)) return promise.resolve();
    return promise.reject('');
  }

  const checkPsswordLength = () => {
    const password = form.getFieldValue('password');
    if (password.length < 8) return false
    return true
  }

  const checkPsswordCapLetter = () => {
    const password = form.getFieldValue('password');
    if (password === password.toLowerCase()) return false
    return true
  }

  const checkPsswordLowLetter = () => {
    const password = form.getFieldValue('password');
    if (password === password.toUpperCase()) return false
    return true
  }

  const checkPsswordNumber = () => {
    const password = form.getFieldValue('password');
    return /\d/.test(password);
  }

  const getPasswordStatus = () => {
    const password = form.getFieldValue('password');
    if (
      checkPsswordLength() && checkPsswordCapLetter() &&
      checkPsswordLowLetter() && checkPsswordNumber() && password.length > 11
    ) return 'success';
    if (
      checkPsswordLength() && checkPsswordCapLetter() &&
      checkPsswordLowLetter() && checkPsswordNumber()
    ) return 'normal';
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
      {t('user.strength.invalid')}
    </div>
  ),
};

  const renderPasswordProgress = () => {
    const password = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return password && password.length ? (
      <div>
        <Progress
          status={passwordStatus}
          className={styles.progress}
          strokeWidth={8}
          percent={
            passwordStatus === 'exception' ? 0 :
            passwordStatus === 'normal' ? 50 : 100
          }
          showInfo={false}
        />
      </div>
    ) : null;
  };

  const genPopoverContent = () => (
    visible && (
      <div className={styles.popover}>
        {passwordStatusMap[getPasswordStatus()]}
        {renderPasswordProgress()}
        <div className={styles.popoverContent}>
          <Row align='middle'>
            {
              checkPsswordLength() ?
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor="#52c41a" /> :
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor="#f5222d"/>
            }
            {t('user.hint.length')}
          </Row>
          <Row align='middle'>
            {
              checkPsswordLowLetter() ?
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor="#52c41a" /> :
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor="#f5222d"/>
            }
            {t('user.hint.lowLetter')}
          </Row>
          <Row align='middle'>
            {
              checkPsswordCapLetter() ?
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor="#52c41a" /> :
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor="#f5222d"/>
            }
            {t('user.hint.capLetter')}
          </Row>
          <Row align='middle'>
            {
              checkPsswordNumber() ?
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor="#52c41a" /> :
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor="#f5222d"/>
            }
            {t('user.hint.number')}
          </Row>
        </div>
      </div>
    )
  )

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
          content={genPopoverContent}
          overlayStyle={{ width: 300 }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            className={styles.password}
            rules={[
              {
                validator: passwordLengthValidator,
              }, {
                validator: passwordCapLetterValidator,
              }, {
                validator: passwordLowLetterValidator,
              }, {
                validator: passwordNumberValidator,
              }
            ]}
          >
            <Input.Password size="large" type="password" placeholder={t('user.placeholder.password')}/>
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
