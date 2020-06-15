import React from 'react'
import { useSelector } from 'react-redux'
import { Descriptions, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { money2Other } from '../../utils/unitConverter'
const Title = Typography.Title

const Item = Descriptions.Item

export const ReportHeadDescription = ({buildingID}) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const curBuildingReport = reportData[buildingID]
  const buildingName = projectData.buildings.find(building => building.buildingID === buildingID).buildingName

  let ttl_investment = null
  if (curBuildingReport.ttl_investment) {
    const investment = money2Other(curBuildingReport.ttl_investment)
    ttl_investment = `${investment.value} ${t(`money.${investment.unit}`)}`
  }

  const title = (
    <Title style={{textAlign: 'center'}} level={3}>{projectData.projectTitle}</Title>
  )

  return (
    <Card loading={!curBuildingReport}>
      <Descriptions title={title} column={3}>
        <Item label={t('project.descriptions.projectCreator')}>
          {projectData.projectCreator}
        </Item>
        <Item label={t('project.descriptions.projectType')}>
          {t(`project.type.${projectData.projectType}`)}
        </Item>
        <Item label={t('project.descriptions.projectAddress')}>
          {projectData.projectAddress}
        </Item>
        <Item label={t('report.head.buildingName')}>
          {buildingName}
        </Item>
        <Item label={t('report.head.ttl_dc_power_capacity')}>
          {`${curBuildingReport.ttl_dc_power_capacity.value.toFixed(2)} ${curBuildingReport.ttl_dc_power_capacity.unit}`}
        </Item>
        <Item label={t('report.head.year_AC_power')}>
          {`${curBuildingReport.year_AC_power.value.toFixed(2)} ${curBuildingReport.year_AC_power.unit}`}
        </Item>
        <Item label={t('report.head.system_efficiency')}>
          {`${(curBuildingReport.system_efficiency * 100).toFixed(2)} %`}
        </Item>
        <Item label={t('report.head.kWh_over_kWp')}>
          {`${curBuildingReport.kWh_over_kWp.toFixed(0)} h`}
        </Item>
        <Item label={t('report.head.ttl_investment')}>
          {ttl_investment}
        </Item>
      </Descriptions>
    </Card>
  )
}
