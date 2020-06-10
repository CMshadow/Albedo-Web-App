import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InvestmentTable } from './elements/InvestmentTable'
import { Charts } from './elements/Charts'
import { getReport } from './service'
import { setReportData } from '../../../store/action/index'
import * as styles from './Report.module.scss'

const Report = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const [loading, setloading] = useState(true)

  const projectID = history.location.pathname.split('/')[2]
  const buildingIndex = 0
  const buildingID = projectData.buildings[buildingIndex].buildingID
  const year = 1

  // useEffect(() => {
  //   if (!projectData.p_loss_soiling) {
  //     history.push(`${history.location.pathname}/params`)
  //   } else {
  //     dispatch(getReport({projectID, buildingIndex, year}))
  //     .then(res => {
  //       console.log(res)
  //       dispatch(setReportData({buildingID, data: res}))
  //       setloading(false)
  //     })
  //   }
  // },[buildingID, dispatch, history, projectData.p_loss_soiling, projectID])

  return (
    loading ?
    <div className={styles.spin}>
      <Spin indicator={<LoadingOutlined spin />} size='large'/>
    </div> :
    <InvestmentTable buildingID={buildingID}/>
    // <Charts
    //   loading={reportData[buildingID] ? false : true}
    //   {...reportData[buildingID]}
    // />
  )
}

export default Report
