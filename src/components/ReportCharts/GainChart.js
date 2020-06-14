import React from "react";
import { Chart, Interval, Tooltip, Axis, Coordinate, Interaction, Annotation, Legend } from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import { money2Other } from '../../utils/unitConverter'
import { createDateSource } from '../../utils/createGainData'
import { fontFamily } from '../../global.config'

export const GainChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = createDateSource(reportData[buildingID]).slice(1,).map((record, index) => ({
    year: index + 1,
    value: record['cash-in-flow-togrid'],
  })).concat(
    createDateSource(reportData[buildingID]).slice(1,).map((record, index) => ({
      year: index + 1,
      value: -record['cash-out-flow-togrid'],
    }))
  )
  console.log(dataSource)


  return (
    <Chart height={600} padding="auto" data={dataSource} autoFit>
      <Axis name="year" title={null} labelOffset={10} />
      <Axis
        name="value"
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
        position="year*value"
        color='value'
        shape="smooth"
        opacity={0.8}
      />
    </Chart>
  );
}
