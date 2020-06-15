import React from 'react'
import { Card, Statistic, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'

export const EmissionReductionCard = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)
  const keys = [
    'coal_reduction', 'c_reduction', 'co2_reduction', 'so2_reduction', 'nox_reduction'
  ]

  const genCard = (key) => (
    <Col key={key} span={8}>
      <Card hoverable>
        <Statistic
          title={t(`emissionReduction.${key}`)}
          value={reportData[buildingID][key]}
          precision={2}
          valueStyle={{ color: '#7cb305' }}
          suffix="kg"
        />
      </Card>
    </Col>
  )

  return (
    <>
      <Row gutter={[8, 8]}>
        {
          keys.slice(0,-2).map(key => genCard(key))
        }
      </Row>
      <Row gutter={[8, 8]}>
        {
          keys.slice(-2,).map(key => genCard(key))
        }
      </Row>
    </>
  )
}
