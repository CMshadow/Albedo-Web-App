import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DefaultFooter from '../Footer/DefaultFooter';
import logo from '../../assets/logo.png';
import SelectLang from '../../components/SelectLang/index';
import styles from './UserLayout.module.scss';

const UserLayout = (props) => {
  const { t } = useTranslation();
  return (
    <Layout className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
            </Link>
          </div>
          <div className={styles.desc}>
            {t('user.logo.welcome')}
          </div>
        </div>
        {props.children}
      </div>
      <DefaultFooter />
    </Layout>
  );
};

export default UserLayout;
