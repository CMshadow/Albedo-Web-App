import React from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { wh2kwh, wh2other } from '../../../utils/unitConverter'
import styles from './OptimalCard.module.scss'
import { Project } from '../../../@types'

type OptimalCardProps = Partial<Project> & { loading: boolean }

export const OptimalCard: React.FC<OptimalCardProps> = ({ loading, ...values }) => {
  const { t } = useTranslation()

  return (
    <Row gutter={12}>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            className={styles.text}
            title={t('project.optimal.optTilt')}
            value={values.optTilt}
            valueStyle={{ color: '#faad14' }}
            suffix='°'
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            className={styles.text}
            title={t('project.optimal.optAzi')}
            value={values.optAzimuth}
            valueStyle={{ color: '#faad14' }}
            suffix='°'
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card loading={loading}>
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
    </Row>
  )
}
