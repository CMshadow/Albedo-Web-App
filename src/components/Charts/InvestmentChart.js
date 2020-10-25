import React from "react";
import { Card, Typography } from 'antd'
import { Chart, Interval, Tooltip, Axis, Coordinate, Interaction, Annotation, Legend } from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import { MoneyText } from '../../utils/genMoneyText'
import { lgTextStyle, legendStyle } from '../../styles.config'
const Title = Typography.Title

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

  const scale = {
    value: {
      formatter: text => {
        return MoneyText({t:t, money: text, abbr:true})
      }
    }
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('investmentChart.title')}
        </Title>
      }
      hoverable
      style={{cursor: 'unset'}}
    >
      <Chart scale={scale} data={dataSource} height={500} autoFit >
        <Legend position="right" offsetX={-20} itemName={{style: legendStyle}}/>
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
          style={lgTextStyle}
        />
        <Annotation.Text
          position={['50%', '55%']}
          content={MoneyText({t: t, money: reportData[buildingID].ttl_investment, abbr:true})}
          style={lgTextStyle}
        />
      </Chart>
    </Card>
  );
}
