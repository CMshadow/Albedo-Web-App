import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, Row, Divider, Typography, Space, Radio, Spin, Card, Select } from 'antd'
import moment, { Moment } from 'moment'
import { getIrradianceData } from '../../services'
import { wh2other, w2other } from '../../utils/unitConverter'
import { getLanguage } from '../../utils/getLanguage'
import { Params, RootState } from '../../@types'
import { DayIrrChart } from './DayIrrChart'
import { MonthIrrChart } from './MonthIrrChart'
const { Title, Text } = Typography
const { Option } = Select

const meteonormYear = 2005

const disabledDate = (date: Moment) => {
  return date.year() < meteonormYear || date.year() > meteonormYear
}

export const DynamicIrradianceChart: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)
  const reportData = useSelector((state: RootState) => state.report)
  const { projectID, buildingID } = useParams<Params>()
  const [mode, setmode] = useState<'month' | 'day'>('month')
  const [date, setdate] = useState(moment())
  const [loading, setloading] = useState(false)
  const [dataSource, setdataSource] = useState<{ date: string; value: number }[]>([])
  const [unit, setunit] = useState<string>()
  const [selSpecIndex, setselSpecIndex] = useState(0)

  let uniqueTiltAzimuth = '[]'
  if (buildingID === 'overview') {
    uniqueTiltAzimuth = JSON.stringify(
      projectData?.buildings.flatMap(building =>
        building.data.flatMap(setup => ({
          tilt: setup.pv_panel_parameters.tilt_angle,
          azimuth: setup.pv_panel_parameters.azimuth,
        }))
      )
    )
  } else {
    const matchBuilding = projectData?.buildings.find(
      building => building.buildingID === buildingID
    )
    if (matchBuilding) {
      uniqueTiltAzimuth = JSON.stringify(
        matchBuilding.data.map(setup => ({
          tilt: setup.pv_panel_parameters.tilt_angle,
          azimuth: setup.pv_panel_parameters.azimuth,
        }))
      )
    }
  }

  let allUniqueSetupAndIndex: { setupIndex: number; elem: React.ReactNode }[] = []
  if (buildingID) {
    const stringifySetupMonthIrr = reportData[buildingID].setup_month_irr.map(ary =>
      JSON.stringify(ary)
    )
    const uniqueSetupMonthIrr = [...Array.from(new Set(stringifySetupMonthIrr))].map(str =>
      JSON.parse(str)
    )
    allUniqueSetupAndIndex = uniqueSetupMonthIrr.map(setup => {
      const setupIndex = stringifySetupMonthIrr.indexOf(JSON.stringify(setup))
      return {
        setupIndex: setupIndex,
        elem: (
          <Space>
            {`${t('irrTable.tilt')}: ${JSON.parse(uniqueTiltAzimuth)[setupIndex].tilt}°`}
            {`${t('irrTable.azimuth')}: ${JSON.parse(uniqueTiltAzimuth)[setupIndex].azimuth}°`}
          </Space>
        ),
      }
    })
  }

  let dateFormat: string
  let monthFormat: string
  if (getLanguage() === 'zh-CN') {
    dateFormat = 'YYYY/MM/DD'
    monthFormat = 'YYYY/MM'
  } else {
    dateFormat = 'MM/DD/YYYY'
    monthFormat = 'MM/YYYY'
  }

  useEffect(() => {
    if (!buildingID) return
    const month = date.month() + 1
    const day = mode === 'day' ? date.date() : 0
    setloading(true)
    getIrradianceData({
      projectID,
      buildingID,
      month,
      day,
      tilt: JSON.parse(uniqueTiltAzimuth)[selSpecIndex].tilt,
      azimuth: JSON.parse(uniqueTiltAzimuth)[selSpecIndex].azimuth,
    }).then(res => {
      const irr_res =
        mode === 'day'
          ? (w2other(res) as { value: number[]; unit: string })
          : (wh2other(res) as { value: number[]; unit: string }) // 月用wh日用w
      setunit(irr_res.unit)
      const irr_data = irr_res.value.map((val, index) => ({
        date: `${index + 1}`,
        value: val,
      }))
      setdataSource(irr_data)
      setloading(false)
    })
  }, [mode, dispatch, selSpecIndex, date, projectID, buildingID, uniqueTiltAzimuth])

  const scale = {
    date: {
      type: mode === 'month' ? ('cat' as const) : ('linear' as const),
      alias: mode === 'month' ? t('productionChart.day') : t('productionChart.hour'),
      tickCount: dataSource.length,
    },
    value: {
      type: 'linear' as const,
      alias: t('irrChart.irr'),
      tickCount: 10,
      formatter: (text: number) => `${text.toFixed(2)} ${unit}/㎡`,
      nice: true,
    },
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('dynamicIrrChart.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <Row justify='center'>
        <Space>
          <Text strong>{t('irrChart.selectspec')}</Text>
          <Select defaultValue={selSpecIndex} onChange={val => setselSpecIndex(val)}>
            {allUniqueSetupAndIndex.map(obj => (
              <Option key={obj.setupIndex} value={obj.setupIndex}>
                {obj.elem}
              </Option>
            ))}
          </Select>
          <Divider type='vertical' />
          <Text strong>{t('productionChart.selectdate')}</Text>
          <Radio.Group onChange={e => setmode(e.target.value)} value={mode}>
            <Radio value='month'>{t('productionChart.monthStatics')}</Radio>
            <Radio value='day'>{t('productionChart.dayStatics')}</Radio>
          </Radio.Group>
          <DatePicker
            defaultValue={moment(
              `${meteonormYear}-${moment().month() + 1}-${moment().date()}`,
              'YYYY-MM-DD'
            )}
            disabledDate={disabledDate}
            format={mode === 'month' ? monthFormat : dateFormat}
            picker={mode === 'month' ? 'month' : 'date'}
            onChange={date => (date ? setdate(date) : null)}
          />
        </Space>
      </Row>
      <Divider />
      <Spin spinning={loading}>
        {mode === 'day' ? (
          <DayIrrChart scale={scale} dataSource={dataSource} />
        ) : (
          <MonthIrrChart scale={scale} dataSource={dataSource} />
        )}
      </Spin>
    </Card>
  )
}
