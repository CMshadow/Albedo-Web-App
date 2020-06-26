import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Row, Button, Spin, Space, Tooltip, notification } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import PublicHeader from '../PublicHeader/PublicHeader'
import DefaultFooter from '../Footer/DefaultFooter'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert';
import EmailSupport from '../../components/TechSupport/EmailSupport';
import { getProject, saveProject, globalOptTiltAzimuth, allTiltAzimuthPOA } from '../../pages/Project/service'
import { getPV, getOfficialPV } from '../../pages/PVTable/service'
import { getInverter, getOfficialInverter } from '../../pages/InverterTable/service'
import { saveReport } from '../../pages/Report/service'
import { setProjectData, setPVData, setOfficialPVData, setInverterData, setOfficialInverterData, updateProjectAttributes } from '../../store/action/index';

import * as styles from './ProjectLayout.module.scss';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const {Footer} = Layout;

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

  const genReportSubMenu = () => {
    return projectData.buildings &&
    projectData.buildings.filter(building =>
      building.data.length > 0 &&
      building.data[0].inverter_wiring.length > 0
    ).map(building => {
      let disabled = false
      if (
        building.data.some(obj => !obj.pv_panel_parameters.tilt_angle) ||
        building.data.some(obj => obj.inverter_wiring.some(inverterSpec =>
          !inverterSpec.panels_per_string
        )) ||
        !projectData.tiltAzimuthPOA
      ) disabled = true
      return (
        <Menu.Item key={`report/${building.buildingID}`} disabled={disabled}>
          <Tooltip title={disabled ? t('sider.report.disabled') : null}>
            {
              t('sider.menu.report.prefix') +
              `${building.buildingName}` +
              t('sider.menu.report.suffix')
            }
          </Tooltip>
        </Menu.Item>
      )
    })
  }

  const genSLDSubMen = () => {
    return projectData.buildings && 
    projectData.buildings.filter( building => 
      building.data.length > 0 && building.data[0].inverter_wiring.length > 0
    ).map(building => {
      let disabled = false;
      if (
        building.data.some(obj => !obj.pv_panel_parameters.tilt_angle) ||
        building.data.some(obj => obj.inverter_wiring.some(inverterSpec =>
          !inverterSpec.panels_per_string
        )) ||
        !projectData.tiltAzimuthPOA
      ) {disabled = true;}
    return (
      <Menu.Item key={`singleLineDiagram/${building.buildingID}`} disabled={disabled}>
          <Tooltip title={disabled ? t('sider.singleLineDiagram.disabled.disabled') : null}>
            {
              t('sider.menu.singleLineDiagram.prefix') +
              `${building.buildingName}` +
              t('sider.menu.singleLineDiagram.suffix')
            }
          </Tooltip>
        </Menu.Item>
      )
    })
  }



  const saveProjectClick = () => {
    setloading(true)
    dispatch(saveProject(projectID))
    .then(async res => {
      dispatch(saveReport({projectID}))
      dispatch(updateProjectAttributes({updatedAt: res.Attributes.updatedAt}))
      setloading(false)
    })
  }

  const saveProjectOnExit = useCallback(() => {
    dispatch(saveProject(projectID))
    .then(async res => {
      dispatch(saveReport({projectID}))
      dispatch(updateProjectAttributes({updatedAt: res.Attributes.updatedAt}))
    })
  }, [dispatch, projectID])

  // 读pv 逆变器 项目数据 最佳倾角朝向
  useEffect(() => {
    dispatch(getPV())
    .then(res => dispatch(setPVData(res)))
    .catch(err => history.push('/dashboard'))

    dispatch(getOfficialPV(cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US'))
    .then(res => dispatch(setOfficialPVData(res)))
    .catch(err => history.push('/dashboard'))

    dispatch(getInverter())
    .then(res => dispatch(setInverterData(res)))
    .catch(err => history.push('/dashboard'))

    dispatch(getOfficialInverter(cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US'))
    .then(res => dispatch(setOfficialInverterData(res)))
    .catch(err => history.push('/dashboard'))

    dispatch(getProject({projectID: projectID}))
    .then(res => {
      dispatch(setProjectData(res))
      setloading(false)
      if (!res.optTilt || !res.optAzimuth || !res.optPOA || !res.tiltAzimuthPOA || res.tiltAzimuthPOA.length === 0) {
        dispatch(globalOptTiltAzimuth({projectID: projectID}))
        .then(optSpec => {
          dispatch(setProjectData(optSpec))
        })
        const allTiltAziPOA = [
          dispatch(allTiltAzimuthPOA({projectID: projectID, startAzi: 0, endAzi: 90})),
          dispatch(allTiltAzimuthPOA({projectID: projectID, startAzi: 90, endAzi: 180})),
          dispatch(allTiltAzimuthPOA({projectID: projectID, startAzi: 180, endAzi: 270})),
          dispatch(allTiltAzimuthPOA({projectID: projectID, startAzi: 270, endAzi: 360}))
        ]
        Promise.all(allTiltAziPOA).then(allPOARes => {
          notification.success({
            message:t('sider.tiltAzimuthPOA.success')
          })
          dispatch(setProjectData({
            tiltAzimuthPOA: allPOARes.flatMap(obj => obj.allTiltAziPOA)
          }))
        })
      }
    })
    .catch(err => {
      dispatch(setProjectData(null))
      history.push('/dashboard')
    })

    return () => {
      saveProjectOnExit()
    }
  }, [cognitoUser.attributes.locale, dispatch, history, projectID, saveProjectOnExit, t])

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
        {
          Object.keys(projectData).length !== 0 ?
          <div>
            <Menu theme="dark" mode="inline" selectedKeys={[selectMenu]} onSelect={onSelectMenu}>
              <Menu.Item key='dashboard' className={styles.menuItem}>
                {t('sider.menu.projectDetail')}
              </Menu.Item>
              <SubMenu
                disabled={!projectData.tiltAzimuthPOA || !projectData.buildings}
                key='report'
                className={styles.menuItem}
                title={
                  <Space>
                    {t('sider.menu.report')}
                    <Button

                      shape="circle"
                      // ghost
                      type='link'
                      onClick={() => {history.push(`/project/${projectID}/report/params`)}}
                      icon={<SettingOutlined style={{margin: 0}}/>}
                    />
                  </Space>
                }
              >
                {genReportSubMenu()}
              </SubMenu>
              <SubMenu
                disabled={!projectData.tiltAzimuthPOA || !projectData.buildings}
                key='singleLineDiag'
                className={styles.menuItem}
                title={t('sider.menu.singleLineDiagram')}
              >
                {genSLDSubMen()}
              </SubMenu>
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
          </div> :
          <div className={styles.spin}>
            <Spin size='large' />
          </div>
        }

      </Sider>
      <Layout className={styles.main}>
        {cognitoUser ? <PrivateHeader /> : <PublicHeader />}
        <Content className={styles.content}>
          <GlobalAlert />
          {Object.keys(projectData).length !== 0 ? props.children : null}
        </Content>
        <Footer className={styles.footer}>
          <DefaultFooter/>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default ProjectLayout;
