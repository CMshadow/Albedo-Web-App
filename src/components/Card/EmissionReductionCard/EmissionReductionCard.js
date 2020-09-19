import React from 'react'
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import { kg2other } from '../../../utils/unitConverter'
const Title = Typography.Title

export const EmissionReductionCard = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)
  const keys = [
    'coal_reduction', 'c_reduction', 'co2_reduction', 'so2_reduction', 'nox_reduction'
  ]

  const genCard = (key) => {
    const data = kg2other(reportData[buildingID][key])
    return (
    <Col key={key} span={8}>
      <Card hoverable>
        <Statistic
          title={t(`emissionReduction.${key}`)}
          value={data.value}
          precision={2}
          valueStyle={{ color: '#7cb305' }}
          suffix={t(`emissionReduction.${data.unit}`)}
        />
      </Card>
    </Col>
  )}

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('emissionReductionCard.title')}
        </Title>
      }
      bordered={false}
    >
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
    </Card>
  )
}
