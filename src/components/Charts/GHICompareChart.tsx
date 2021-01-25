import React from 'react'
import { Chart, Axis, Interval, Tooltip } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'

type MonthlyProductionChartProps = {
  scale: {
    [field: string]: ScaleOption
  }
  dataSource: { month: number; src: string; value: number }[]
}

export const GHICompareChart: React.FC<MonthlyProductionChartProps> = props => {
  const { scale, dataSource } = props

  return (
    <Chart
      scale={scale}
      padding='auto'
      autoFit
      height={500}
      data={dataSource}
      interactions={['active-region']}
    >
      <Axis name='month' title={{ style: titleStyle }} />
      <Axis name='value' title={{ style: titleStyle }} />
      <Interval
        position='month*value'
        color={[
          'src',
          (val: string) => {
            if (val === 'meteonorm') return '#E9AF34'
            if (val === 'nasa') return '#DC3329'
            if (val === 'custom') return '#1890ff'
            return '#d9d9d9'
          },
        ]}
        adjust={[
          {
            type: 'dodge',
            dodgeBy: 'src',
            marginRatio: 0,
          },
        ]}
      />
      <Tooltip shared />
    </Chart>
  )
}
