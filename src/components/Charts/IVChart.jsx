import React from "react";
import { useTranslation } from "react-i18next";
import { Chart, Axis, Line } from 'bizcharts';
import { titleStyle } from '../../styles/chartStyles'

export const IVChart = ({ dataSource }) => {
  const { t } = useTranslation();

  const scale = {
    irr: {
      formatter: text => `${text} W/㎡`,
    },
    voltage: {
      type: 'linear',
      alias: t('ivChart.voltage'),
      formatter: text => `${text.toFixed(2)} V`
    },
    current: {
      type: 'linear',
      alias: t('ivChart.current'),
      formatter: text => `${text.toFixed(2)} A`,
      tickInterval: 1,
      nice: true
    },
  }

  return (
    <Chart
      scale={scale}
      padding={[30, 30, 100, 100]}
      autoFit
      height={500}
      data={dataSource}
    >
      <Axis name='voltage' title={{style: titleStyle}} />
      <Axis name='current' title={{style: titleStyle}} />
      <Line shape= 'smooth' position="voltage*current" color="irr"/>
    </Chart>
  );
};
