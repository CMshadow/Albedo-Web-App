import React, { useState, useEffect } from 'react'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Spin, Tabs, Card, Row, Col, Menu } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InvestTab } from './tabs/InvestTab'
import { GainTab } from './tabs/GainTab'
import { ProdTab } from './tabs/ProdTab'
import { LossTab } from './tabs/LossTab'
import { IrrTab } from './tabs/IrrTab'
import { MultiPVDetailTable } from '../../components/PVDetailTable/MultiPVDetailTable'
import { MultiInverterDetailTable } from '../../components/InverterDetailTable/MultiInverterDetailTable'
import { EmissionReductionCard } from '../../components/EmissionReductionCard/EmissionReductionCard'
import { ReportHeadDescription } from '../../components/Descriptions/ReportHeadDescription'
import { genReport, getReport } from './service'
import { saveProject } from '../Project/service'
import { setReportData, setBuildingReGenReport } from '../../store/action/index'
import * as styles from './Report.module.scss'


const Report = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { projectID, buildingID } = useParams()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const [loading, setloading] = useState(true)
  const [menuKey, setmenuKey] = useState('1')
  const curBuilding = projectData.buildings.find(building =>
    building.buildingID === buildingID
  )

  let component
  switch (menuKey) {
    case '8':
      component = (
        <Card bordered={false}>
          <EmissionReductionCard buildingID={buildingID}/>
        </Card>
      )
      break
    case '7':
      component = (
        <Card bordered={false}>
          <MultiInverterDetailTable buildingID={buildingID}/>
        </Card>
      )
      break
    case '6':
      component = (
        <Card bordered={false}>
          <MultiPVDetailTable buildingID={buildingID}/>
        </Card>
      )
      break
    case '5':
      component = <GainTab buildingID={buildingID}/>
      break
    case '4':
      component = <InvestTab buildingID={buildingID}/>
      break
    case '3':
      component = <LossTab buildingID={buildingID}/>
      break
    case '2':
      component = <ProdTab buildingID={buildingID}/>
      break
    case '1':
    default:
      component = <IrrTab buildingID={buildingID}/>
  }

  useEffect(() => {
    setloading(true)
    if (
      projectData.p_loss_soiling === undefined ||
      projectData.p_loss_soiling === null
    ) {
      history.push({
        pathname: `/project/${projectID}/report/params`,
        state: { buildingID: buildingID }
      })
    } else {
      if (curBuilding.reGenReport) {
        dispatch(saveProject(projectID))
        .then(res => {
          dispatch(genReport({projectID, buildingID: buildingID}))
          .then(res => {
            dispatch(setReportData({buildingID: buildingID, data: res}))
            dispatch(setBuildingReGenReport({buildingID, reGenReport: false}))
            setloading(false)
          })
        })
        .catch(err => {
          setloading(false)
          history.push(`/project/${projectID}/dashboard`)
        })
      } else {
        setloading(false)
      }
    }
  },[buildingID, curBuilding.reGenReport, dispatch, history, projectData.p_loss_soiling, projectID])

  return (
    <Spin indicator={<LoadingOutlined spin />} size='large' spinning={loading}>
      {
        loading ?
        <Card loading /> :
        <>
          <GlobalAlert/>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <ReportHeadDescription buildingID={buildingID}/>
            </Col>
          </Row>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Card bodyStyle={{padding: 0}} loading={loading}>
                <Menu
                  className={styles.menu}
                  onClick={e => setmenuKey(e.key)}
                  selectedKeys={[menuKey]}
                  mode="horizontal"
                >
                  <Menu.Item key="1">{t('report.irrTable')}</Menu.Item>
                  <Menu.Item key="2">{t('report.acPowerTable')}</Menu.Item>
                  <Menu.Item key="3">{t('report.lossTable')}</Menu.Item>
                  <Menu.Item key="4">{t('report.investmentTable')}</Menu.Item>
                  <Menu.Item key="5">{t('report.gainTable')}</Menu.Item>
                  <Menu.Item key="6">{t('report.pvDetail')}</Menu.Item>
                  <Menu.Item key="7">{t('report.inverterDetail')}</Menu.Item>
                  <Menu.Item key="8">{t('report.emissionReduction')}</Menu.Item>
                </Menu>
                {component}
              </Card>
            </Col>
          </Row>
        </>
      }
    </Spin>
  )
}

export default Report
