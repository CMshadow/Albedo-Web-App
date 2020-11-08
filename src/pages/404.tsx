import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const NoFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('error.404')}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {t('error.backhome')}
        </Button>
      }
    />
  )
};

export default NoFoundPage;
