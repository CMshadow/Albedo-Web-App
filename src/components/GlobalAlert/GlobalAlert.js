import React from 'react';
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import * as styles from './GlobalAlert.module.scss';

const GlobalAlert = (props) => {
  const { t } = useTranslation();

  return (
    <Alert
      className={styles.alert}
      message={t('warning.dev.message')}
      description={t('warning.dev.description')}
      type="info"
      showIcon
      closable
    />
  )
}

export default GlobalAlert
