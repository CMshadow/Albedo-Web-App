import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item

export const PVNameDescription = ({pvID, count}) => {
  const { t } = useTranslation()
  const pvData = useSelector(state => state.pv).data
  const pvSpec = pvData.find(pv => pv.pvID === pvID)

  return (
    <Descriptions column={2} bordered>
      <Item label={t('table.pvName')} span={2}>
        {pvSpec.name}
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
