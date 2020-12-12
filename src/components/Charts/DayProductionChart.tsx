import React from 'react'
import { Chart, Legend, Axis, Line, Point } from 'bizcharts'
import { titleStyle, legendStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type DayProductionChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { date: string; value: number }[]
}

export const DayProductionChart: React.FC<DayProductionChartProps> = ({ scale, dataSource }) => {
  return (
    <Chart
      scale={scale}
      padding={[30, 30, 100, 100]}
      autoFit
      height={500}
      data={dataSource}
      interactions={['active-region']}
    >
      <Legend position='bottom' itemName={{ style: legendStyle }} offsetY={-10} />
      <Axis name='date' title={{ style: titleStyle }} />
      <Axis name='value' title={{ style: titleStyle }} />
      <Line
        key='line'
        shape='smooth'
        position='date*value'
        color={['type', ['#1890ff', '#faad14']]}
      />
      <Point key='point' position='date*value' color={['type', ['#1890ff', '#faad14']]} />
    </Chart>
  )
}
