import React from 'react'
import { Chart, Axis, Interval, Annotation } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type RatioBarChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { month: number; ratio: number }[]
}

export const RatioBarChart: React.FC<RatioBarChartProps> = ({ scale, dataSource }) => {
  return (
    <Chart
      scale={scale}
      padding='auto'
      appendPadding={[0, 0, 0, 30]}
      autoFit
      height={500}
      data={dataSource}
      interactions={['active-region']}
    >
      <Axis name='month' title={{ style: titleStyle }} />
      <Axis name='ratio' title={{ style: titleStyle }} />
      <Interval position='month*ratio' color='#1890ff' />
      <Annotation.Line
        top
        start={['min', 1]}
        end={['max', 1]}
        text={{ content: `1.0`, style: { fontSize: 18 } }}
        style={{ stroke: '#E9AF34', lineWidth: 3, lineDash: [10, 5] }}
      />
    </Chart>
  )
}
