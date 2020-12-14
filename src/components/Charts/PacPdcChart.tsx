import React from 'react'
import { useTranslation } from 'react-i18next'
import { Chart, Axis, Line } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'

type PacPdcChartProps = {
  dataSource: { pdc: number; pac: number; vdc: string }[]
}

export const PacPdcChart: React.FC<PacPdcChartProps> = ({ dataSource }) => {
  const { t } = useTranslation()

  const scale = {
    pdc: {
      type: 'linear',
      alias: t('PacPdcChart.pdc'),
      formatter: (text: number) => `${(text / 1000).toFixed(2)} kW`,
    },
    pac: {
      type: 'linear',
      alias: t('PacPdcChart.pac'),
      formatter: (text: number) => `${(text / 1000).toFixed(2)} kW`,
      nice: true,
    },
  }

  return (
    <Chart scale={scale} padding={[30, 30, 100, 100]} autoFit height={500} data={dataSource}>
      <Axis name='pdc' title={{ style: titleStyle }} />
      <Axis name='pac' title={{ style: titleStyle }} />
      <Line shape='smooth' position='pdc*pac' color='vdc' />
    </Chart>
  )
}
