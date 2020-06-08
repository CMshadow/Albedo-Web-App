import React, { useEffect } from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { InvestmentTable } from './elements/InvestmentTable'

const Report = () => {
  const history = useHistory()
  const projectData = useSelector(state => state.project)
  console.log(history)

  // useEffect(() => {
  //   if (!projectData.p_loss_soiling) history.push(`${history.location.pathname}/params`)
  // },[history, projectData.p_loss_soiling])

  return (
    <Card>
      <InvestmentTable buildingIndex={0}/>
    </Card>
  )
}

export default Report
