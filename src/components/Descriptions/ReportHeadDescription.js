import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Descriptions, Card, Typography, Button } from 'antd'
import { CloudDownloadOutlined, LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { MoneyText } from '../../utils/genMoneyText'
import { downloadReportCSV } from '../../pages/Report/service'
const Title = Typography.Title

const Item = Descriptions.Item

export const ReportHeadDescription = ({ buildingID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { projectID } = useParams()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const curBuildingReport = reportData[buildingID]
  const [csvLoading, setcsvLoading] = useState(false)

  let ttl_investment = null
  if (curBuildingReport.ttl_investment) {
    ttl_investment = MoneyText({ t: t, money: curBuildingReport.ttl_investment, abbr: true })
  }

  const title = (
    <Title style={{ textAlign: 'center' }} level={3}>
      {projectData.projectTitle}
    </Title>
  )

  return (
    <Card loading={!curBuildingReport}>
      <Descriptions title={title} column={3}>
        <Item label={t('project.descriptions.projectCreator')}>{projectData.projectCreator}</Item>
        <Item label={t('project.descriptions.projectType')}>{t(`project.type.${projectData.projectType}`)}</Item>
        <Item label={t('project.descriptions.projectAddress')}>{projectData.projectAddress}</Item>
        {buildingID !== 'overview' ? (
          <Item label={t('report.head.buildingName')}>
            {projectData.buildings.find(building => building.buildingID === buildingID).buildingName}
          </Item>
        ) : null}
        <Item label={t('report.head.ttl_dc_power_capacity')}>
          {`${curBuildingReport.ttl_dc_power_capacity.value.toFixed(2)} ${
            curBuildingReport.ttl_dc_power_capacity.unit
          }`}
        </Item>
        <Item label={t('report.head.year_AC_power')}>
          {`${curBuildingReport.year_AC_power.value.toFixed(2)} ${curBuildingReport.year_AC_power.unit}`}
        </Item>
        <Item label={t('report.head.system_efficiency')}>
          {`${(curBuildingReport.system_efficiency * 100).toFixed(2)} %`}
        </Item>
        <Item label={t('report.head.kWh_over_kWp')}>{`${curBuildingReport.kWh_over_kWp.toFixed(0)} h`}</Item>
        {buildingID !== 'overview' ? <Item label={t('report.head.ttl_investment')}>{ttl_investment}</Item> : null}
        <Item label={t('report.head.download_csv')}>
          <Button
            size="small"
            shape="circle"
            type="link"
            icon={csvLoading ? <LoadingOutlined /> : <CloudDownloadOutlined />}
            onClick={() => {
              setcsvLoading(true)
              dispatch(downloadReportCSV({ projectID, buildingID })).then(url => {
                setcsvLoading(false)
                window.open(url, '_blank')
              })
            }}
          />
        </Item>
      </Descriptions>
    </Card>
  )
}
