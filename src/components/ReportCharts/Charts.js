import React, { useEffect, useState } from 'react'
import { Card, Statistic, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as styles from './Charts.module.scss'

export const Charts = ({loading, ...values}) => {
  const { t } = useTranslation()

  return (
    <Row gutter={12}>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            className={styles.text}
            title={t('report.charts.total_pv_capacity')}
            value={
              values.ttl_dc_power_capacity ?
              values.ttl_dc_power_capacity.value:
              null
            }
            valueStyle={{ color: '#faad14' }}
            suffix={
              values.ttl_dc_power_capacity ?
              values.ttl_dc_power_capacity.unit :
              null
            }
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            className={styles.text}
            title={t('report.charts.year_1_production')}
            value={
              values.year_AC_power ?
              values.year_AC_power.value :
              null
            }
            valueStyle={{ color: '#faad14' }}
            suffix={
              values.year_AC_power ?
              values.year_AC_power.unit :
              null
            }
          />
        </Card>
      </Col>
    </Row>
  )
}
