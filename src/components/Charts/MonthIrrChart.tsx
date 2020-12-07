import React from 'react'
import { Chart, Axis, Interval } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type MonthirrChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { date: string; value: number }[]
}

export const MonthIrrChart: React.FC<MonthirrChartProps> = ({ scale, dataSource }) => {
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
      <Interval color='#1890ff' position='date*value' />
    </Chart>
  )
}
