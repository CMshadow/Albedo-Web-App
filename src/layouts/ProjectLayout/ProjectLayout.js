import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet'
import { useBeforeunload } from 'react-beforeunload'
import { Layout, Menu, Row, Button, Spin, Tooltip, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, Link, useLocation } from 'react-router-dom';
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
import { setProjectData, setReportData, setPVData, setOfficialPVData, setInverterData, setOfficialInverterData, updateProjectAttributes } from '../../store/action/index';

import * as styles from './ProjectLayout.module.scss';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const {Footer} = Layout;

const ProjectLayout = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const { projectID } = useParams()
  const [loading, setloading] = useState(false)
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const selectMenu = history.location.pathname.split('/').slice(3,).join('/')
  const basePath = useLocation().pathname.split('/').slice(0,3).join('/')
  const fullPath = useLocation().pathname


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
        )) || !projectData.tiltAzimuthPOA
      ) disabled = true
      return (
        <Menu.Item key={`report/${building.buildingID}`} disabled={disabled}>
          <Link to={`${basePath}/report/${building.buildingID}`}>
            <Tooltip title={disabled ? t('sider.report.disabled') : null}>
              {
                t('sider.menu.report.prefix') +
                `${building.buildingName}` +
                t('sider.menu.report.suffix')
              }
            </Tooltip>
          </Link>
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
        )) || building.reGenReport || !reportData[building.buildingID]
      ) {
        disabled = true
      }
      return (
        <Menu.Item key={`singleLineDiagram/${building.buildingID}`} disabled={disabled}>
          <Link to={`${basePath}/singleLineDiagram/${building.buildingID}`}>
            <Tooltip title={disabled ? t('sider.menu.singleLineDiagram.disabled') : null}>
              {
                t('sider.menu.singleLineDiagram.prefix') +
                `${building.buildingName}` +
                t('sider.menu.singleLineDiagram.suffix')
              }
            </Tooltip>
          </Link>
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
    }).catch(err => {
      notification.error({
        message: t('error.save')
      })
      setloading(false)
    })
  }

  const saveProjectOnExit = useCallback(() => {
    dispatch(saveProject(projectID))
    dispatch(saveReport({projectID}))
  }, [dispatch, projectID])

  // 读pv 逆变器 项目数据 最佳倾角朝向
  useEffect(() => {
    const fetchData = async () => {
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
        .catch(err => {
          history.push('/dashboard')
        })
      })
      await Promise.all(getReportPromises)
      if (
        !projectData.optTilt || !projectData.optAzimuth ||
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
    setloading(false)

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
        <title>{`${projectData.projectTitle || ''} - ${t('sider.company')}`}</title>
      </Helmet>
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
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectMenu]}
              >
                <Menu.Item key='dashboard' className={styles.menuItem}>
                  <Link to={`${basePath}/dashboard`}>
                    {t('sider.menu.projectDetail')}
                  </Link>
                </Menu.Item>
                <Menu.Item key='report/params' className={styles.menuItem} disabled={!projectData.tiltAzimuthPOA}>
                  <Link to={{
                    pathname: `${basePath}/report/params`,
                    state: {buildingID: fullPath.split('/').slice(4,)[0]}
                  }}>
                    {t('sider.menu.reportParams')}
                  </Link>
                </Menu.Item>
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
                <Menu.Item key="pv" className={styles.menuItem} disabled={!projectData.tiltAzimuthPOA}>
                  <Link to={`${basePath}/pv`}>
                    {t('sider.menu.pv')}
                  </Link>
                </Menu.Item>
                <Menu.Item key="inverter" className={styles.menuItem} disabled={!projectData.tiltAzimuthPOA}>
                  <Link to={`${basePath}/inverter`}>
                    {t('sider.menu.inverter')}
                  </Link>
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

            {Object.keys(projectData).length !== 0 ? props.children : null}
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
