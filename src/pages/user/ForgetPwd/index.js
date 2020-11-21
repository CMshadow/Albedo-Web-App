import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './style.module.scss'
import { useHistory } from 'react-router-dom'
import { Form, Button, Input, Row, Col, notification, Popover, Progress } from 'antd'
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { SendForgotPasswordVerification, SubmitForgotPassword } from '../service'
const FormItem = Form.Item

const ForgetPassword = props => {
  const { t } = useTranslation()
  const history = useHistory()
  const [form] = Form.useForm()
  // 验证码按钮倒计时
  const [count, setcount] = useState(0)
  // 正在与后台交互
  const [loading, setloading] = useState(false)
  // 是否已点击发送验证码按钮
  const [codeSent, setcodeSent] = useState(false)
  // 用户输入的邮箱
  const [email, setemail] = useState(null)
  const [visible, setvisible] = useState(false)
  const [popover, setpopover] = useState(false)
  let interval = null

  const onFinish = values => {
    if (!codeSent) {
      sendVerificationCode(values.mail)
    } else {
      submitNewPassword(values.verification, values.password)
    }
  }

  const submitNewPassword = (code, password) => {
    setloading(true)
    SubmitForgotPassword({ username: email, code, newPassword: password })
      .then(() => {
        setTimeout(() => {
          setloading(false)
          history.push('/user/login')
        }, 2000)
      })
      .catch(err => {
        setloading(false)
        notification.error({
          message: t('user.error.reset-password'),
          description: t(`user.error.${err.code}`),
        })
      })
  }

  const sendVerificationCode = email => {
    setloading(true)
    SendForgotPasswordVerification({ username: email })
      .then(res => {
        setloading(false)
        setcodeSent(true)
        setemail(email)
        // 按钮冷却60秒
        let counts = 59
        setcount(counts)
        interval = window.setInterval(() => {
          counts -= 1
          setcount(counts)
          if (counts === 0) {
            clearInterval(interval)
          }
        }, 1000)
      })
      .catch(err => {
        setloading(false)
        notification.error({
          message: t('user.error.send-code-fail'),
          description: err.code,
        })
      })
  }

  const passwordLengthValidator = (rule, value) => {
    const promise = Promise
    if (!value) {
      setvisible(!!value)
      return promise.reject(t('user.required.password'))
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value)
    }
    setpopover(!popover)
    if (value.length < 8) return promise.reject('')
    return promise.resolve()
  }

  const passwordCapLetterValidator = (rule, value) => {
    const promise = Promise
    setpopover(!popover)
    if (value === value.toLowerCase()) return promise.reject('')
    return promise.resolve()
  }

  const passwordLowLetterValidator = (rule, value) => {
    const promise = Promise
    setpopover(!popover)
    if (value === value.toUpperCase()) return promise.reject('')
    return promise.resolve()
  }

  const passwordNumberValidator = (rule, value) => {
    const promise = Promise
    setpopover(!popover)
    if (/\d/.test(value)) return promise.resolve()
    return promise.reject('')
  }

  const checkPsswordLength = () => {
    const password = form.getFieldValue('password')
    if (password.length < 8) return false
    return true
  }

  const checkPsswordCapLetter = () => {
    const password = form.getFieldValue('password')
    if (password === password.toLowerCase()) return false
    return true
  }

  const checkPsswordLowLetter = () => {
    const password = form.getFieldValue('password')
    if (password === password.toUpperCase()) return false
    return true
  }

  const checkPsswordNumber = () => {
    const password = form.getFieldValue('password')
    return /\d/.test(password)
  }

  const getPasswordStatus = () => {
    const password = form.getFieldValue('password')
    if (
      checkPsswordLength() &&
      checkPsswordCapLetter() &&
      checkPsswordLowLetter() &&
      checkPsswordNumber() &&
      password.length > 11
    )
      return 'success'
    if (
      checkPsswordLength() &&
      checkPsswordCapLetter() &&
      checkPsswordLowLetter() &&
      checkPsswordNumber()
    )
      return 'normal'
    return 'exception'
  }

  const passwordStatusMap = {
    success: <div className={styles.success}>{t('user.strength.strong')}</div>,
    normal: <div className={styles.warning}>{t('user.strength.medium')}</div>,
    exception: <div className={styles.error}>{t('user.strength.invalid')}</div>,
  }

  const renderPasswordProgress = () => {
    const password = form.getFieldValue('password')
    const passwordStatus = getPasswordStatus()
    return password && password.length ? (
      <div>
        <Progress
          status={passwordStatus}
          className={styles.progress}
          strokeWidth={8}
          percent={passwordStatus === 'exception' ? 0 : passwordStatus === 'normal' ? 50 : 100}
          showInfo={false}
        />
      </div>
    ) : null
  }

  const genPopoverContent = () =>
    visible && (
      <div className={styles.popover}>
        {passwordStatusMap[getPasswordStatus()]}
        {renderPasswordProgress()}
        <div className={styles.popoverContent}>
          <Row align='middle'>
            {checkPsswordLength() ? (
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor='#52c41a' />
            ) : (
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor='#f5222d' />
            )}
            {t('user.hint.length')}
          </Row>
          <Row align='middle'>
            {checkPsswordLowLetter() ? (
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor='#52c41a' />
            ) : (
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor='#f5222d' />
            )}
            {t('user.hint.lowLetter')}
          </Row>
          <Row align='middle'>
            {checkPsswordCapLetter() ? (
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor='#52c41a' />
            ) : (
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor='#f5222d' />
            )}
            {t('user.hint.capLetter')}
          </Row>
          <Row align='middle'>
            {checkPsswordNumber() ? (
              <CheckCircleTwoTone className={styles.popoverIcon} twoToneColor='#52c41a' />
            ) : (
              <CloseCircleTwoTone className={styles.popoverIcon} twoToneColor='#f5222d' />
            )}
            {t('user.hint.number')}
          </Row>
        </div>
      </div>
    )

  return (
    <div className={styles.main}>
      <h2>{t('user.forget.welcome')}</h2>
      <Form form={form} name='Login' onFinish={onFinish}>
        <Row>{t('user.forget.email')}</Row>
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
          <Input disabled={email} size='large' placeholder={t('user.placeholder.email')} />
        </FormItem>
        {codeSent ? (
          <>
            <Row>{t('user.required.verification')}</Row>
            <Row gutter={8}>
              <Col span={16}>
                <FormItem
                  name='verification'
                  rules={[
                    {
                      required: true,
                      message: t('user.required.verification'),
                    },
                  ]}
                >
                  <Input size='large' placeholder={t('user.placeholder.verification')} />
                </FormItem>
              </Col>
              <Col span={8}>
                <Button
                  size='large'
                  disabled={!!count}
                  className={styles.verifyBut}
                  onClick={sendVerificationCode}
                >
                  {count ? `${count} s` : t('user.verification.resend')}
                </Button>
              </Col>
            </Row>
            <Row>{t('user.required.password')}</Row>
            <Popover
              content={genPopoverContent}
              overlayStyle={{ width: 300 }}
              placement='right'
              visible={visible}
            >
              <FormItem
                name='password'
                className={styles.password}
                rules={[
                  {
                    validator: passwordLengthValidator,
                  },
                  {
                    validator: passwordCapLetterValidator,
                  },
                  {
                    validator: passwordLowLetterValidator,
                  },
                  {
                    validator: passwordNumberValidator,
                  },
                ]}
              >
                <Input.Password
                  size='large'
                  type='password'
                  placeholder={t('user.placeholder.password')}
                />
              </FormItem>
            </Popover>
          </>
        ) : null}

        <Link className={styles.floatright} to='/user/register'>
          {t('user.register.welcome')}
        </Link>
        <FormItem className={styles.submit}>
          <Button
            size='large'
            loading={loading}
            className={styles.submit}
            type='primary'
            htmlType='submit'
          >
            {codeSent ? t('user.reset-password') : t('user.forget.send-code')}
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default ForgetPassword
