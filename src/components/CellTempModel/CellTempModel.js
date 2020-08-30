import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import { Row, Col, Select, Space, InputNumber, Form } from 'antd'
const FormItem = Form.Item;
const { Option, OptGroup } = Select

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};

export const CellTempModel = ({form, pvID}) => {
  const { t } = useTranslation()
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const [celltempModel, setcelltempModel] = useState('')
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
    <Row gutter={rowGutter}>
      <Space size='large'>
        <Space size='middle'>
          <FormItem name='a' label='a' rules={[{required: true}]}>
            <InputNumber disabled={!customParams}/>
          </FormItem>
        </Space>
        <Space size='middle'>
          <FormItem name='b' label='b' rules={[{required: true}]}>
            <InputNumber disabled={!customParams}/>
          </FormItem>
        </Space>
        <Space size='middle'>
          <FormItem name='dtc' label='dtc' rules={[{required: true}]}>
            <InputNumber disabled={!customParams}/>
          </FormItem>
        </Space>
      </Space>
    </Row>
  )

  const pvsystCelltempParamField = (
    <Row gutter={rowGutter}>
      <Space size='large'>
        <Space size='middle'>
          <FormItem name='uc' label='Uc' rules={[{required: true}]}>
            <InputNumber disabled={!customParams}/>
          </FormItem>
        </Space>
        <Space size='middle'>
          <FormItem name='uv' label='Uv' rules={[{required: true}]}>
            <InputNumber disabled={!customParams}/>
          </FormItem>
        </Space>
        <Space size='middle'>
          <FormItem name='v' label='v' rules={[{required: true}]}>
            <InputNumber disabled={!customParams}/>
          </FormItem>
        </Space>
      </Space>
    </Row>
  )

  return (
    <Row gutter={rowGutter}>
      <Col span={12}>
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
      <Col span={12}>
        {
          celltempModel === 'pvsyst' ? 
          pvsystCelltempParamField : 
          sandiaCelltempParamField
        }
      </Col>
    </Row>
  )
}