import React from 'react'
import { Table, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { other2wh, wh2other } from '../../../utils/unitConverter'
import * as styles from './ACPowerTable.module.scss'
const Title = Typography.Title
const Text = Typography.Text

export const ACPowerTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].year25_AC_power.map((record, index) => ({
    key: index,
    year: t('acPowerTable.year.prefix') + `${index + 1}` + t('acPowerTable.year.suffix'),
    unit: record.unit,
    acpower: Number(record.value.toFixed(2)),
    kwhOverKwp: Number(reportData[buildingID].year25_kWh_over_kWp[index].toFixed(0))
  }))

  const columns = [
    {
      key: 0,
      title: t('acPowerTable.year'),
      dataIndex: 'year',
      align: 'center',
    }, {
      key: 1,
      title: t('acPowerTable.unit'),
      dataIndex: 'unit',
      align: 'center',
    }, {
      key: 2,
      title: t('acPowerTable.prod'),
      dataIndex: 'acpower',
      align: 'center',
    }, {
      key: 3,
      title: t('acPowerTable.kwh_over_kwp'),
      dataIndex: 'kwhOverKwp',
      align: 'center',
    }
  ];

  // 生成表单统计数据
  const genSummary = dataSource => {
    const ttlACPower = wh2other(dataSource.reduce((sum, record) =>
      sum + other2wh(record.acpower, record.unit), 0
    ))
    const avgACPower = wh2other(other2wh(ttlACPower.value / 25, ttlACPower.unit))
    const ttlKwhOverWkp = dataSource.reduce((sum, record) =>
      sum + record.kwhOverKwp, 0
    )
    return (
      <>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell>
            <Text strong>{t('acPowerTable.totalACPower')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{ttlACPower.unit}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{Number(ttlACPower.value.toFixed(2))}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell>
            <Text strong>{t('acPowerTable.avgACPower')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{avgACPower.unit}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{Number(avgACPower.value.toFixed(2))}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell>
            <Text strong>{t('acPowerTable.avgKwhOverKwp')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{t('acPowerTable.unit.h')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{Number((ttlKwhOverWkp / 25).toFixed(0))}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('acPowerTable.title')}
        </Title>
      }
      hoverable
    >
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size='middle'
        summary={genSummary}
      />
    </Card>
  )
}
