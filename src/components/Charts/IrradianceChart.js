import React, { useState } from 'react'
import { Space, Row, Typography, Select, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Chart, Interval, Axis, Tooltip } from 'bizcharts';
import { titleStyle } from '../../styles.config'
const Text = Typography.Text
const Title = Typography.Title
const { Option } = Select;

export const IrradianceChart = ({buildingID}) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const [selSpecIndex, setselSpecIndex] = useState(0)
  const curBuilding = projectData.buildings.find(building =>
    building.buildingID === buildingID
  )

  const stringifySetupMonthIrr = reportData[buildingID].setup_month_irr.map(JSON.stringify)
  const uniqueSetupMonthIrr = [...new Set(stringifySetupMonthIrr)].map(JSON.parse)
  const allSetup = uniqueSetupMonthIrr.map(setup => {
    const setupIndex = stringifySetupMonthIrr.indexOf(JSON.stringify(setup))
    return (
      <Space>
        {`${t('irrTable.tilt')}: ${curBuilding.data[setupIndex].pv_panel_parameters.tilt_angle}°`}
        {`${t('irrTable.azimuth')}: ${curBuilding.data[setupIndex].pv_panel_parameters.azimuth}°`}
      </Space>
    )
  })

  const dataSource = uniqueSetupMonthIrr.map(setup =>
    setup.map((val, index) => ({
      month: index,
      value: val
    }))
  )

  const scale = {
    month: {
      type: 'cat',
      alias: t('acPowerChart.month'),
      formatter: text => t(`acPowerChart.month.${text + 1}`),
      tickCount: 12,
    },
    value: {
      type: 'linear',
      alias: t('irrChart.irr'),
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} MJ/㎡`,
      nice: true
    },
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('irrChart.title')}
        </Title>
      }
      // bordered={false}
      hoverable
    >
      <Row justify='center'>
        <Space>
          <Text strong>{t('irrChart.selectspec')}</Text>
          <Select defaultValue={selSpecIndex} onChange={val => setselSpecIndex(val)}>
            {
              allSetup.map((spec, index) => <Option key={index} value={index}>{spec}</Option>)
            }
          </Select>
        </Space>
      </Row>
      <Chart
        scale={scale}
        height={500}
        autoFit
        data={dataSource[selSpecIndex]}
        interactions={['active-region']}
        padding={[20, 50, 100, 100]}
      >
        <Axis name='month' title={{style: titleStyle}} />
        <Axis name='value' title={{style: titleStyle}} />
        <Interval color='#1890ff' position="month*value" />
        <Tooltip shared />
      </Chart>
    </Card>
  )
}