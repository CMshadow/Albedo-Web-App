import React from 'react'
import { Table, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
const Title = Typography.Title

export const WeatherAnalysisTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].weatherAnalysis.map((monthData, index) => ({
    month: index + 1,
    ...monthData
  }))
  const ttl = reportData[buildingID].weatherAnalysis.reduce((acc, monthData) =>({
    GHI: acc.GHI + monthData.GHI,
    DHI: acc.DHI + monthData.DHI,
    DNI: acc.DNI + monthData.DNI,
    Wspd: acc.Wspd + monthData.Wspd,
    DryBulb: acc.DryBulb + monthData.DryBulb,
  }), {GHI: 0, DHI: 0, DNI: 0, Wspd: 0, DryBulb: 0})
  dataSource.push({
    month: 'annual',
    ...ttl,
    Wspd: ttl.Wspd / 12,
    DryBulb: ttl.DryBulb / 12
  })

  const columns = [
    {
      key: 0,
      title: t('weatherAnalysisTable.month'),
      dataIndex: 'month',
      align: 'center',
      render: text => t(`weatherAnalysisTable.month.${text}`)
    },{
      key: 1,
      title: t('weatherAnalysisTable.GHI'),
      dataIndex: 'GHI',
      align: 'center',
      render: text => `${(text / 1000).toFixed(2)} kWh/㎡`
    }, {
      key: 2,
      title: t('weatherAnalysisTable.DNI'),
      dataIndex: 'DNI',
      align: 'center',
      render: text => `${(text / 1000).toFixed(2)} kWh/㎡`
    }, {
      key: 3,
      title: t('weatherAnalysisTable.DHI'),
      dataIndex: 'DHI',
      align: 'center',
      render: text => `${(text / 1000).toFixed(2)} kWh/㎡`
    }, {
      key: 4,
      title: t('weatherAnalysisTable.DryBulb'),
      dataIndex: 'DryBulb',
      align: 'center',
      render: text => `${text.toFixed(2)} °C`
    }, {
      key: 5,
      title: t('weatherAnalysisTable.Wspd'),
      dataIndex: 'Wspd',
      align: 'center',
      render: text => `${text.toFixed(2)} m/s`
    }
  ];

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('weatherAnalysisTable.title')}
        </Title>
      }
      hoverable
      style={{cursor: 'unset'}}
    >
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey='month'
        size='middle'
      />
    </Card>
  )
}
