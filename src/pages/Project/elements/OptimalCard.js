import React from 'react'
import { Card, Statistic, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { wh2other } from '../../../utils/unitConverter';
import * as styles from './OptimalCard.module.scss';

export const OptimalCard = ({loading, ...values}) => {
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
            suffix="°"
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
            suffix="°"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            className={styles.text}
            title={t('project.optimal.optPOA')}
            value={wh2other(values.optPOA).value}
            precision={2}
            valueStyle={{ color: '#faad14' }}
            suffix={wh2other(values.optPOA).unit + '/㎡'}
          />
        </Card>
      </Col>
    </Row>

  )
}
