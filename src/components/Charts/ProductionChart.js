import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { DatePicker, Row, Divider, Typography, Space, Radio, Spin, Card } from 'antd'
import moment from 'moment';
import { Chart, Legend, Axis, Line, Point, Interval } from 'bizcharts';
import { titleStyle, legendStyle } from '../../styles.config'
import { getProductionData } from '../../pages/Report/service'
import { wh2other, w2other } from '../../utils/unitConverter'
import { getLanguage } from '../../utils/getLanguage'
const Title = Typography.Title
const Text = Typography.Text

const meteonormYear = 2005

const disabledDate = (date) => {
  return date.year() < meteonormYear || date.year() > meteonormYear
}

export const ProductionChart = ({buildingID}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const projectID = history.location.pathname.split('/')[2]
  const [mode, setmode] = useState('month')
  const [date, setdate] = useState(moment())
  const [loading, setloading] = useState(false)
  const [dataSource, setdataSource] = useState([])
  const [unit, setunit] = useState('')

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
    dispatch(getProductionData({projectID, buildingID, month, day, dataKey: 'hour_AC_power'}))
    .then(res => {
      const ac_res = day ? w2other(res) : wh2other(res) // 月用wh日用w
      setunit(ac_res.unit)
      const ac_data = ac_res.value.map((val,index) => ({
        date: `${index + 1}`,
        value: val,
        type: t('lossChart.ac')
      }))
      if (mode === 'day') {
        dispatch(getProductionData({projectID, buildingID, month, day, dataKey: 'hour_DC_power'}))
        .then(res2 => {
          const dc_res = wh2other(res2)
          const dc_data = dc_res.value.map((val,index) => ({
            date: `${index + 1}`,
            value: val,
            type: t('lossChart.dc')
          }))
          setdataSource(ac_data.concat(dc_data))
          setloading(false)
        })
      } else {
        setdataSource(ac_data)
        setloading(false)
      }
    })
  }, [buildingID, date, dispatch, mode, projectID, t])

  const scale = {
    date: {
      type: mode === 'month' ? 'cat' : 'linear',
      alias: mode === 'month' ? t('productionChart.day') : t('productionChart.hour'),
      tickCount: mode === 'month' ? dataSource.length : dataSource.length / 2
    },
    value: {
      type: 'linear',
      alias: t('acPowerChart.production'),
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${unit}`,
      nice: true
    },
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('productionChart.title')}
        </Title>
      }
      hoverable
    >
      <Row justify='center'>
        <Space>
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
          <Legend visible={mode === 'day'} position='bottom' itemName={{style: legendStyle}} offsetY={-10}/>
          <Axis name='date' title={{style: titleStyle}} />
          <Axis name='value' title={{style: titleStyle}} />
          {
            mode === 'day' ?
            [
              <Line shape="smooth" position="date*value" color={["type", ['#1890ff', '#faad14']]} />,
              <Point position="date*value" color={["type", ['#1890ff', '#faad14']]} />
            ]:
            <Interval position="date*value" color={["type", ['#1890ff', '#faad14']]}/>
          }
        </Chart>
      </Spin>
    </Card>
  )
}