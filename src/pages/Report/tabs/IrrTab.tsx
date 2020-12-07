import React from 'react'
import { Card, Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { IrradianceTable } from '../../../components/Table/IrradianceTable/IrradianceTable'
import { WeatherAnalysisTable } from '../../../components/Table/WeatherAnalysisTable/WeatherAnalysisTable'
import { IrradianceChart } from '../../../components/Charts/IrradianceChart'
import { HeatMap } from '../../../components/Charts/HeatMap'
import { SunPositionChart } from '../../../components/Charts/SunPositionChart'
import { IrradianceRadarChart } from '../../../components/Charts/IrradianceRadarChart'
import { DynamicIrradianceChart } from '../../../components/Charts/DynamicIrradianceChart'
import { RootState } from '../../../@types'

export const IrrTab: React.FC<{ buildingID: string }> = ({ buildingID }) => {
  const reportData = useSelector((state: RootState) => state.report)

  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <IrradianceTable buildingID={buildingID} />
        </Col>
      </Row>
      {/* New Chart Added at Beta 0.3.0 */}
      {reportData[buildingID].weatherAnalysis ? (
        <Row gutter={[0, 25]}>
          <Col span={24}>
            <WeatherAnalysisTable buildingID={buildingID} />
          </Col>
        </Row>
      ) : null}
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <IrradianceChart buildingID={buildingID} />
        </Col>
      </Row>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <HeatMap />
        </Col>
      </Row>
      {/* New Chart Added at Beta 0.3.0 */}
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <IrradianceRadarChart />
        </Col>
      </Row>
      {/* New Chart Added at Beta 0.3.0 */}
      {reportData[buildingID].sunPosition ? (
        <Row gutter={[0, 25]}>
          <Col span={24}>
            <SunPositionChart buildingID={buildingID} />
          </Col>
        </Row>
      ) : null}
      {/* New Chart Added at Beta 0.3.0 */}
      {reportData[buildingID].weatherAnalysis ? (
        <Row gutter={[0, 25]}>
          <Col span={24}>
            <DynamicIrradianceChart />
          </Col>
        </Row>
      ) : null}
    </Card>
  )
}
