import React from 'react'
import { Chart, Axis, Interval } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type MonthlyProductionChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { date: string; value: number }[]
}

export const MonthlyProductionChart: React.FC<MonthlyProductionChartProps> = ({
  scale,
  dataSource,
}) => {
  return (
    <Chart
      scale={scale}
      padding={[30, 30, 100, 100]}
      autoFit
      height={500}
      data={dataSource}
      interactions={['active-region']}
    >
      <Axis name='date' title={{ style: titleStyle }} />
      <Axis name='value' title={{ style: titleStyle }} />
      <Interval position='date*value' color={['type', ['#1890ff', '#faad14']]} />
    </Chart>
  )
}
