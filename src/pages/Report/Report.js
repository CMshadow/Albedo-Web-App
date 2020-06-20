import React, { useState, useEffect } from 'react'
import { Spin, Tabs, Card, Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
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

const { TabPane } = Tabs;

const Report = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const [loading, setloading] = useState(true)

  const projectID = history.location.pathname.split('/')[2]
  const buildingID = history.location.pathname.split('/')[4]
  const curBuilding = projectData.buildings.find(building =>
    building.buildingID === buildingID
  )

  useEffect(() => {
    if (!projectData.p_loss_soiling) {
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
            dispatch(setBuildingReGenReport({buildingID, reGenReport: false}))
            dispatch(setReportData({buildingID: buildingID, data: res}))
            setloading(false)
          })
          .catch(err => {
            setloading(false)
          })
        })
      } else if (!curBuilding.reGenReport && !reportData[buildingID]) {
        dispatch(getReport({projectID, buildingID: buildingID}))
        .then(res => {
          dispatch(setReportData({buildingID: buildingID, data: res}))
          setloading(false)
        })
        .catch(err => {
          setloading(false)
        })
      } else {
        setloading(false)
      }
    }
  },[buildingID, curBuilding, curBuilding.reGenReport, dispatch, history, projectData.buildings, projectData.p_loss_soiling, projectID, reportData])

  return (
    <Spin indicator={<LoadingOutlined spin />} size='large' spinning={loading}>
      {
        loading ?
        <Card loading /> :
        <>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <ReportHeadDescription buildingID={buildingID}/>
            </Col>
          </Row>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Card bodyStyle={{padding: 0}} loading={loading}>
                <Tabs
                  defaultActiveKey="1"
                  type="card"
                  className={styles.tabs}
                  tabBarStyle={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <TabPane tab={t('report.irrTable')} key="1">
                    <IrrTab buildingID={buildingID}/>
                  </TabPane>
                  <TabPane tab={t('report.acPowerTable')} key="2">
                    <ProdTab buildingID={buildingID}/>
                  </TabPane>
                  <TabPane tab={t('report.lossTable')} key="3">
                    <LossTab buildingID={buildingID}/>
                  </TabPane>
                  <TabPane tab={t('report.investmentTable')} key="4">
                    <InvestTab buildingID={buildingID}/>
                  </TabPane>
                  <TabPane tab={t('report.gainTable')} key="5">
                    <GainTab buildingID={buildingID}/>
                  </TabPane>
                  <TabPane tab={t('report.pvDetail')} key="6">
                    <Card bordered={false}>
                      <MultiPVDetailTable buildingID={buildingID}/>
                    </Card>
                  </TabPane>
                  <TabPane tab={t('report.inverterDetail')} key="7">
                    <Card bordered={false}>
                      <MultiInverterDetailTable buildingID={buildingID}/>
                    </Card>
                  </TabPane>
                  <TabPane tab={t('report.emissionReduction')} key="8">
                    <Card bordered={false}>
                      <EmissionReductionCard buildingID={buildingID}/>
                    </Card>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </>
      }
    </Spin>
  )
}

export default Report
