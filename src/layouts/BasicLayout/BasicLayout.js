import React, { useEffect } from 'react';
import { Layout, Menu, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { releaseProjectData } from '../../store/action/index'
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import PublicHeader from '../PublicHeader/PublicHeader'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert';
import * as styles from './BasicLayout.module.scss';
import EmailSupport from '../../components/TechSupport/EmailSupport';
const { Sider, Content } = Layout;

const BasicLayout = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const selectMenu = history.location.pathname.split('/')[1]

  const onSelect = ({ item, key }) => {
    history.push(`/${key}`)
  }

  // 释放redux中存储的项目数据
  useEffect(() => {
    dispatch(releaseProjectData())
  }, [dispatch])

  return (
    <Layout>
      <EmailSupport />
      <Sider width={250} className={styles.sider}>
        <Row className={styles.title} align='middle' justify='center'>
          <img alt="logo" className={styles.logo} src={logo} />
          <div>
            <h1>{t('sider.company')}</h1>
            <h4>{t('sider.edition')}</h4>
          </div>
        </Row>
        <Menu theme="dark" mode="inline" selectedKeys={[selectMenu]} onSelect={onSelect}>
          <Menu.Item key="dashboard" className={styles.menuItem}>
            {t('sider.menu.project')}
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles.main}>
        {cognitoUser ? <PrivateHeader /> : <PublicHeader />}
        <Content className={styles.content}>
          <GlobalAlert />
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
