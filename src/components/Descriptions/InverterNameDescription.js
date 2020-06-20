import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item

export const InverterNameDescription = ({inverterID, count}) => {
  const { t } = useTranslation()
  const inverterRedux = useSelector(state => state.inverter)
  const inverterData = inverterRedux.data.concat(inverterRedux.officialData)
  const inverterSpec = inverterData.find(pv => pv.inverterID === inverterID)

  return (
    <Descriptions column={2} bordered>
      <Item label={t('table.inverterName')} span={2}>
        {inverterSpec.name}
      </Item>
      {
        count ?
        <Item label={t('table.count')} span={2}>
          {count}
        </Item> : null
      }
    </Descriptions>
  )
}
