import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, Row, Divider, Typography, Space, Radio, Spin, Card, Select } from 'antd'
import moment from 'moment';
import { Chart, Axis, Line, Point, Interval } from 'bizcharts';
import { titleStyle } from '../../styles.config'
import { getIrradianceData } from '../../pages/Report/service'
import { wh2other, w2other } from '../../utils/unitConverter'
import { getLanguage } from '../../utils/getLanguage'
const { Title, Text } = Typography
const { Option } = Select;

const meteonormYear = 2005

const disabledDate = (date) => {
  return date.year() < meteonormYear || date.year() > meteonormYear
}

export const DynamicIrradianceChart = () => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const dispatch = useDispatch()
  const { projectID, buildingID } = useParams()
  const [mode, setmode] = useState('month')
  const [date, setdate] = useState(moment())
  const [loading, setloading] = useState(false)
  const [dataSource, setdataSource] = useState([])
  const [unit, setunit] = useState('')
  const [selSpecIndex, setselSpecIndex] = useState(0)

  const uniqueTiltAzimuth = 
    buildingID === 'overview' ?
    JSON.stringify(projectData.buildings.flatMap(building => 
      building.data.flatMap(setup => ({
        tilt: setup.pv_panel_parameters.tilt_angle,
        azimuth: setup.pv_panel_parameters.azimuth,
      }))
    )) :
    JSON.stringify(projectData.buildings.find(building => building.buildingID === buildingID)
    .data.map(setup => ({
      tilt: setup.pv_panel_parameters.tilt_angle,
      azimuth: setup.pv_panel_parameters.azimuth,
    })))

  const stringifySetupMonthIrr = reportData[buildingID].setup_month_irr.map(JSON.stringify)
  const uniqueSetupMonthIrr = [...new Set(stringifySetupMonthIrr)].map(JSON.parse)
  const allUniqueSetupAndIndex = uniqueSetupMonthIrr.map(setup => {
    const setupIndex = stringifySetupMonthIrr.indexOf(JSON.stringify(setup))
    return ({
      setupIndex: setupIndex,
      elem: (
        <Space>
          {`${t('irrTable.tilt')}: ${JSON.parse(uniqueTiltAzimuth)[setupIndex].tilt}°`}
          {`${t('irrTable.azimuth')}: ${JSON.parse(uniqueTiltAzimuth)[setupIndex].azimuth}°`}
        </Space>
      )
    })
  })

  let dateFormat
  let monthFormat
  if (getLanguage === 'zh-CN') {
    dateFormat = 'YYYY/MM/DD'
    monthFormat = 'YYYY/MM'
  } else {
    dateFormat = 'MM/DD/YYYY'
    monthFormat = 'MM/YYYY'
  }

  useEffect(() => {
    const month = date.month() + 1
    const day = mode === 'day' ? date.date() : null
    setloading(true)
    dispatch(getIrradianceData({
      projectID, buildingID, month, day,
      tilt: JSON.parse(uniqueTiltAzimuth)[selSpecIndex].tilt,
      azimuth: JSON.parse(uniqueTiltAzimuth)[selSpecIndex].azimuth,
    }))
    .then(res => {
      const irr_res = mode === 'day' ? w2other(res) : wh2other(res) // 月用wh日用w
      setunit(irr_res.unit)
      const irr_data = irr_res.value.map((val,index) => ({
        date: `${index + 1}`,
        value: val
      }))
      setdataSource(irr_data)
      setloading(false)
    })
  }, [mode, dispatch, selSpecIndex, date, projectID, buildingID, uniqueTiltAzimuth])

  const scale = {
    date: {
      type: mode === 'month' ? 'cat' : 'linear',
      alias: mode === 'month' ? t('productionChart.day') : t('productionChart.hour'),
      tickCount: dataSource.length,
    },
    value: {
      type: 'linear',
      alias: t('irrChart.irr'),
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${unit}/㎡`,
      nice: true
    },
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('dynamicIrrChart.title')}
        </Title>
      }
      hoverable
      style={{cursor: 'unset'}}
    >
      <Row justify='center'>
        <Space>
          <Text strong>{t('irrChart.selectspec')}</Text>
          <Select defaultValue={selSpecIndex} onChange={val => setselSpecIndex(val)}>
            {
              allUniqueSetupAndIndex.map(obj =>
                <Option key={obj.setupIndex} value={obj.setupIndex}>{obj.elem}</Option>
              )
            }
          </Select>
          <Divider type='vertical' />
          <Text strong>{t('productionChart.selectdate')}</Text>
          <Radio.Group onChange={e => {
            setmode(e.target.value)
          }} value={mode}>
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
            picker={mode === 'month' ? "month" : 'date'}
            onChange={date => date ? setdate(date) : null}
          />
        </Space>
      </Row>
      <Divider />
      <Spin spinning={loading}>
        <Chart
          scale={scale}
          padding={[30, 30, 100, 100]}
          autoFit
          height={500}
          data={dataSource}
          interactions={['active-region']}
        >
          <Axis name='date' title={{style: titleStyle}} />
          <Axis name='value' title={{style: titleStyle}} />
          {
            mode === 'day' ?
            [
              <Line key='line' color='#1890ff' shape="smooth" position="date*value" />,
              <Point key='point' position="date*value"/>
            ]:
            <Interval color='#1890ff' position="date*value" />
          }
        </Chart>
      </Spin>
    </Card>
  )
}
