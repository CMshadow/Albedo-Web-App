import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Typography } from 'antd'
import { Chart, Line, Axis, Tooltip } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
const Title = Typography.Title

export const ACDistributionChart = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const DCPower = reportData[buildingID].ttl_dc_power_capacity.value
  const DCUnit = reportData[buildingID].ttl_dc_power_capacity.unit
  const ACPower = reportData[buildingID].ac_output_distribution.value
  const ACUnit = reportData[buildingID].ac_output_distribution.unit

  const step = DCPower / 100
  const dataSource = ACPower.map((value, index) => ({
    dc: index * step,
    ac: value,
  }))

  const scale = {
    dc: {
      alias: t('acDistributionChart.dc'),
      nice: true,
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${DCUnit}`,
    },
    ac: {
      alias: t('acDistributionChart.ac'),
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${ACUnit}`,
      nice: true,
    },
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('acDistributionChart.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <Chart
        scale={scale}
        height={500}
        autoFit
        data={dataSource}
        padding="auto"
        onTooltipChange={e => {
          const items = e.items
          const bucket = items[0]
          items[0].value = `${bucket.data.dc.toFixed(2)} ${DCUnit} - ${(bucket.data.dc + step).toFixed(2)} ${DCUnit}`
        }}
      >
        <Axis name="dc" title={{ style: titleStyle }} />
        <Axis name="ac" title={{ style: titleStyle }} />
        <Line shape="hv" position="dc*ac" tooltip="dc*ac" />
        <Tooltip
          showMarkers
          showTitle={false}
          marker={{
            lineWidth: 3,
            stroke: '#fa8c16',
            fill: '#fff',
          }}
        />
      </Chart>
    </Card>
  )
}
