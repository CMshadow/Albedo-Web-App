import React from 'react'
import { Card, Row, Col } from 'antd'
import { ACPowerTable } from '../../../components/ACPowerTable/ACPowerTable'
import { ACPowerChart } from '../../../components/ReportCharts/ACPowerChart'
import { ProductionChart } from '../../../components/ReportCharts/ProductionChart'

export const ProdTab = ({buildingID}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <ACPowerTable buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <ACPowerChart buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <ProductionChart buildingID={buildingID}/>
        </Col>
      </Row>
    </Card>
  )
}
