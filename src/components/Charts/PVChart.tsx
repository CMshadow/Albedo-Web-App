import React from 'react'
import { useTranslation } from 'react-i18next'
import { Chart, Axis, Line } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'

type PVChartProps = { dataSource: { voltage: number; power: number; irr: string }[] }

export const PVChart: React.FC<PVChartProps> = ({ dataSource }) => {
  const { t } = useTranslation()

  const scale = {
    irr: {
      formatter: (text: number) => `${text} W/㎡`,
    },
    voltage: {
      type: 'linear',
      alias: t('ivChart.voltage'),
      formatter: (text: number) => `${text.toFixed(2)} V`,
    },
    power: {
      type: 'linear',
      alias: t('pvChart.power'),
      formatter: (text: number) => `${text.toFixed(2)} W`,
      nice: true,
    },
  }

  return (
    <Chart scale={scale} padding={[30, 30, 100, 100]} autoFit height={500} data={dataSource}>
      <Axis name='voltage' title={{ style: titleStyle }} />
      <Axis name='power' title={{ style: titleStyle }} />
      <Line shape='smooth' position='voltage*power' color='irr' />
    </Chart>
  )
}
