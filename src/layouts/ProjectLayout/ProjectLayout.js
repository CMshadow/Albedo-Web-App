import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet'
import { useBeforeunload } from 'react-beforeunload'
import { Layout, Menu, Row, Button, Spin, Tooltip, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import PublicHeader from '../PublicHeader/PublicHeader'
import DefaultFooter from '../Footer/DefaultFooter'
import EmailSupport from '../../components/TechSupport/EmailSupport';
import { getProject, saveProject, globalOptTiltAzimuth, allTiltAzimuthPOA } from '../../pages/Project/service'
import { getPV, getOfficialPV } from '../../pages/PVTable/service'
import { getInverter, getOfficialInverter } from '../../pages/InverterTable/service'
import { saveReport, getReport } from '../../pages/Report/service'
import { usedAllEquipments } from '../../utils/checkUnusedEquipments'
import { setProjectData, setReportData, setPVData, setOfficialPVData, setInverterData, setOfficialInverterData, updateProjectAttributes, releaseProjectData } from '../../store/action/index';

import * as styles from './ProjectLayout.module.scss';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Footer } = Layout;

const ProjectLayout = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const { projectID } = useParams()
  const [saveLoading, setsaveLoading] = useState(false)
  const [fetchLoading, setfetchLoading] = useState(true)
  const projectData = useSelector(state => state.project)
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const selectMenu = history.location.pathname.split('/').slice(3,).join('/')
  const basePath = useLocation().pathname.split('/').slice(0,3).join('/')
  const fullPath = useLocation().pathname


  const menuOnSelect = (item) => {
    history.push({
      pathname: `${basePath}/${item.key}`,
      state: {buildingID: fullPath.split('/').slice(4,)[0]}
    })
  }

  const genReportSubMenu = () => {
    return projectData.buildings &&
    projectData.buildings.filter(building =>
      building.data.length > 0 &&
      building.data[0].inverter_wiring.length > 0
    ).map(building => {
      let disabled = true
      if (
        building.data.every(obj => obj.pv_panel_parameters.tilt_angle >= 0) &&
        building.data.every(obj => obj.inverter_wiring.every(inverterSpec =>
          inverterSpec.panels_per_string >= 0
        )) && projectData.tiltAzimuthPOA
      ) disabled = false
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
      let disabled = true;
      if (
        building.data.every(obj => obj.pv_panel_parameters.tilt_angle >= 0) &&
        building.data.every(obj => obj.inverter_wiring.every(inverterSpec =>
          inverterSpec.panels_per_string >= 0
        )) && !building.reGenReport
      ) {
        disabled = false
      }
      return (
        <Menu.Item key={`singleLineDiagram/${building.buildingID}`} disabled={disabled}>
          <Tooltip title={disabled ? t('sider.menu.singleLineDiagram.disabled') : null}>
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

  const domesticMenu = 
    <>
      <SubMenu
        disabled={!projectData.tiltAzimuthPOA || !projectData.buildings}
        key='report'
        className={styles.menuItem}
        title={t('sider.menu.report')}
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
    </>

  const commercialMenu = 
    <Menu.Item key={`report/overview`} disabled={!usedAllEquipments(projectData)}>
      <Tooltip title={!usedAllEquipments(projectData) ? t('sider.report.disabled-commercial') : null}>
        {t('sider.menu.report')}
      </Tooltip>
    </Menu.Item>

  const saveProjectClick = () => {
    setsaveLoading(true)
    dispatch(saveProject(projectID))
    .then(async res => {
      dispatch(saveReport({projectID}))
      dispatch(updateProjectAttributes({updatedAt: res.Attributes.updatedAt}))
      setsaveLoading(false)
    }).catch(err => {
      notification.error({
        message: t('error.save')
      })
      setsaveLoading(false)
    })
  }

  const saveProjectOnExit = useCallback(() => {
    dispatch(saveProject(projectID))
    dispatch(saveReport({projectID}))
    dispatch(setProjectData(null))
    dispatch(releaseProjectData())
  }, [dispatch, projectID])

  // 读pv 逆变器 项目数据 最佳倾角朝向
  useEffect(() => {
    const fetchData = async () => {
      setfetchLoading(true)
      const fetchPromises = []
      fetchPromises.push(
        dispatch(getPV())
        .then(res => dispatch(setPVData(res)))
        .catch(err => history.push('/dashboard'))
      )
      fetchPromises.push(
        dispatch(getOfficialPV(cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US'))
        .then(res => dispatch(setOfficialPVData(res)))
        .catch(err => history.push('/dashboard'))
      )
      fetchPromises.push(
        dispatch(getInverter())
        .then(res => dispatch(setInverterData(res)))
        .catch(err => history.push('/dashboard'))
      )
      fetchPromises.push(
        dispatch(getOfficialInverter(cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US'))
        .then(res => dispatch(setOfficialInverterData(res)))
        .catch(err => history.push('/dashboard'))
      )
      await Promise.all(fetchPromises)

      let projectData
      await dispatch(getProject({projectID: projectID}))
        .then(res => {
          projectData = res
          dispatch(setProjectData(res))
        })
        .catch(err => {
          dispatch(setProjectData(null))
          history.push('/dashboard')
        })

      const getReportPromises = projectData.buildings.map(building => {
        return dispatch(getReport({projectID, buildingID: building.buildingID}))
        .then(res =>
          dispatch(setReportData({buildingID: building.buildingID, data: res}))
        )
      }).concat([
        dispatch(getReport({projectID, buildingID: 'overview'}))
        .then(res =>
          dispatch(setReportData({buildingID: 'overview', data: res}))
        )
      ])
      await Promise.all(getReportPromises)
      setfetchLoading(false)

      if (
        !(projectData.optTilt >= 0) || !(projectData.optAzimuth >= 0) ||
        !projectData.optPOA || !projectData.tiltAzimuthPOA ||
        projectData.tiltAzimuthPOA.length === 0
      ) {
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
    }

    fetchData()

    return () => {
      saveProjectOnExit()
    }
  }, [cognitoUser.attributes.locale, dispatch, history, projectID, saveProjectOnExit, t])

  useBeforeunload(event => {
    event.preventDefault()
    dispatch(saveProject(projectID))
    dispatch(saveReport({projectID}))
  })

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={t('user.logo.welcome')}/>
        <title>{`${projectData.projectTitle || 'Loading'} - ${t('sider.company')}`}</title>
      </Helmet>
      <Layout>
        <EmailSupport />
        <Sider width={250} className={styles.sider}>
          <Row className={styles.title} align='middle' justify='center'>
            <img alt="logo" className={styles.logo} src={logo} />
            <div>
              <h1>{t('sider.company')}</h1>
              <h4>{t('sider.edition')}{process.env.REACT_APP_VERSION}</h4>
            </div>
          </Row>
          {
            Object.keys(projectData).length !== 0 ?
            <div>
              <Menu
                className={styles.menu}
                theme="dark"
                mode="inline"
                selectedKeys={[selectMenu]}
                onSelect={menuOnSelect}
              >
                <Menu.Item key='dashboard' className={styles.menuItem}>
                  {t('sider.menu.projectDetail')}
                </Menu.Item>
                <Menu.Item key='powergrid' className={styles.menuItem} >
                  {t('sider.menu.commercial')}
                </Menu.Item>
                <Menu.Item key='params' className={styles.menuItem} disabled={!projectData.tiltAzimuthPOA}>
                  {t('sider.menu.reportParams')}
                </Menu.Item>
                {
                  projectData.projectType === 'domestic' ?
                  domesticMenu : commercialMenu
                }
              </Menu>
              <Button
                block
                type='link'
                size='large'
                className={styles.saveBut}
                onClick={saveProjectClick}
                loading={saveLoading}
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
            {fetchLoading ? null : props.children}
          </Content>
          <Footer className={styles.footer}>
            <DefaultFooter/>
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default ProjectLayout;
