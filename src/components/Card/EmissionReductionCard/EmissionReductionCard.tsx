import React from 'react'
import { Card, Statistic, Row, Col, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { kg2other } from '../../../utils/unitConverter'
import { RootState } from '../../../@types'
const { Title } = Typography

type EmissionReductionCardProps = { buildingID: string }

export const EmissionReductionCard: React.FC<EmissionReductionCardProps> = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector((state: RootState) => state.report)
  const keys = [
    'coal_reduction',
    'c_reduction',
    'co2_reduction',
    'so2_reduction',
    'nox_reduction',
  ] as const

  const genCard = (key: typeof keys[number]) => {
    const data = kg2other(reportData[buildingID][key])
    return (
      <Col key={key} span={8}>
        <Card hoverable style={{ cursor: 'unset' }}>
          <Statistic
            title={t(`emissionReduction.${key}`)}
            value={data.value}
            precision={2}
            valueStyle={{ color: '#7cb305' }}
            suffix={t(`emissionReduction.${data.unit}`)}
          />
        </Card>
      </Col>
    )
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('emissionReductionCard.title')}
        </Title>
      }
      bordered={false}
    >
      <Row gutter={[8, 8]}>{keys.slice(0, -2).map(key => genCard(key))}</Row>
      <Row gutter={[8, 8]}>{keys.slice(-2).map(key => genCard(key))}</Row>
    </Card>
  )
}
