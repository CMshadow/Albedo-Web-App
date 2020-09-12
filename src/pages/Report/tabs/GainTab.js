import React from 'react'
import { Card, Row, Col } from 'antd'
import { GainTable } from '../../../components/GainTable/GainTable'
import { CashFlowChart } from '../../../components/Charts/CashFlowChart'

export const GainTab = ({buildingID}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <GainTable buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <CashFlowChart buildingID={buildingID}/>
        </Col>
      </Row>
    </Card>
  )
}
