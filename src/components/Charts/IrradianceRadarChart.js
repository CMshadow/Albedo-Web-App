import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Space, Row, Typography, Select, Card } from 'antd'
import { Chart, Coordinate, Point, Tooltip, Line, Area, Legend, Axis } from 'bizcharts'

const { Title, Text } = Typography
const { Option } = Select

export const IrradianceRadarChart = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const [tiltPickedPrim, settiltPickedPrim] = useState(10)
  const [tiltPickedScnd, settiltPickedScnd] = useState(60)

  const tiltAzimuthPOA = projectData.tiltAzimuthPOA || [[0, 0, 0]]
  const aggregatedByTilt = tiltAzimuthPOA.reduce((aggr, val) => {
    const [tilt, azimuth, poa] = val
    if (tilt in aggr) {
      aggr[tilt].push({ azimuth: azimuth, poa: poa })
    } else {
      aggr[tilt] = [{ azimuth: azimuth, poa: poa }]
    }
    return aggr
  }, {})

  const poaMax = Math.max(
    aggregatedByTilt[tiltPickedPrim].reduce((max, val) => (val.poa > max ? val.poa : max), -Infinity),
    aggregatedByTilt[tiltPickedScnd].reduce((max, val) => (val.poa > max ? val.poa : max), -Infinity)
  )

  const dataSource = aggregatedByTilt[tiltPickedPrim]
    .map(val => ({
      tilt: tiltPickedPrim,
      azimuth: val.azimuth,
      poaPercent: (val.poa / poaMax) * 100,
    }))
    .concat(
      aggregatedByTilt[tiltPickedScnd].map(val => ({
        tilt: tiltPickedScnd,
        azimuth: val.azimuth,
        poaPercent: (val.poa / poaMax) * 100,
      }))
    )

  const scale = {
    azimuth: {
      alias: t('heatMap.azimuth'),
      min: 0,
      max: 360,
      formatter: text => `${text}°`,
      tickInterval: 20,
    },
    poaPercent: {
      alias: t('heatMap.poa'),
      min: 0,
      max: 100,
      formatter: text => `${text.toFixed(2)}%`,
    },
    tilt: {
      type: 'cat',
      alias: t('heatMap.tilt'),
      formatter: text => `${text}°`,
    },
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('irrRadarChart.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <Row justify="center">
        <Space size="large">
          <Text strong>{t('irrRadarChart.selectTilt')}</Text>
          <Select style={{ width: 100 }} defaultValue={`${tiltPickedPrim}°`} onChange={val => settiltPickedPrim(val)}>
            {Object.keys(aggregatedByTilt).map(tilt => (
              <Option key={tilt} value={tilt}>
                {tilt}°
              </Option>
            ))}
          </Select>
          <Select style={{ width: 100 }} defaultValue={`${tiltPickedScnd}°`} onChange={val => settiltPickedScnd(val)}>
            {Object.keys(aggregatedByTilt).map(tilt => (
              <Option key={tilt} value={tilt}>
                {tilt}°
              </Option>
            ))}
          </Select>
        </Space>
      </Row>
      <Chart
        height={500}
        data={dataSource}
        autoFit
        scale={scale}
        padding={[50, 0, 60, 0]}
        interactions={['legend-highlight']}
      >
        <Coordinate type="polar" style={{ fontSize: 25 }} />
        <Axis name="azimuth" label={{ offset: 20, style: { fontSize: 14 } }} />
        <Axis name="poaPercent" label={{ style: { fontSize: 14 } }} />
        <Tooltip shared />
        <Point position="azimuth*poaPercent" color="tilt" shape="circle" size={0} />
        <Line position="azimuth*poaPercent" size={3} color={['tilt', ['#096dd9', '#fa8c16']]} />
        <Area position="azimuth*poaPercent" tooltip={false} color={['tilt', ['#bae7ff', '#ffd591']]} />
        <Legend position="bottom" offsetY={0} />
      </Chart>
    </Card>
  )
}
