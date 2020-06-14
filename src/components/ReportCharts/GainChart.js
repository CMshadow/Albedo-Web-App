import React from "react";
import { Chart, Interval, Tooltip, Axis, Coordinate, Interaction, Annotation, Legend } from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import { money2Other } from '../../utils/unitConverter'
import { createDateSource } from '../../utils/createGainData'
import { fontFamily } from '../../styles.config'

export const GainChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const toGridCashIn = createDateSource(reportData[buildingID]).slice(1,)
    .map((record, index) => ({
      year: index + 1,
      type: t('cashflowChart.togrid'),
      value: record['cash-in-flow-togrid'] / 1000,
    }))
  const toGridCashOut = createDateSource(reportData[buildingID]).slice(1,)
    .map((record, index) => ({
        year: index + 1,
        type: t('cashflowChart.togrid'),
        value: -record['cash-out-flow-togrid']/ 1000,
      }))
  const selfUseCashIn = createDateSource(reportData[buildingID]).slice(1,)
    .map((record, index) => ({
        year: index + 1,
        type: t('cashflowChart.selfuse'),
        value: record['cash-in-flow-selfuse']/ 1000,
      }))
  const selfUseCashOut = createDateSource(reportData[buildingID]).slice(1,)
    .map((record, index) => ({
        year: index + 1,
        type: t('cashflowChart.selfuse'),
        value: -record['cash-out-flow-selfuse']/ 1000,
      }))
  const dataSource = toGridCashIn.concat(toGridCashOut).concat(selfUseCashIn).concat(selfUseCashOut)

  const adjust = [{
    type: 'dodge',
    dodgeBy: 'type',
    marginRatio: 0,
  }]

  const scale = {
    type: {
      type: 'cat'
    },
    year: {
      type: 'cat'
    }
  }

  return (
    <Chart scale={scale} height={800} padding="auto" data={dataSource} autoFit>
      <Axis name="year" title={null} labelOffset={10} />
      <Axis name="value"
        title={null}
        tickLine={null}
        position="right"
        formatter={function (val) {
          return val + "%";
        }}
      />
      <Coordinate transpose />
      <Tooltip shared />
      <Legend />
      <Interval
        adjust={adjust}
        position="year*value"
        color='type'
        shape="smooth"
        opacity={0.8}
      />
    </Chart>
  );
}
