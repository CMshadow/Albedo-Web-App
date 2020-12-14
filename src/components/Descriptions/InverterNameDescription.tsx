import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { RootState } from '../../@types'
const Item = Descriptions.Item

type InverterNameDescriptionProps = {
  inverterID: string
  count: number
}

export const InverterNameDescription: React.FC<InverterNameDescriptionProps> = ({
  inverterID,
  count,
}) => {
  const { t } = useTranslation()
  const inverterRedux = useSelector((state: RootState) => state.inverter)
  const inverterData = inverterRedux.data.concat(inverterRedux.officialData)
  const inverterSpec = inverterData.find(pv => pv.inverterID === inverterID)

  return (
    <Descriptions column={2} bordered className={styles.description}>
      <Item label={t('table.inverterName')} span={2}>
        {inverterSpec?.name}
      </Item>
      {count ? (
        <Item label={t('table.count')} span={2}>
          {count}
        </Item>
      ) : null}
    </Descriptions>
  )
}
