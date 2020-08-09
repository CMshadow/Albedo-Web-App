import React from 'react';
import { Helmet } from 'react-helmet'
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DefaultFooter from '../Footer/DefaultFooter';
import logo from '../../assets/logo.png';
import SelectLang from '../../components/SelectLang/index';
import styles from './UserLayout.module.scss';
const Text = Typography.Text

const UserLayout = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={t('user.logo.welcome')}/>
        <title>{t('sider.company')}</title>
      </Helmet>
      <Layout className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/cn">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
            <div>
              <Text type='warning'>{t('sider.edition')}</Text>
            </div>
            <div className={styles.desc}>
              <Text strong>{t('user.logo.welcome')}</Text>
            </div>
          </div>
          {props.children}
        </div>
        <DefaultFooter />
      </Layout>
    </>
  );
};

export default UserLayout;
