import React, { useEffect } from 'react';
import { Layout, Menu, Row, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert';
import * as styles from './ProjectLayout.module.scss';

const { Sider, Content } = Layout;

const ProjectLayout = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const projectID = history.location.pathname.split('/')[2]
  const selectMenu = history.location.pathname.split('/')[3]

  const onSelect = ({ item, key }) => {
    if (key === 'back') history.push('/dashboard')
    else history.push(`/project/${projectID}/${key}`)
  }

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
        <Menu theme="dark" mode="inline" selectedKeys={[selectMenu]} onSelect={onSelect}>
          <Menu.Item key="back" className={styles.menuItem} icon={<ArrowLeftOutlined />}>
            {t('sider.menu.back-project')}
          </Menu.Item>
          <Divider className={styles.divider}/>
          <Menu.Item key='dashboard' className={styles.menuItem}>
            {t('sider.menu.projectDetail')}
          </Menu.Item>
          <Menu.Item key="pv" className={styles.menuItem}>
            {t('sider.menu.pv')}
          </Menu.Item>
          <Menu.Item key="inverter" className={styles.menuItem}>
            {t('sider.menu.inverter')}
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles.main}>
        <PrivateHeader />
        <Content className={styles.content}>
          <GlobalAlert />
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default ProjectLayout;
