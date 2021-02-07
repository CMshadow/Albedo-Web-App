import React, { useState } from 'react'
import { Divider, Row, Input, Button, Col, Form } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { titleStyle } from '../../styles/chartStyles'
import ReactEcharts from 'echarts-for-react'
import { EChartOption } from 'echarts'
import { RootState } from '../../@types'
import { autoHorizon } from '../../services'

type HorizonChartProps = { data: [number, number][]; setdata: (d: [number, number][]) => void }

export const HorizonChart: React.FC<HorizonChartProps> = ({ data, setdata }) => {
  const { t } = useTranslation()
  const unit = useSelector((state: RootState) => state.unit.unit)
  const projectData = useSelector((state: RootState) => state.project)
  const [r, setr] = useState<number>()
  const [rOffset, setrOffset] = useState<number>()
  const [rStep, setrStep] = useState<number>()
  const [loading, setloading] = useState(false)

  const symbolSize = 20

  const option: EChartOption = {
    tooltip: {
      triggerOn: 'none',
      position: 'left',
      formatter: params => {
        const param = Array.isArray(params) ? params[0] : params
        return (
          `${t('horizonChart.azi')}: ` +
          param.data[0].toFixed(2) +
          `<br/>${t('horizonChart.elev')}: ` +
          param.data[1].toFixed(2)
        )
      },
    },
    grid: { top: '5%' },
    xAxis: {
      name: t('horizonChart.azi'),
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 25,
      min: 0,
      max: 360,
      splitNumber: 12,
      type: 'value',
      axisLine: { onZero: false },
      axisLabel: { formatter: '{value}°' },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      name: t('horizonChart.elev'),
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 35,
      min: 0,
      max: 90,
      splitNumber: 10,
      type: 'value',
      axisLine: { onZero: false, show: false },
      axisLabel: { formatter: '{value}°' },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbolSize: symbolSize,
        data: data,
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' },
      },
    ],
  }

  return (
    <>
      <Divider>{t('horizonChart.title')}</Divider>

      <Form
        colon={false}
        onFinish={values => {
          setloading(true)
          autoHorizon({
            r: unit === 'm' ? values.r : 0.621371 * Number(values.r),
            rOffset: unit === 'm' ? values.rOffset : 0.621371 * Number(values.rOffset),
            rStep: unit === 'm' ? values.rStep : 0.621371 * Number(values.rStep),
            lon: projectData?.projectLon ?? 0,
            lat: projectData?.projectLat ?? 0,
            ele: projectData?.projectAltitude ?? 0,
          })
            .then(res => {
              setloading(false)
              setdata(res.elevation.map((val, i) => [(i + 1) * 15, val]))
            })
            .catch(() => setloading(false))
        }}
      >
        <Row justify='center' gutter={20}>
          <Col span={8}>
            <Form.Item
              name='r'
              label={t('project.autoHorizon.r')}
              rules={[
                {
                  type: 'number',
                  min: 1,
                  max: 100,
                  message: `${t('project.autoHorizon.error.notInRange')} 0 - 100`,
                  transform: v => Number(v),
                },
              ]}
            >
              <Input
                type='number'
                suffix={unit === 'm' ? 'km' : 'mile'}
                placeholder={t('project.autoHorizon.r.placeholder')}
                onChange={e => setr(Number(e.target.value))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='rOffset'
              label={t('project.autoHorizon.rOffset')}
              dependencies={['r']}
              rules={[
                {
                  type: 'number',
                  min: 0,
                  max: r,
                  message: `${t('project.autoHorizon.error.notInRange')} 0 - ${r}`,
                  transform: v => Number(v),
                },
              ]}
            >
              <Input
                type='number'
                suffix={unit === 'm' ? 'km' : 'mile'}
                placeholder={t('project.autoHorizon.rOffset.placeholder')}
                onChange={e => setrOffset(Number(e.target.value))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='rStep'
              label={t('project.autoHorizon.rStep')}
              dependencies={['r', 'rOffset']}
              rules={[
                {
                  type: 'number',
                  min: r !== undefined && rOffset !== undefined ? (r - rOffset) / 250 : 0,
                  max: r !== undefined && rOffset !== undefined ? r - rOffset : 0,
                  message: `${t('project.autoHorizon.error.notInRange')} ${
                    r !== undefined && rOffset !== undefined ? (r - rOffset) / 250 : 0
                  } - ${r !== undefined && rOffset !== undefined ? r - rOffset : 0}`,
                  transform: v => Number(v),
                },
              ]}
            >
              <Input
                type='number'
                disabled={r === undefined || rOffset === undefined}
                suffix={unit === 'm' ? 'km' : 'mile'}
                placeholder={t('project.autoHorizon.rStep.placeholder')}
                onChange={e => setrStep(Number(e.target.value))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Button
            htmlType='submit'
            disabled={r === undefined || rOffset === undefined || rStep === undefined}
            loading={loading}
          >
            {t('project.autoHorizon.gen')}
          </Button>
        </Row>
      </Form>

      <ReactEcharts
        option={option}
        style={{ height: '600px', width: '100%' }}
        onChartReady={instance =>
          instance.setOption({
            graphic: data.map((item, index) => ({
              type: 'circle',
              shape: {
                r: symbolSize / 2,
              },
              position: instance.convertToPixel('grid', item),
              draggable: true,
              invisible: true,
              z: 100,
              ondrag: (e: { target: { position: [number, number] } }) => {
                data[index] = [
                  data[index][0],
                  instance.convertFromPixel('grid', e.target.position)[1] > 90
                    ? 90
                    : instance.convertFromPixel('grid', e.target.position)[1] < 0
                    ? 0
                    : instance.convertFromPixel('grid', e.target.position)[1],
                ]
                instance.setOption({
                  series: [{ data: data }],
                  graphic: data.map(item => ({
                    position: instance.convertToPixel('grid', item),
                  })),
                })
                instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: index })
              },
              onmousemove: () =>
                instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: index }),
              onmouseout: () => instance.dispatchAction({ type: 'hideTip' }),
            })),
          })
        }
      />
    </>
  )
}
