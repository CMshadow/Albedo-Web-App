import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Typography } from 'antd'
import { Chart, Point, Axis, Tooltip } from 'bizcharts';
import { titleStyle } from '../../styles.config'
const Title = Typography.Title

export const IrrVSProdChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const ghi = reportData[buildingID].GHI
  const dailyACPower = reportData[buildingID].daily_AC_power.value
  const unit = reportData[buildingID].daily_AC_power.unit
  const dataSource = dailyACPower.map((dayACPower, index) => ({
    ghi: ghi[index],
    ac: dayACPower
  }))

  const scale = {
    ghi: {
      alias: t('irrVSProdChart.ghi'),
      nice: true,
      tickCount: 10,
      formatter: text => text.toFixed(2),
    },
    ac: {
      alias: `${t('irrVSProdChart.ac')} (${unit}${t('irrVSProdChart.perday')})`,
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${unit}`,
      nice: true
    },
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('irrVSProdChart.title')}
        </Title>
      }
      hoverable
      style={{cursor: 'unset'}}
    >
      <Chart
        scale={scale}
        height={500}
        autoFit data={dataSource}
        interactions={['active-region']}
        padding='auto'
      >
        <Axis name='ghi' title={{style: titleStyle}} />
        <Axis name='ac' title={{style: titleStyle}} />
        <Point
          position="ghi*ac" shape="circle" size={5}
          style={{fillOpacity: 0.85}} tooltip='ghi*ac'
        />
        <Tooltip
          showMarkers
          showTitle={false}
          marker={{
            r: 7,
            lineWidth: 5,
            stroke: '#fa8c16',
            fill: '#fff'
          }}
        />
      </Chart>
    </Card>
  )
}
