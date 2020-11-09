import React from 'react'
import { Card, Row, Col } from 'antd'
import { InvestmentTable } from '../../../components/Table/InvestmentTable/InvestmentTable'
import { InvestmentChart } from '../../../components/Charts/InvestmentChart'

export const InvestTab = ({ buildingID }) => {
  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <InvestmentTable buildingID={buildingID} />
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <InvestmentChart buildingID={buildingID} />
        </Col>
      </Row>
    </Card>
  )
}
