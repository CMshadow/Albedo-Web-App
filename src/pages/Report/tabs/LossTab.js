import React from 'react'
import { Card, Row, Col } from 'antd'
import { LossTable } from '../../../components/LossTable/LossTable'
import { LossChart } from '../../../components/ReportCharts/LossChart'
import { SystemEfficiencyChart } from '../../../components/ReportCharts/SystemEfficiencyChart'

export const LossTab = ({buildingID}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <LossTable buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[12, 25]}>
        <Col xl={24} xxl={16}>
          <LossChart buildingID={buildingID}/>
        </Col>
        <Col xl={24} xxl={8}>
          <SystemEfficiencyChart buildingID={buildingID}/>
        </Col>
      </Row>
    </Card>
  )
}
