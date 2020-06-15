import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker, Row, Divider, Typography, Space, Radio } from 'antd'
import moment from 'moment';
import { Chart, Interval, Axis, Tooltip, Line, Point } from 'bizcharts';
import { titleStyle } from '../../styles.config'
import { getProductionData } from '../../pages/Report/service'

const Text = Typography.Text
const dateFormat = 'YYYY/MM/DD'
const monthFormat = 'YYYY/MM'

export const ProductionChart = ({buildingID}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const reportData = useSelector(state => state.report)
  const projectID = history.location.pathname.split('/')[2]
  const [mode, setmode] = useState('month')
  const [date, setdate] = useState(moment())
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    const month = date.month() + 1
    const day = mode === 'day' ? date.date() : null
    dispatch(getProductionData({projectID, buildingID, month, day, dataKey: 'hour_AC_power'}))
    .then(res => {
      const ac_data = res.map((val,index) => ({
        date: index + 1,
        value: val,
        type: 'ac'
      }))
      if (mode === 'day') {
        dispatch(getProductionData({projectID, buildingID, month, day, dataKey: 'hour_DC_power'}))
        .then(res2 => {
          const dc_data = res2.map((val,index) => ({
            date: index + 1,
            value: val,
            type: 'dc'
          }))
          setdataSource(ac_data.concat(dc_data))
        })
      } else {
        setdataSource(ac_data)
      }
    })
  }, [buildingID, date, dispatch, mode, projectID])

  const scale = {
    month: {
      type: 'cat',
      alias: t('acPowerChart.month'),
      tickCount: 12,
    },
    value: {
      alias: t('acPowerChart.production'),
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${reportData[buildingID].month_AC_power.unit}`,
      nice: true
    },
  }

  return (
    <>
      <Row justify='center'>
        <Space>
          <Text strong>{t('productionChart.selectdate')}</Text>
          <Radio.Group onChange={e => {
            setmode(e.target.value)
          }} value={mode}>
            <Radio value='month'>{t('productionChart.month')}</Radio>
            <Radio value='day'>{t('productionChart.day')}</Radio>
          </Radio.Group>
          <DatePicker
            defaultValue={moment()}
            format={mode === 'month' ? monthFormat : dateFormat}
            picker={mode === 'month' ? "month" : 'date'}
            onChange={date => setdate(date)}
          />
        </Space>
      </Row>
      <Divider />
      <Chart padding={[10,20,50,40]} autoFit height={500} data={dataSource} >
        <Line shape="smooth" position="date*value" color="type" />
        <Point position="date*value" color="type" />
      </Chart>
    </>
  )
}
