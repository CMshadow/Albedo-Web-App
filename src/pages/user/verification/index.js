import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { Form, Button, Input, Row, Col } from 'antd';
import { SignupVerifyAndRedirect } from '../../../utils/SignupVerifyAndRedirect';
const FormItem = Form.Item;

const Verification = (props) => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [count, setcount] = useState(0);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  let interval = null;

  const onFinish = (values) => {
    setloading(true);
    SignupVerifyAndRedirect({
      username: location.state.username,
      verification: values.verification,
      password: location.state.password,
      history, dispatch, t, setloading
    })
  }

  const getVerification = () => {
    Auth.resendSignUp(location.state.username)
    .then(res => {
      // 按钮冷却60秒
      let counts = 59;
      setcount(counts);
      interval = window.setInterval(() => {
        counts -= 1;
        setcount(counts);
        if (counts === 0) {
          clearInterval(interval);
        }
      }, 1000);
    })
    .catch(err => {
      alert(err.message || JSON.stringify(err));
      return;
    })
  };

  return (
    <div className={styles.main}>
      <h2>
        {t('user.verification.welcome')}
      </h2>
      <Form form={form} name="Verification" onFinish={onFinish}>
        <Row>
          {t('user.required.verification')}
        </Row>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="verification"
              rules={[
                {
                  required: true,
                  message: t('user.required.verification'),
                },
              ]}
            >
              <Input size="large" placeholder={t('user.placeholder.verification')} />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count}
              className={styles.verifyBut}
              onClick={getVerification}
            >
              {count ? `${count} s` : t('user.verification.resend')}
            </Button>
          </Col>
        </Row>
        <FormItem wrapperCol={{span: 10, offset: 7}}>
          <Button
            size="large"
            loading={loading}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            {t('user.verification.confirm')}
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Verification;
