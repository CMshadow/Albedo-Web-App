import React from 'react'
import { Card, Row, Col } from 'antd'
import { IrradianceTable } from '../../../components/IrradianceTable/IrradianceTable'
import { IrradianceChart } from '../../../components/ReportCharts/IrradianceChart'
import { HeatMap } from '../../../components/ReportCharts/HeatMap'
import { SunPositionChart } from '../../../components/ReportCharts/SunPositionChart'

export const IrrTab = ({buildingID}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <IrradianceTable buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <IrradianceChart buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <HeatMap buildingID={buildingID}/>
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <SunPositionChart buildingID={buildingID}/>
        </Col>
      </Row>
    </Card>
  )
}
