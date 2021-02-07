import React from 'react'
import { Table, Card, Typography, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styles from './IrradianceTable.module.scss'
import { RootState } from '../../../@types'
import { ColumnsType } from 'antd/lib/table'
const { Title, Text } = Typography

type DataRecord = { [key: string]: number | string }

export const IrradianceTable: React.FC<{ buildingID: string }> = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)
  const reportData = useSelector((state: RootState) => state.report)

  if (!projectData) return null

  const uniqueTiltAzimuth =
    buildingID === 'overview'
      ? projectData.buildings.flatMap(building =>
          building.data.flatMap(setup => ({
            tilt: setup.pv_panel_parameters.tilt_angle,
            azimuth: setup.pv_panel_parameters.azimuth,
          }))
        )
      : projectData.buildings
          .find(building => building.buildingID === buildingID)
          ?.data.map(setup => ({
            tilt: setup.pv_panel_parameters.tilt_angle,
            azimuth: setup.pv_panel_parameters.azimuth,
          })) || []

  const stringifySetupMonthIrr = reportData[buildingID].setup_month_irr.map(val =>
    JSON.stringify(val)
  )
  const uniqueSetupMonthIrr: number[][] = [
    ...Array.from(new Set(stringifySetupMonthIrr)),
  ].map(str => JSON.parse(str))

  const dataSource: DataRecord[] = uniqueSetupMonthIrr[0].map((irr, monthIndex) => {
    const record: DataRecord = {
      key: monthIndex,
      title: `${monthIndex + 1}${t('irrTable.month')}`,
    }
    uniqueSetupMonthIrr.forEach(setup => {
      const setupIndex = stringifySetupMonthIrr.indexOf(JSON.stringify(setup))
      record[`setup${setupIndex}irr`] = setup[monthIndex]
      record[`setup${setupIndex}avgPkHr`] =
        reportData[buildingID].setup_month_irr_avg_pk_hr[setupIndex][monthIndex]
    })
    return record
  })

  const columns: ColumnsType<DataRecord> = uniqueSetupMonthIrr.map(setup => {
    const setupIndex = stringifySetupMonthIrr.indexOf(JSON.stringify(setup))
    return {
      key: setupIndex + 1,
      title: (
        <Space size='large'>
          {`${t('irrTable.tilt')}: ${uniqueTiltAzimuth[setupIndex].tilt}°`}
          {`${t('irrTable.azimuth')}: ${uniqueTiltAzimuth[setupIndex].azimuth}°`}
        </Space>
      ),
      align: 'center',
      children: [
        {
          key: `${setupIndex + 1}.1`,
          title: t('irrTable.irradiance'),
          dataIndex: `setup${setupIndex}irr`,
          align: 'center',
          render: text => `${text.toFixed(2)} MJ/㎡`,
        },
        {
          key: `${setupIndex + 1}.2`,
          title: t('irrTable.avgPkHr'),
          dataIndex: `setup${setupIndex}avgPkHr`,
          align: 'center',
          render: text => `${text.toFixed(2)} h`,
        },
      ],
    }
  })

  columns.splice(0, 0, {
    key: 0,
    title: t('table.month'),
    dataIndex: 'title',
    align: 'center',
  })

  const genSummary = (dataSource: readonly DataRecord[]): React.ReactNode => {
    const setupIrrSum: { [key: string]: number } = {}
    const regex = RegExp(/setup\d+irr/)
    dataSource.forEach(record => {
      Object.keys(record).forEach(key => {
        if (regex.test(key)) {
          setupIrrSum[key] = Object.keys(setupIrrSum).includes(key)
            ? setupIrrSum[key] + Number(record[key])
            : Number(record[key])
        }
      })
    })
    return (
      <>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell index={1}>
            <Text strong>{t('irrTable.irradianceYear')}</Text>
          </Table.Summary.Cell>
          {Object.keys(setupIrrSum).map(key => (
            <Table.Summary.Cell colSpan={2} key={key} index={2}>
              <Text strong>{`${setupIrrSum[key].toFixed(2)} MJ/㎡`}</Text>
            </Table.Summary.Cell>
          ))}
        </Table.Summary.Row>
      </>
    )
  }

  return (
    <Card
      title={
        <Title className={styles.cardTitle} level={4}>
          {buildingID === 'overview'
            ? t('irrTable.title.commercial')
            : t('irrTable.title.domestic')}
        </Title>
      }
      headStyle={{ textAlign: 'center' }}
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
