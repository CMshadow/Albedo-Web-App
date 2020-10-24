import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Typography } from 'antd'
import { Chart, Interval, Axis, Tooltip, Legend } from 'bizcharts';
import { createDateSource } from '../../utils/createGainData'
import { MoneyText } from '../../utils/genMoneyText'
import { titleStyle, legendStyle } from '../../styles.config'
const Title = Typography.Title

export const CashFlowChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = createDateSource(reportData[buildingID]).map((record, index) => ({
    year: index,
    value: record['acc-net-cash-flow-togrid'],
    type: t('cashflowChart.togrid')
  })).concat(
    createDateSource(reportData[buildingID]).map((record, index) => ({
      year: index,
      value: record['acc-net-cash-flow-selfuse'],
      type: t('cashflowChart.selfuse')
    }))
  )

  const scale = {
    year: {
      type: 'cat',
      alias: t('cashflowChart.year'),
      tickCount: 25,
    },
    value: {
      type: 'linear',
      alias: t('cashflowChart.gain'),
      tickCount: 10,
      nice: true,
      formatter: text => MoneyText({t: t, money: text, abbr: true})
    },
  }

  const adjust = [{
    type: 'dodge',
    marginRatio: 0,
  }]

  const color = ['type', ['#1890ff', '#faad14']]

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('cashflowChart.title')}
        </Title>
      }
      hoverable
      style={{cursor: 'unset'}}
    >
      <Chart
        scale={scale}
        height={500}
        autoFit
        data={dataSource}
        interactions={['active-region']}
        padding={[30, 30, 100, 100]}
      >
        <Legend position='bottom' itemName={{style: legendStyle}} offsetY={-10}/>
        <Axis name='year' title={{style: titleStyle}} />
        <Axis name='value' title={{style: titleStyle}} />
        <Interval adjust={adjust} color={color} position="year*value" />
        <Tooltip shared />
      </Chart>
    </Card>
  )
}
