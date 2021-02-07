import React from 'react'
import { useTranslation } from 'react-i18next'
import { Chart, Axis, Interval, Tooltip, Annotation } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
import { ScaleOption } from 'bizcharts/lib/interface'
import { wh2kwh } from '../../utils/unitConverter'

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
  const { t } = useTranslation()
  const origin = dataSource.filter(v => v.src === 'origin')
  const originAvg = origin.reduce((sum, v) => sum + v.ghi, 0) / origin.length
  const fixed = dataSource.filter(v => v.src === 'fixed')
  const fixedAvg = fixed.reduce((sum, v) => sum + v.ghi, 0) / origin.length

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
      <Annotation.Text
        position={['5%', '5%']}
        content={`${t('weatherManager.portfolio.intermediate.src.origin-avg')}: ${Number(
          wh2kwh(originAvg).toString()
        ).toFixed(2)} kWh/㎡\n${t('weatherManager.portfolio.intermediate.src.fixed-avg')}: ${Number(
          wh2kwh(fixedAvg).toString()
        ).toFixed(2)} kWh/㎡`}
        style={{ fontSize: 16, fill: '#f759ab' }}
      />
    </Chart>
  )
}
