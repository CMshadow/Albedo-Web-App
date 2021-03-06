import React from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { wh2kwh } from '../../../utils/unitConverter'
import styles from './OptimalCard.module.scss'
import { Project } from '../../../@types'

type OptimalCardProps = Partial<Project> & { loading: boolean }

export const OptimalCard: React.FC<OptimalCardProps> = ({ loading, ...values }) => {
  const { t } = useTranslation()

  return (
    <Row gutter={5} className={styles.wrap}>
      <Col lg={8} xl={4}>
        <Card loading={loading} className={styles.card}>
          <Statistic
            className={styles.text}
            title={t('project.optimal.optTilt')}
            value={values.optTilt}
            valueStyle={{ color: '#faad14' }}
            suffix='°'
          />
        </Card>
      </Col>
      <Col lg={8} xl={4}>
        <Card loading={loading} className={styles.card}>
          <Statistic
            className={styles.text}
            title={t('project.optimal.optAzi')}
            value={values.optAzimuth}
            valueStyle={{ color: '#faad14' }}
            suffix='°'
          />
        </Card>
      </Col>
      <Col lg={8} xl={4}>
        <Card loading={loading} className={styles.card}>
          {values.optPOA !== undefined && values.optPOA >= 0 ? (
            <Statistic
              className={styles.text}
              title={t('project.optimal.optPOA')}
              value={Number(wh2kwh(values.optPOA))}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              suffix='kWh/㎡'
            />
          ) : null}
        </Card>
      </Col>
      <Col lg={8} xl={4}>
        <Card loading={loading} className={styles.card}>
          {values.GHI ? (
            <Statistic
              className={styles.text}
              title={t('project.optimal.GHI')}
              value={Number(wh2kwh(values.GHI))}
              precision={2}
              valueStyle={{ color: '#69c0ff' }}
              suffix='kWh/㎡'
            />
          ) : null}
        </Card>
      </Col>
      <Col lg={8} xl={4}>
        <Card loading={loading} className={styles.card}>
          {values.DNI ? (
            <Statistic
              className={styles.text}
              title={t('project.optimal.DNI')}
              value={Number(wh2kwh(values.DNI))}
              precision={2}
              valueStyle={{ color: '#69c0ff' }}
              suffix='kWh/㎡'
            />
          ) : null}
        </Card>
      </Col>
      <Col lg={8} xl={4}>
        <Card loading={loading} className={styles.card}>
          {values.DHI ? (
            <Statistic
              className={styles.text}
              title={t('project.optimal.DHI')}
              value={Number(wh2kwh(values.DHI))}
              precision={2}
              valueStyle={{ color: '#69c0ff' }}
              suffix='kWh/㎡'
            />
          ) : null}
        </Card>
      </Col>
    </Row>
  )
}
