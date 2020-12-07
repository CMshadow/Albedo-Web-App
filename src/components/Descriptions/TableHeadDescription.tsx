import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../@types'
const Item = Descriptions.Item

type TableHeadDescriptionProps = { buildingID: string }

export const TableHeadDescription: React.FC<TableHeadDescriptionProps> = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)
  const reportData = useSelector((state: RootState) => state.report)
  // 项目DC装机量单位W
  const DCCapacity = reportData[buildingID].ttl_dc_power_capacity

  return (
    <Descriptions column={2} bordered className='tableHeader'>
      <Item label={t('investment.project-title')} span={1}>
        {projectData?.projectTitle}
      </Item>
      <Item label={t('investment.project-scale')} span={1}>
        {`${DCCapacity.value} ${DCCapacity.unit}`}
      </Item>
    </Descriptions>
  )
}
