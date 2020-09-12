import React from "react";
import { useTranslation } from "react-i18next";
import { Chart, Axis, Tooltip, Line } from 'bizcharts';
import { titleStyle } from '../../styles.config'

export const PVChart = ({ dataSource }) => {
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
    power: {
      type: 'linear',
      alias: t('pvChart.power'),
      formatter: text => `${text.toFixed(2)} W`,
      // tickInterval: 1,
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
      <Axis name='power' title={{style: titleStyle}} />
      <Line shape="smooth" position="voltage*power" color="irr"/>
    </Chart>
  );
};
