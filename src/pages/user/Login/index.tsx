import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, Link } from 'react-router-dom'
import { Form, Button, Input, Row, Checkbox, notification } from 'antd'
import { SignIn } from '../../../services'
import { setCognitoUser } from '../../../store/action/index'
import styles from './style.module.scss'

const FormItem = Form.Item

type LoginType = {
  mail: string
  password: string
}

const Login: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [check, setcheck] = useState(true)
  const [loading, setloading] = useState(false)

  const onFinish = (values: LoginType) => {
    setloading(true)
    SignIn({ username: values.mail, password: values.password })
      .then(cognitoUser => {
        setloading(false)
        return new Promise<void>(resolve => {
          dispatch(setCognitoUser(cognitoUser))
          resolve()
        }).then(() => {
          history.push('/')
        })
      })
      .catch(err => {
        setloading(false)
        if (err.code === 'UserNotConfirmedException') {
          history.push({
            pathname: '/user/verify',
            state: { username: values.mail, password: values.password },
          })
          return
        } else {
          notification.error({
            message: t('user.error.login'),
            description: t(`user.error.${err.code}`),
          })
          return
        }
      })
  }

  return (
    <div className={styles.main}>
      <h2>{t('user.login.welcome')}</h2>
      <Form form={form} name='Login' onFinish={onFinish}>
        <Row>{t('user.required.email')}</Row>
        <FormItem
          name='mail'
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
          <Input size='large' placeholder={t('user.placeholder.email')} />
        </FormItem>
        <Row>{t('user.required.password')}</Row>
        <FormItem
          name='password'
          className={styles.password}
          rules={[
            {
              required: true,
              message: t('user.required'),
            },
          ]}
        >
          <Input size='large' type='password' placeholder={t('user.required.password')} />
        </FormItem>
        <Checkbox className={styles.floatleft} checked={check} onChange={() => setcheck(!check)}>
          {t('user.save-login')}
        </Checkbox>
        <Link className={styles.floatright} to='/user/forget'>
          {t('user.forget-password')}
        </Link>
        <FormItem className={styles.submit}>
          <Button
            size='large'
            loading={loading}
            className={styles.submit}
            type='primary'
            htmlType='submit'
          >
            {t('user.login')}
          </Button>
        </FormItem>
        <Link className={styles.floatright} to='/user/register'>
          {t('user.to-sign-up')}
        </Link>
      </Form>
    </div>
  )
}

export default Login
