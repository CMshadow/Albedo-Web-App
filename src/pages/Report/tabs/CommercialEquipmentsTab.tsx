import React from 'react'
import { Card, Row, Col } from 'antd'
import { CommercialEquipmentTable } from '../../../components/Table/CommercialEquipmentTable/CommercialEquipmentTable'

export const CommercialEquipmentsTab = () => {
  return (
    <Card bordered={false}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <CommercialEquipmentTable />
        </Col>
      </Row>
    </Card>
  )
}
