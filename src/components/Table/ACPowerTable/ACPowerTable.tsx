import React from 'react'
import { Table, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { other2wh, wh2other } from '../../../utils/unitConverter'
import styles from './ACPowerTable.module.scss'
import { RootState } from '../../../@types'
import { ColumnsType } from 'antd/es/table/interface'
const { Title, Text } = Typography

type DataRecord = {
  key: number
  year: string
  dcpower: number
  dcunit: string
  acpower: number
  acunit: string
  kwhOverKwp: number
}

export const ACPowerTable: React.FC<{ buildingID: string }> = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector((state: RootState) => state.report)

  const dataSource: DataRecord[] = reportData[buildingID].year25_AC_power.map((record, index) => {
    const dcData = reportData[buildingID].year25_DC_power[index]
    return {
      key: index,
      year: t('acPowerTable.year.prefix') + `${index + 1}` + t('acPowerTable.year.suffix'),
      dcpower: Number(dcData.value.toFixed(2)),
      dcunit: dcData.unit,
      acpower: Number(record.value.toFixed(2)),
      acunit: record.unit,
      kwhOverKwp: Number(reportData[buildingID].year25_kWh_over_kWp[index].toFixed(0)),
    }
  })

  const columns: ColumnsType<DataRecord> = [
    {
      key: 0,
      title: t('acPowerTable.year'),
      dataIndex: 'year',
      align: 'center',
    },
    {
      key: 1,
      title: t('acPowerTable.dcpower'),
      dataIndex: 'dcpower',
      align: 'center',
      render: (text, record) => (text ? `${text} ${record.dcunit}` : '-'),
    },
    {
      key: 2,
      title: t('acPowerTable.acpower'),
      dataIndex: 'acpower',
      align: 'center',
      render: (text, record) => `${text} ${record.acunit}`,
    },
    {
      key: 3,
      title: t('acPowerTable.kwh_over_kwp'),
      dataIndex: 'kwhOverKwp',
      align: 'center',
      render: text => `${text} ${t('acPowerTable.unit.h')}`,
    },
  ]

  // 生成表单统计数据
  const genSummary = (dataSource: readonly DataRecord[]): React.ReactNode => {
    const ttlACPower = wh2other(
      dataSource.reduce(
        (sum, record) => sum + (other2wh(record.acpower, record.acunit) as number),
        0
      )
    ) as { value: number; unit: string }
    const ttlDCPower = wh2other(
      dataSource.reduce(
        (sum, record) => sum + (other2wh(record.dcpower, record.dcunit) as number),
        0
      )
    ) as { value: number; unit: string }
    const avgACPower = wh2other(other2wh(ttlACPower.value / 25, ttlACPower.unit)) as {
      value: number
      unit: string
    }
    const avgDCPower = wh2other(other2wh(ttlDCPower.value / 25, ttlDCPower.unit)) as {
      value: number
      unit: string
    }
    const ttlKwhOverWkp = dataSource.reduce((sum, record) => sum + record.kwhOverKwp, 0)
    return (
      <>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell index={0}>
            <Text strong>{t('acPowerTable.totalACPower')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            {ttlDCPower ? (
              <Text strong>
                {Number(ttlDCPower.value.toFixed(2))} {ttlDCPower.unit}
              </Text>
            ) : (
              <Text strong>-</Text>
            )}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <Text strong>
              {Number(ttlACPower.value.toFixed(2))} {ttlACPower.unit}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} />
        </Table.Summary.Row>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell index={4}>
            <Text strong>{t('acPowerTable.avgACPower')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            {avgDCPower ? (
              <Text strong>
                {Number(avgDCPower.value.toFixed(2))} {avgDCPower.unit}
              </Text>
            ) : (
              <Text strong>-</Text>
            )}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            <Text strong>
              {Number(avgACPower.value.toFixed(2))} {avgACPower.unit}
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7} />
        </Table.Summary.Row>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell index={8}>
            <Text strong>{t('acPowerTable.avgKwhOverKwp')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={9} />
          <Table.Summary.Cell index={10}>
            <Text strong>
              {Number((ttlKwhOverWkp / 25).toFixed(0))} {t('acPowerTable.unit.h')}
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('acPowerTable.title')}
        </Title>
      }
      hoverable
      className={styles.card}
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
