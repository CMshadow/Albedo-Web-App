import React from 'react'
import { Card, Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { LossTable } from '../../../components/Table/LossTable/LossTable'
import { LossChart } from '../../../components/Charts/LossChart'
import { SystemEfficiencyChart } from '../../../components/Charts/SystemEfficiencyChart'
import { MonthlySystemEffChart } from '../../../components/Charts/MonthlySystemEffChart'
import { RootState } from '../../../@types'

export const LossTab: React.FC<{ buildingID: string }> = ({ buildingID }) => {
  const reportData = useSelector((state: RootState) => state.report)

  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <LossTable buildingID={buildingID} />
        </Col>
      </Row>
      <Row gutter={[12, 25]}>
        <Col span={24}>
          <LossChart buildingID={buildingID} />
        </Col>
      </Row>
      {/* New Chart Added at Beta 0.3.0 */}
      {reportData[buildingID].p_loss_system_monthly ? (
        <Row gutter={[12, 25]}>
          <Col span={24}>
            <MonthlySystemEffChart buildingID={buildingID} />
          </Col>
        </Row>
      ) : null}
      <Row gutter={[12, 25]}>
        <Col span={24}>
          <SystemEfficiencyChart buildingID={buildingID} />
        </Col>
      </Row>
    </Card>
  )
}
