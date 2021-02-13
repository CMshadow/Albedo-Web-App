import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin, Tabs, Table } from 'antd'
import { WeatherPortfolio } from '../../@types'
import { GHICompareChart } from '../../components/Charts/GHICompareChart'
import { allSrcMonthGHI } from '../../services'
import { wh2kwh } from '../../utils/unitConverter'

const { TabPane } = Tabs

type GHIVizProps = {
  portfolio: WeatherPortfolio
  extraChartData: { month: number; src: string; value: number }[]
  extraTableData: Record<string, number[]>
}

export const GHIViz: React.FC<GHIVizProps> = props => {
  const { portfolio, extraChartData, extraTableData } = props
  const { t } = useTranslation()
  const [loading, setloading] = useState(false)
  const [tableData, settableData] = useState<Record<string, number[]>>({})
  const [chartData, setchartData] = useState<{ month: number; src: string; value: number }[]>([])

  useEffect(() => {
    setloading(true)
    allSrcMonthGHI({ portfolioID: portfolio.portfolioID })
      .then(res => {
        setloading(false)
        setchartData(
          Object.keys(res).flatMap(key =>
            res[key].map((val, i) => ({ month: i, src: key, value: val }))
          )
        )
        settableData(res)
      })
      .catch(() => {
        setloading(false)
      })
  }, [portfolio])

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined />}>
      <Tabs centered animated={false}>
        <TabPane tab={t('chart')} key='1' forceRender>
          <GHICompareChart
            dataSource={[...chartData, ...extraChartData]}
            scale={{
              month: {
                type: 'cat',
                alias: t('weatherAnalysisTable.month'),
                tickCount: 12,
                formatter: (text: number) => t(`weatherAnalysisTable.month.${text + 1}`),
              },
              src: {
                formatter: (text: string) =>
                  ['meteonorm', 'nasa', 'custom', 'average'].includes(text)
                    ? t(`weatherManager.portfolio.${text}`)
                    : text,
              },
              value: {
                type: 'linear',
                alias: t('GHICompareChart.GHI'),
                tickCount: 10,
                nice: true,
                formatter: (text: number) => `${Number(wh2kwh(text).toString()).toFixed(2)} kWh/㎡`,
              },
            }}
          />
        </TabPane>
        <TabPane tab={t('table')} key='2' forceRender>
          <Table
            columns={[
              {
                title: t('weatherAnalysisTable.month'),
                dataIndex: 'month',
                key: 'month',
                render: (text: number) => t(`weatherAnalysisTable.month.${text + 1}`),
              },
              ...Object.keys({ ...tableData, ...extraTableData }).map(key => ({
                title: t(`weatherManager.portfolio.${key}`),
                dataIndex: key,
                key: key,
                render: (text: number) => `${Number(wh2kwh(text).toString()).toFixed(2)} kWh/㎡`,
              })),
            ]}
            dataSource={Array(12)
              .fill(0)
              .map((_, i) => i)
              .map(i => {
                const entry: { month: number; key: number; [key: string]: number } = {
                  month: i,
                  key: i,
                }
                Object.keys(tableData).forEach(key => (entry[key] = tableData[key][i]))
                Object.keys(extraTableData).forEach(key => (entry[key] = extraTableData[key][i]))
                return entry
              })}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </Spin>
  )
}
