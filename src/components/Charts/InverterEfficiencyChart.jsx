import React from "react";
import { useTranslation } from "react-i18next";
import { Chart, Axis, Line } from 'bizcharts';
import { titleStyle } from '../../styles/chartStyles'

export const InverterEfficiencyChart = ({ dataSource }) => {
  const { t } = useTranslation();

  const scale = {
    pac_percent: {
      type: 'linear',
      tickCount: 10,
      alias: t('InverterEfficiencyChart.pac_percent'),
      formatter: text => `${(text * 100).toFixed(2)} %`
    },
    eff: {
      type: 'linear',
      alias: t('InverterEfficiencyChart.eff'),
      formatter: text => `${(text * 100).toFixed(2)} %`,
      nice: true,
      tickCount: 10,
      min: 0.9,
      max: 1
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
      <Axis name='pac_percent' title={{style: titleStyle}} />
      <Axis name='eff' title={{style: titleStyle}} />
      <Line shape='smooth' position="pac_percent*eff" color="vdc"/>
    </Chart>
  );
};
