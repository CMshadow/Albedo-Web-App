import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Row, Col, Select, InputNumber, Form, Tooltip, Typography } from 'antd'
const FormItem = Form.Item;
const { Option, OptGroup } = Select
const {Text} = Typography

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};

export const CellTempModel = ({form, pvID, initModel}) => {
  const { t } = useTranslation()
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const [celltempModel, setcelltempModel] = useState(initModel ? initModel.split(',')[0] : '')
  const [customParams, setcustomParams] = useState(false)
  const pvModuleMaterial = pvID ?
    pvData.find(pv => pv.pvID === pvID).moduleMaterial : ''

  const modelDefaultParams = {
    'sandia,glass/cell/glass,open-rack': {a: -3.47, b: -0.0594, dtc: 3},
    'sandia,glass/cell/glass,insulated-back': {a: -2.98, b: -0.0471, dtc: 1},
    'sandia,glass/cell/polymer-sheet,open-rack': {a: -3.56, b: -0.0750, dtc: 3},
    'sandia,glass/cell/polymer-sheet,insulated-back': {a: -2.81, b: -0.0455, dtc: 0},
    'sandia,polymer/thin-film/steel,open-rack': {a: -3.58, b: -0.113, dtc: 3},
    'pvsyst,open-rack': {uc: 29, uv: 0, v: 1},
    'pvsyst,insulated-back': {uc: 15, uv: 0, v: 1}
  }

  const sandiaCelltempParamField = (
    <>
      <Col md={12} lg={8}>
        <FormItem name='a' rules={[{required: true}]}
          label={
            <Tooltip title={t('project.spec.celltemp_a.help')}>
              a <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <InputNumber disabled={!customParams}/>
        </FormItem>
      </Col>
      <Col md={12} lg={8}>
        <FormItem name='b' rules={[{required: true}]}
          label={
            <Tooltip title={t('project.spec.celltemp_b.help')}>
              b <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <InputNumber disabled={!customParams}/>
        </FormItem>
      </Col>
      <Col md={12} lg={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_dtc.help')}>
              ΔT <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='dtc' rules={[{required: true}]} noStyle>
            <InputNumber disabled={!customParams}/>
          </FormItem>
          <Text> ℃</Text>
        </FormItem>
      </Col>
    </>
  )

  const pvsystCelltempParamField = (
    <>
      <Col lg={12} xl={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_uc.help')}>
              Uc <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='uc' rules={[{required: true}]} noStyle>
            <InputNumber disabled={!customParams}/>
          </FormItem>
          <Text> W/㎡⋅k</Text>
        </FormItem>
      </Col>
      <Col lg={12} xl={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_uv.help')}>
              Uv <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='uv' rules={[{required: true}]} noStyle>
            <InputNumber disabled={!customParams}/>
          </FormItem>
          <Text> W/㎡⋅k / m/s</Text>
        </FormItem>
      </Col>
      <Col lg={12} xl={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_v.help')}>
              v <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='v' rules={[{required: true}]} noStyle>
            <InputNumber disabled={!customParams}/>
          </FormItem>
          <Text> m/s</Text>
        </FormItem>
      </Col>
    </>
  )

  return (
    <>
      <Row gutter={rowGutter}>
        <Col sm={24} md={24} lg={24} xl={12}>
          <FormItem
            name='celltemp_model'
            label={null}
            rules={[{required: true}]}
          >
            <Select
              onSelect={value => {
                const model = value.split(',')[0]
                const mode = value.split(',')[1]
                if (mode === 'custom') {
                  setcelltempModel(model)
                  setcustomParams(true)
                  model === 'sandia' ?
                  form.setFieldsValue({a: 0, b: 0, dtc: 0}) :
                  form.setFieldsValue({uc: 0, uv: 0, v: 0})
                } else {
                  setcelltempModel(model)
                  setcustomParams(false)
                  form.setFieldsValue(modelDefaultParams[value])
                }
              }}
            >
              <OptGroup label={t('project.spec.celltemp_sandia')}>
                <Option
                  value='sandia,glass/cell/glass,open-rack'
                  title={`${t('PV.glass/cell/glass')}, ${t('project.spec.mount.open-rack')}`}
                  disabled={pvModuleMaterial !== 'glass/cell/glass'}
                >
                  {t('PV.glass/cell/glass')}, {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value='sandia,glass/cell/glass,insulated-back'
                  title={`${t('PV.glass/cell/glass')}, ${t('project.spec.mount.insulated-back')}`}
                  disabled={pvModuleMaterial !== 'glass/cell/glass'}
                >
                  {t('PV.glass/cell/glass')}, {t('project.spec.mount.insulated-back')}
                </Option>
                <Option
                  value='sandia,glass/cell/polymer-sheet,open-rack'
                  title={`${t('PV.glass/cell/polymer-sheet')}, ${t('project.spec.mount.open-rack')}`}
                  disabled={pvModuleMaterial !== 'glass/cell/polymer-sheet'}
                >
                  {t('PV.glass/cell/polymer-sheet')}, {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value='sandia,glass/cell/polymer-sheet,insulated-back'
                  title={`${t('PV.glass/cell/polymer-sheet')}, ${t('project.spec.mount.insulated-back')}`}
                  disabled={pvModuleMaterial !== 'glass/cell/polymer-sheet'}
                >
                  {t('PV.glass/cell/polymer-sheet')}, {t('project.spec.mount.insulated-back')}
                </Option>
                <Option
                  value='sandia,polymer/thin-film/steel,open-rack'
                  title={`${t('PV.polymer/thin-film/steel')}, ${t('project.spec.mount.open-rack')}`}
                  disabled={pvModuleMaterial !== 'polymer/thin-film/steel'}
                >
                  {t('PV.polymer/thin-film/steel')}, {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value='sandia,custom'
                  title={t('project.spec.custom')}
                >
                  {t('project.spec.custom')}
                </Option>
              </OptGroup>
              <OptGroup label={t('project.spec.celltemp_pvsyst')}>
                <Option
                  value={'pvsyst,open-rack'}
                  title={t('project.spec.mount.open-rack')}
                >
                  {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value={'pvsyst,insulated-back'}
                  title={t('project.spec.mount.insulated-back')}
                >
                  {t('project.spec.mount.insulated-back')}
                </Option>
                <Option
                  value='pvsyst,custom'
                  title={t('project.spec.custom')}
                >
                  {t('project.spec.custom')}
                </Option>
              </OptGroup>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        {
          celltempModel === 'pvsyst' ?
          pvsystCelltempParamField :
          sandiaCelltempParamField
        }
      </Row>
    </>
  )
}
