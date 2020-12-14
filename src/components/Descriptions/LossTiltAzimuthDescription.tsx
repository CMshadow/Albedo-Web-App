import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../@types'
const Item = Descriptions.Item

type LossTiltAzimuthDescriptionProps = { buildingID: string }

export const LossTiltAzimuthDescription: React.FC<LossTiltAzimuthDescriptionProps> = ({
  buildingID,
}) => {
  const { t } = useTranslation()
  const reportData = useSelector((state: RootState) => state.report)

  return (
    <Descriptions column={2} bordered className='tableHeader'>
      <Item label={t('lossTable.p_loss_tilt_azimuth')} span={2}>
        {`${((1 - reportData[buildingID].p_loss_tilt_azimuth) * 100).toFixed(2)} %`}
      </Item>
    </Descriptions>
  )
}
