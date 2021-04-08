import React, { useState, useEffect, Dispatch } from 'react'
import { Helmet } from 'react-helmet'
import { useBeforeunload } from 'react-beforeunload'
import { Layout, Menu, Row, Button, Spin, Tooltip, notification, Card } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/logo-no-text.png'
import PrivateHeader from '../PrivateHeader/PrivateHeader'
import PublicHeader from '../PublicHeader/PublicHeader'
import DefaultFooter from '../Footer/DefaultFooter'
import EmailSupport from '../../components/TechSupport/EmailSupport'
import {
  getPV,
  getOfficialPV,
  getInverter,
  getOfficialInverter,
  getProjectSingle,
  saveProject,
  globalOptTiltAzimuth,
  allTiltAzimuthPOA,
  saveReport,
  getReport,
} from '../../services'
import { usedAllEquipments } from '../../utils/checkUnusedEquipments'
import {
  setProjectData,
  setReportData,
  setPVData,
  setOfficialPVData,
  setInverterData,
  setOfficialInverterData,
  updateProjectAttributes,
  releaseProjectData,
} from '../../store/action/index'
import { Params, RootState } from '../../@types'

import styles from './ProjectLayout.module.scss'

const { Sider, Content, Footer } = Layout
const { SubMenu } = Menu

const ProjectLayout: React.FC = props => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { projectID } = useParams<Params>()
  const [saveLoading, setsaveLoading] = useState<boolean>(false)
  const [fetchLoading, setfetchLoading] = useState<boolean>(true)
  const projectData = useSelector((state: RootState) => state.project)
  const reportData = useSelector((state: RootState) => state.report)
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  const selectMenu = history.location.pathname.split('/').slice(3).join('/')
  const basePath = useLocation().pathname.split('/').slice(0, 3).join('/')
  const fullPath = useLocation().pathname

  const menuOnSelect = (key: React.ReactText) => {
    history.push({
      pathname: `${basePath}/${key}`,
      state: { buildingID: fullPath.split('/').slice(4)[0] },
    })
  }

  const genReportSubMenu = () => {
    return (
      projectData &&
      projectData.buildings &&
      projectData.buildings
        .filter(building => building.data.length > 0 && building.data[0].inverter_wiring.length > 0)
        .map(building => {
          let disabled = true
          if (
            building.data.every(
              obj => obj.pv_panel_parameters.tilt_angle && obj.pv_panel_parameters.tilt_angle >= 0
            ) &&
            building.data.every(obj =>
              obj.inverter_wiring.every(
                inverterSpec =>
                  inverterSpec.panels_per_string && inverterSpec.panels_per_string >= 0
              )
            ) &&
            projectData.tiltAzimuthPOA
          )
            disabled = false
          return (
            <Menu.Item
              key={`report/${building.buildingID}`}
              className={styles.menuItem}
              disabled={disabled}
            >
              <Tooltip title={disabled ? t('sider.report.disabled') : null}>
                {t('sider.menu.report.prefix') +
                  `${building.buildingName}` +
                  t('sider.menu.report.suffix')}
              </Tooltip>
            </Menu.Item>
          )
        })
    )
  }

  const genSLDSubMen = () => {
    return (
      projectData &&
      projectData.buildings &&
      projectData.buildings
        .filter(building => building.data.length > 0 && building.data[0].inverter_wiring.length > 0)
        .map(building => {
          let disabled = true
          if (
            building.data.every(
              obj => obj.pv_panel_parameters.tilt_angle && obj.pv_panel_parameters.tilt_angle >= 0
            ) &&
            building.data.every(obj =>
              obj.inverter_wiring.every(
                inverterSpec =>
                  inverterSpec.panels_per_string && inverterSpec.panels_per_string >= 0
              )
            ) &&
            !building.reGenReport
          ) {
            disabled = false
          }
          return (
            <Menu.Item
              key={`singleLineDiagram/${building.buildingID}`}
              className={styles.menuItem}
              disabled={disabled}
            >
              <Tooltip title={disabled ? t('sider.menu.singleLineDiagram.disabled') : null}>
                {t('sider.menu.singleLineDiagram.prefix') +
                  `${building.buildingName}` +
                  t('sider.menu.singleLineDiagram.suffix')}
              </Tooltip>
            </Menu.Item>
          )
        })
    )
  }

  const domesticMenu = (
    <Menu
      className={styles.menu}
      theme='dark'
      mode='inline'
      selectedKeys={[selectMenu]}
      onSelect={({ key }) => menuOnSelect(key)}
    >
      <Menu.Item key='dashboard' className={styles.menuItem}>
        {t('sider.menu.projectDetail')}
      </Menu.Item>
      <Menu.Item
        key='params'
        className={styles.menuItem}
        disabled={!projectData || !projectData.tiltAzimuthPOA}
      >
        {t('sider.menu.reportParams')}
      </Menu.Item>
      <SubMenu
        disabled={!projectData || !projectData.tiltAzimuthPOA || !projectData.buildings}
        key='report'
        className={styles.menuItem}
        title={t('sider.menu.report')}
      >
        {genReportSubMenu()}
      </SubMenu>
      {cognitoUser?.attributes.locale === 'zh-CN' ? (
        <SubMenu
          disabled={!projectData || !projectData.tiltAzimuthPOA || !projectData.buildings}
          key='singleLineDiag'
          className={styles.menuItem}
          title={t('sider.menu.singleLineDiagram')}
        >
          {genSLDSubMen()}
        </SubMenu>
      ) : null}
    </Menu>
  )

  const commercialMenu = (
    <Menu
      className={styles.menu}
      theme='dark'
      mode='inline'
      selectedKeys={[selectMenu]}
      onSelect={({ key }) => menuOnSelect(key)}
    >
      <Menu.Item key='dashboard' className={styles.menuItem}>
        {t('sider.menu.projectDetail')}
      </Menu.Item>
      <Menu.Item
        key='powergrid'
        className={styles.menuItem}
        disabled={!projectData || !projectData.tiltAzimuthPOA}
      >
        {t('sider.menu.commercial')}
      </Menu.Item>
      <Menu.Item
        key='params'
        className={styles.menuItem}
        disabled={!projectData || !projectData.tiltAzimuthPOA}
      >
        {t('sider.menu.reportParams')}
      </Menu.Item>
      <Menu.Item
        key={`report/overview`}
        className={styles.menuItem}
        disabled={!projectData || !usedAllEquipments(projectData)}
      >
        <Tooltip
          title={
            !projectData || !usedAllEquipments(projectData)
              ? t('sider.report.disabled-commercial')
              : null
          }
        >
          {t('sider.menu.report')}
        </Tooltip>
      </Menu.Item>
    </Menu>
  )

  const projectLoadingSpin = (
    <Spin size='large' spinning tip={t('project.loading')} indicator={<LoadingOutlined />}>
      <Card className={styles.loadingSpin} />
    </Spin>
  )

  const saveProjectClick = () => {
    if (!projectData) return
    setsaveLoading(true)
    saveProject({ projectID, values: projectData })
      .then(async res => {
        await Promise.all(
          Object.keys(reportData).map(buildingID =>
            saveReport({ projectID, buildingID, values: reportData[buildingID] })
          )
        )
        dispatch(updateProjectAttributes({ updatedAt: res.Attributes.updatedAt }))
        setsaveLoading(false)
      })
      .catch(() => {
        notification.error({
          message: t('error.save'),
        })
        setsaveLoading(false)
      })
  }

  // 读pv 逆变器 项目数据 最佳倾角朝向
  useEffect(() => {
    const fetchData = async () => {
      setfetchLoading(true)
      const fetchPromises: Promise<unknown>[] = []
      fetchPromises.push(
        getPV({})
          .then(res => dispatch(setPVData(res)))
          .catch(() => history.push('/'))
      )
      fetchPromises.push(
        getOfficialPV({
          region: cognitoUser && cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US',
        })
          .then(res => dispatch(setOfficialPVData(res)))
          .catch(() => history.push('/'))
      )
      fetchPromises.push(
        getInverter({})
          .then(res => dispatch(setInverterData(res)))
          .catch(() => history.push('/'))
      )
      fetchPromises.push(
        getOfficialInverter({
          region: cognitoUser && cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US',
        })
          .then(res => dispatch(setOfficialInverterData(res)))
          .catch(() => history.push('/'))
      )
      await Promise.all(fetchPromises)

      getProjectSingle({ projectID: projectID })
        .then(async res => {
          dispatch(setProjectData(res))
          const getReportPromises = res.buildings
            .map(building => {
              return getReport({ projectID, buildingID: building.buildingID }).then(res =>
                dispatch(setReportData({ buildingID: building.buildingID, data: res }))
              )
            })
            .concat([
              getReport({ projectID, buildingID: 'overview' }).then(res =>
                dispatch(setReportData({ buildingID: 'overview', data: res }))
              ),
            ])
          await Promise.all(getReportPromises)
          setfetchLoading(false)

          if (
            !(res.optTilt && res.optTilt >= 0) ||
            !(res.optAzimuth && res.optAzimuth >= 0) ||
            !res.optPOA ||
            !res.tiltAzimuthPOA ||
            res.tiltAzimuthPOA.length === 0
          ) {
            globalOptTiltAzimuth({ projectID: projectID }).then(optSpec => {
              dispatch(setProjectData({ ...optSpec }))
            })
            const allTiltAziPOA = [
              allTiltAzimuthPOA({ projectID: projectID, startAzi: 0, endAzi: 90 }),
              allTiltAzimuthPOA({ projectID: projectID, startAzi: 90, endAzi: 180 }),
              allTiltAzimuthPOA({ projectID: projectID, startAzi: 180, endAzi: 270 }),
              allTiltAzimuthPOA({ projectID: projectID, startAzi: 270, endAzi: 360 }),
            ]
            Promise.all(allTiltAziPOA).then(allPOARes => {
              notification.success({
                message: t('sider.tiltAzimuthPOA.success'),
              })
              dispatch(
                setProjectData({
                  tiltAzimuthPOA: allPOARes.flatMap(obj => obj.allTiltAziPOA),
                })
              )
            })
          }
        })
        .catch(() => {
          dispatch(releaseProjectData())
          history.push('/')
        })
    }

    const saveProjectOnExit = () => async (
      dispatch: Dispatch<unknown>,
      getState: () => RootState
    ) => {
      const projectData = getState().project
      const reportData = getState().report
      if (projectData) await saveProject({ projectID, values: projectData })
      const allPromise = Object.keys(reportData).map(buildingID =>
        saveReport({ projectID, buildingID, values: reportData[buildingID] })
      )
      await Promise.all(allPromise)
      return dispatch(releaseProjectData())
    }

    fetchData()

    return () => {
      dispatch(saveProjectOnExit())
    }
  }, [cognitoUser, dispatch, history, projectID, t])

  useBeforeunload(async event => {
    if (!projectData) return
    event.preventDefault()
    const allPromise: Promise<unknown>[] = []
    allPromise.push(saveProject({ projectID, values: projectData }))
    Object.keys(reportData).forEach(buildingID =>
      allPromise.push(saveReport({ projectID, buildingID, values: reportData[buildingID] }))
    )
    await Promise.all(allPromise)
    return
  })

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='description' content={t('user.logo.welcome')} />
        <title>{`${(projectData && projectData.projectTitle) || 'Loading'} - ${t(
          'sider.company'
        )}`}</title>
      </Helmet>
      <Layout>
        <EmailSupport />
        <Sider width={250} className={styles.sider}>
          <Row className={styles.title} align='middle' justify='center'>
            <img alt='logo' className={styles.logo} src={logo} />
            <div>
              <h1>{t('sider.company')}</h1>
              <h4>
                {t('sider.edition')}
                {process.env.REACT_APP_VERSION}
              </h4>
            </div>
          </Row>
          {projectData && Object.keys(projectData).length !== 0 ? (
            <div>
              {projectData.projectType === 'commercial' ? commercialMenu : domesticMenu}
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
            </div>
          ) : (
            <div className={styles.spin}>
              <Spin size='large' />
            </div>
          )}
        </Sider>

        <Layout className={styles.main}>
          {cognitoUser ? <PrivateHeader /> : <PublicHeader />}

          <Content className={styles.content}>
            {fetchLoading ? projectLoadingSpin : props.children}
          </Content>

          <Footer className={styles.footer}>
            <DefaultFooter />
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}

export default ProjectLayout
