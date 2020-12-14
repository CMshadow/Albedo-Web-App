import React from 'react'
import { Chart, Axis, Line, Point } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type DayIrrChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { date: string; value: number }[]
}

export const DayIrrChart: React.FC<DayIrrChartProps> = ({ scale, dataSource }) => {
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
      <Line key='line' color='#1890ff' shape='smooth' position='date*value' />
      <Point key='point' position='date*value' />
    </Chart>
  )
}
