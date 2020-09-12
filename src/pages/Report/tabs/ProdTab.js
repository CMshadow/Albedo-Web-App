import React from 'react'
import { Card, Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { ACPowerTable } from '../../../components/ACPowerTable/ACPowerTable'
import { ACPowerChart } from '../../../components/Charts/ACPowerChart'
import { ProductionChart } from '../../../components/Charts/ProductionChart'
import { IrrVSProdChart } from '../../../components/Charts/IrrVSProdChart'
import { ACDistributionChart } from '../../../components/Charts/ACDistributionChart'

export const ProdTab = ({buildingID}) => {
  const reportData = useSelector(state => state.report)

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
      {/* New Chart Added at Beta 0.3.0 */}
      {
        reportData[buildingID].daily_AC_power ?
        <Row gutter={[0, 25]}>
          <Col span={24}>
            <IrrVSProdChart buildingID={buildingID}/>
          </Col>
        </Row> :
        null
      }
      {/* New Chart Added at Beta 0.3.0 */}
      {
        reportData[buildingID].ac_output_distribution ?
        <Row gutter={[0, 25]}>
          <Col span={24}>
            <ACDistributionChart buildingID={buildingID}/>
          </Col>
        </Row> :
        null
      }
    </Card>
  )
}
