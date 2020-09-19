import React from 'react'
import { Card } from 'antd'
import * as styles from './UnusedCombiboxInverterCard.module.scss'

export const UnusedCombiboxInverterCard = () => {
  return (
    <Card className={styles.card} title='未连接设备' headStyle={{textAlign: 'center'}}>
    </Card>
  )
}