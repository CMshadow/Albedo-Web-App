import React, { useState } from 'react';
import { Layout, Menu, Row, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import PublicHeader from '../PublicHeader/PublicHeader'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert';
import { saveProject } from '../../pages/Project/service'
import { updateProjectAttributes } from '../../store/action/index'
import * as styles from './ProjectLayout.module.scss';

const { Sider, Content } = Layout;

const ProjectLayout = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const [loading, setloading] = useState(false)
  const projectData = useSelector(state => state.project)
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const projectID = history.location.pathname.split('/')[2]
  const selectMenu = history.location.pathname.split('/')[3]

  const onSelectMenu = ({ item, key }) => {
    history.push(`/project/${projectID}/${key}`)
  }

  const saveProjectClick = () => {
    setloading(true)
    dispatch(saveProject({projectID, projectData}))
    .then(res => {
      dispatch(updateProjectAttributes({updatedAt: res.Attributes.updatedAt}))
      setloading(false)
    })
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
        <Menu theme="dark" mode="inline" selectedKeys={[selectMenu]} onSelect={onSelectMenu}>
          <Menu.Item key='dashboard' className={styles.menuItem}>
            {t('sider.menu.projectDetail')}
          </Menu.Item>
          <Menu.Item key='report' className={styles.menuItem}>
            {t('sider.menu.report')}
          </Menu.Item>
          <Menu.Item key="pv" className={styles.menuItem}>
            {t('sider.menu.pv')}
          </Menu.Item>
          <Menu.Item key="inverter" className={styles.menuItem}>
            {t('sider.menu.inverter')}
          </Menu.Item>
        </Menu>
        <Button
          block
          type='link'
          size='large'
          className={styles.saveBut}
          onClick={saveProjectClick}
          loading={loading}
        >
          {t('sider.save')}
        </Button>
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

export default ProjectLayout;
