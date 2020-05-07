import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRoute } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './style.module.scss';
import { Form, Button, Input, notification, Row, Col } from 'antd';
import * as actions from '../../../store/action/index';
const FormItem = Form.Item;

const Verification = (props) => {
  const { t } = useTranslation();
  const [count, setcount] = useState(0);
  const [form] = Form.useForm();
  let interval = null;

  const onFinish = (values) => {
    props.setAuthLoading(true);
    props.cognitoUser.confirmRegistration(
      values.verification, true, (err, result) => {
        if (err) {
          console.log(err)
          notification.error({
            message: t('user.error.verification'),
            description: t(`user.error.${err.code}`)
          })
          props.setAuthLoading(false);
          return;
        }
        console.log('call result: ' + result);
        props.setAuthLoading(false);
      }
    );
  }

  const getVerification = () => {
    props.cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
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
    });
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
            loading={false}
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

const mapStateToProps = state => {
  return {
    authLoading: state.auth.loading,
    cognitoUser: state.auth.cognitoUser
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setVerified: (bool) => dispatch(actions.setVerified(bool)),
    setAuthLoading: (bool) => dispatch(actions.setAuthLoading(bool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
