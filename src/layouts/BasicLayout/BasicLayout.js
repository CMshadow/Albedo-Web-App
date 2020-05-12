import React from 'react';
import { Layout, Menu, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import * as styles from './BasicLayout.module.scss';

const { Sider, Content } = Layout;

const BasicLayout = (props) => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Sider width={250} className={styles.sider}>
        <Row className={styles.title} align='middle' justify='center'>
          <img alt="logo" className={styles.logo} src={logo} />
          <div>
            <h1>{t('sider.company')}</h1>
            <h4>{t('sider.edition')}</h4>
          </div>
        </Row>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" className={styles.menuItem}>
            {t('sider.menu.project')}
          </Menu.Item>
          <Menu.Item key="2" className={styles.menuItem}>
            {t('sider.menu.pv')}
          </Menu.Item>
          <Menu.Item key="3" className={styles.menuItem}>
            {t('sider.menu.inverter')}
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles.main}>
        <PrivateHeader />
        <Content>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
