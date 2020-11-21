import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item

export const LossTiltAzimuthDescription = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  return (
    <Descriptions column={2} bordered className='tableHeader'>
      <Item label={t('lossTable.p_loss_tilt_azimuth')} span={2}>
        {`${((1 - reportData[buildingID].p_loss_tilt_azimuth) * 100).toFixed(2)} %`}
      </Item>
    </Descriptions>
  )
}
