import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item

export const TableHeadDescription = ({buildingID}) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  // 项目DC装机量单位W
  const DCCapacity = reportData[buildingID].ttl_dc_power_capacity

  return (
    <Descriptions column={2} bordered className='tableHeader'>
      <Item label={t('investment.project-title')} span={1}>
        {projectData.projectTitle + t('investment.title')}
      </Item>
      <Item label={t('investment.project-scale')} span={1}>
        {`${DCCapacity.value} ${DCCapacity.unit}`}
      </Item>
    </Descriptions>
  )
}
