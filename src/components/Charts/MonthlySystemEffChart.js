import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Typography } from 'antd'
import { Chart, Interval, Axis, Tooltip } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
const Title = Typography.Title

export const MonthlySystemEffChart = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].p_loss_system_monthly.map((loss, index) => ({
    month: t(`acPowerChart.month.${index + 1}`),
    value: 1 - loss,
  }))

  const minSysEff =
    1 -
    reportData[buildingID].p_loss_system_monthly.reduce(
      (max, val) => (max > val ? max : val),
      -Infinity
    )

  const scale = {
    month: {
      type: 'cat',
      alias: t('acPowerChart.month'),
      tickCount: 12,
    },
    value: {
      alias: t('systemEfficiencyChart.name'),
      min: Number((minSysEff * 0.95).toFixed(2)), // y轴最小值是最低系统效率的95%
      tickCount: 10,
      formatter: text => `${(text * 100).toFixed(2)} %`,
      nice: true,
    },
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('monthlySystemEfficiencyChart.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <Chart
        scale={scale}
        height={500}
        autoFit
        data={dataSource}
        interactions={['active-region']}
        padding='auto'
      >
        <Axis name='month' title={{ style: titleStyle }} />
        <Axis name='value' title={{ style: titleStyle }} />
        <Interval color='#1890ff' position='month*value' />
        <Tooltip shared />
      </Chart>
    </Card>
  )
}
