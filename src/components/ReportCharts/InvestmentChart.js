import React from "react";
import { Chart, Interval, Tooltip, Axis, Coordinate, Interaction, Annotation, Legend } from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import { money2Other } from '../../utils/unitConverter'
import { fontFamily } from '../../global.config'

export const InvestmentChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].investment.filter(record =>
    record.investmentWeight
  ).map(record => ({
    item: record.name || record.description,
    value: record.totalPrice,
    percent: record.totalPrice / reportData[buildingID].ttl_investment
  }))
  const ttlInvestment = money2Other(reportData[buildingID].ttl_investment)

  return (
    <Chart data={dataSource} height={500} autoFit >
      <Legend position="right" />
      <Coordinate type="theta" radius={0.8} innerRadius={0.65} />
      <Axis visible={false} />
      <Tooltip showTitle={false} />
      <Interval
        adjust="stack"
        position="value"
        color="item"
        shape="sliceShape"
      />
      <Interaction type="element-single-selected" />
      <Annotation.Text
        position={['50%', '45%']}
        content={t('investment.name.totalInvestment')}
        style={{
          lineHeight: '240px',
          fontSize: '30',
          fill: '#262626',
          textAlign: 'center',
          fontFamily: fontFamily
        }}
      />
      <Annotation.Text
        position={['50%', '55%']}
        content={`${ttlInvestment.value.toFixed(2)} ${t(`money.${ttlInvestment.unit}`)}`}
        style={{
          lineHeight: '240px',
          fontSize: '30',
          fill: '#262626',
          textAlign: 'center',
          fontFamily: fontFamily
        }}
      />
    </Chart>
  );
}
