import React from 'react'
import { Chart, Axis, Interval, Tooltip } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type GHIOriginVSFixedBarChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { year: number; ghi: number; src: 'origin' | 'fixed' }[]
}

export const GHIOriginVSFixedBarChart: React.FC<GHIOriginVSFixedBarChartProps> = ({
  scale,
  dataSource,
}) => {
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
      <Tooltip shared />
      <Axis name='year' title={{ style: titleStyle }} />
      <Axis name='ghi' title={{ style: titleStyle }} />
      <Interval
        adjust={{ type: 'dodge', marginRatio: 0 }}
        position='year*ghi'
        color={['src', ['#1890ff', '#E9AF34']]}
      />
    </Chart>
  )
}
