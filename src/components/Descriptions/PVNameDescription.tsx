import React from 'react'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../@types'
import styles from './index.module.scss'
const Item = Descriptions.Item

type PVNameDescriptionProps = {
  pvID: string
  count: number
}

export const PVNameDescription: React.FC<PVNameDescriptionProps> = ({ pvID, count }) => {
  const { t } = useTranslation()
  const pvRedux = useSelector((state: RootState) => state.pv)
  const pvData = pvRedux.data.concat(pvRedux.officialData)
  const pvSpec = pvData.find(pv => pv.pvID === pvID)

  return (
    <Descriptions column={2} bordered className={styles.description}>
      <Item label={t('table.pvName')} span={2}>
        {pvSpec?.name}
      </Item>
      {count ? (
        <Item label={t('table.count')} span={2}>
          {count}
        </Item>
      ) : null}
    </Descriptions>
  )
}
