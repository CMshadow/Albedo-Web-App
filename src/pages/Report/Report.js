import React, { useState, useEffect } from 'react'
import { Spin, Tabs } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InvestmentTable } from '../../components/InvestmentTable/InvestmentTable'
import { GainTable } from '../../components/GainTable/GainTable'
import { genReport, getReport } from './service'
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
        pathname: `${history.location.pathname}/params`,
        state: { buildingID: buildingID }
      })
    } else {
      if (curBuilding.reGenReport) {
        dispatch(genReport({projectID, buildingID: buildingID}))
        .then(res => {
          dispatch(setReportData({buildingID: buildingID, data: res}))
          dispatch(setBuildingReGenReport({buildingID, reGenReport: false}))
          setloading(false)
        })
        .catch(err => {
          setloading(false)
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
    loading ?
    <div className={styles.spin}>
      <Spin indicator={<LoadingOutlined spin />} size='large'/>
    </div> :
    <Tabs defaultActiveKey="1" type="card">
      <TabPane tab={t('report.investmentTable')} key="1">
        <InvestmentTable buildingID={buildingID}/>
      </TabPane>
      <TabPane tab={t('report.gainTable')} key="2">
        <GainTable buildingID={buildingID}/>
      </TabPane>
    </Tabs>
    // <Charts
    //   loading={reportData[buildingID] ? false : true}
    //   {...reportData[buildingID]}
    // />
  )
}

export default Report
