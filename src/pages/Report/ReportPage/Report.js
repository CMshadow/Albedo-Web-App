import React, { useState, useEffect } from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InvestmentTable } from './elements/InvestmentTable'
import { Charts } from './elements/Charts'
import { getReport } from './service'
import { setReportData } from '../../../store/action/index'

const Report = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)

  const projectID = history.location.pathname.split('/')[2]
  const buildingIndex = 0
  const buildingID = projectData.buildings[buildingIndex].buildingID
  const year = 1

  useEffect(() => {
    if (!projectData.p_loss_soiling) {
      history.push(`${history.location.pathname}/params`)
    } else {
      dispatch(getReport({projectID, buildingIndex, year}))
      .then(res => {
        console.log(res)
        dispatch(setReportData({buildingID, data: res}))
      })
    }
  },[buildingID, dispatch, history, projectData.p_loss_soiling, projectID])

  return (
    // <Card>
    //   <InvestmentTable buildingIndex={0}/>
    // </Card>
    <Charts
      loading={reportData[buildingID] ? false : true}
      {...reportData[buildingID]}
    />
  )
}

export default Report
