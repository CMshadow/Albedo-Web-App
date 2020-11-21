import React from 'react'
import { Table, Card, Typography, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import * as styles from './IrradianceTable.module.scss'
const Title = Typography.Title
const Text = Typography.Text

export const IrradianceTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
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
          .data.map(setup => ({
            tilt: setup.pv_panel_parameters.tilt_angle,
            azimuth: setup.pv_panel_parameters.azimuth,
          }))

  const stringifySetupMonthIrr = reportData[buildingID].setup_month_irr.map(JSON.stringify)
  const uniqueSetupMonthIrr = [...new Set(stringifySetupMonthIrr)].map(JSON.parse)

  const dataSource = uniqueSetupMonthIrr[0].map((irr, monthIndex) => {
    const record = {
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

  const columns = uniqueSetupMonthIrr.map(setup => {
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

  const genSummary = dataSource => {
    const setupIrrSum = {}
    const regex = RegExp(/setup\d+irr/)
    dataSource.forEach(record => {
      Object.keys(record).forEach(key => {
        if (regex.test(key)) {
          setupIrrSum[key] = Object.keys(setupIrrSum).includes(key)
            ? setupIrrSum[key] + record[key]
            : record[key]
        }
      })
    })
    return (
      <>
        <Table.Summary.Row className={styles.summaryRow}>
          <Table.Summary.Cell>
            <Text strong>{t('irrTable.irradianceYear')}</Text>
          </Table.Summary.Cell>
          {Object.keys(setupIrrSum).map(key => (
            <Table.Summary.Cell colSpan={2} key={key}>
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
