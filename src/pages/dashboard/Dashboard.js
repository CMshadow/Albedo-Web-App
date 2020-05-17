import React from 'react'
import { connect } from 'react-redux';
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';

const Dashboard = (props) => {
  const { t } = useTranslation();

  return (
    <Alert
      message={t('warning.dev.message')}
      description={t('warning.dev.description')}
      type="info"
      showIcon
      closable
    />
  )
}

const mapStateToProps = state => {
  return {
    cognitoUser: state.auth.cognitoUser
  }
}

export default connect(mapStateToProps)(Dashboard)
