import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Row, Col, Select, InputNumber, Form, Tooltip, Typography } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { RootState } from '../../../@types'
const FormItem = Form.Item
const { Option, OptGroup } = Select
const { Text } = Typography

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128 }

type CellTempModelProps = {
  form: FormInstance
  pvID: string | null | undefined
  initModel: string | null | undefined
}

type ModelOptions =
  | 'sandia,glass/cell/glass,open-rack'
  | 'sandia,glass/cell/glass,insulated-back'
  | 'sandia,glass/cell/polymer-sheet,open-rack'
  | 'sandia,glass/cell/polymer-sheet,insulated-back'
  | 'sandia,polymer/thin-film/steel,open-rack'
  | 'sandia,custom'
  | 'pvsyst,open-rack'
  | 'pvsyst,insulated-back'
  | 'pvsyst,custom'

export const CellTempModel: React.FC<CellTempModelProps> = ({ form, pvID, initModel }) => {
  const { t } = useTranslation()
  const pvData = useSelector((state: RootState) => state.pv.data).concat(
    useSelector((state: RootState) => state.pv.officialData)
  )
  const [celltempModel, setcelltempModel] = useState(initModel ? initModel.split(',')[0] : '')
  const [customParams, setcustomParams] = useState(false)
  const pvModuleMaterial = pvID ? pvData.find(pv => pv.pvID === pvID)?.moduleMaterial : ''

  const modelDefaultParams = {
    'sandia,glass/cell/glass,open-rack': { a: -3.47, b: -0.0594, dtc: 3 },
    'sandia,glass/cell/glass,insulated-back': { a: -2.98, b: -0.0471, dtc: 1 },
    'sandia,glass/cell/polymer-sheet,open-rack': { a: -3.56, b: -0.075, dtc: 3 },
    'sandia,glass/cell/polymer-sheet,insulated-back': { a: -2.81, b: -0.0455, dtc: 0 },
    'sandia,polymer/thin-film/steel,open-rack': { a: -3.58, b: -0.113, dtc: 3 },
    'pvsyst,open-rack': { uc: 29, uv: 0, v: 1 },
    'pvsyst,insulated-back': { uc: 15, uv: 0, v: 1 },
  }

  const sandiaCelltempParamField = (
    <>
      <Col md={24} lg={8}>
        <FormItem
          name='a'
          rules={[{ required: true }]}
          label={
            <Tooltip title={t('project.spec.celltemp_a.help')}>
              a <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <InputNumber disabled={!customParams} />
        </FormItem>
      </Col>
      <Col md={24} lg={8}>
        <FormItem
          name='b'
          rules={[{ required: true }]}
          label={
            <Tooltip title={t('project.spec.celltemp_b.help')}>
              b <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <InputNumber disabled={!customParams} />
        </FormItem>
      </Col>
      <Col md={24} lg={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_dtc.help')}>
              ΔT <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='dtc' rules={[{ required: true }]} noStyle>
            <InputNumber disabled={!customParams} />
          </FormItem>
          <Text> ℃</Text>
        </FormItem>
      </Col>
    </>
  )

  const pvsystCelltempParamField = (
    <>
      <Col lg={24} xl={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_uc.help')}>
              Uc <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='uc' rules={[{ required: true }]} noStyle>
            <InputNumber disabled={!customParams} />
          </FormItem>
          <Text> W/㎡⋅k</Text>
        </FormItem>
      </Col>
      <Col lg={24} xl={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_uv.help')}>
              Uv <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='uv' rules={[{ required: true }]} noStyle>
            <InputNumber disabled={!customParams} />
          </FormItem>
          <Text> W/㎡⋅k / m/s</Text>
        </FormItem>
      </Col>
      <Col lg={24} xl={8}>
        <FormItem
          label={
            <Tooltip title={t('project.spec.celltemp_v.help')}>
              v <QuestionCircleOutlined />
            </Tooltip>
          }
        >
          <FormItem name='v' rules={[{ required: true }]} noStyle>
            <InputNumber disabled={!customParams} />
          </FormItem>
          <Text> m/s</Text>
        </FormItem>
      </Col>
    </>
  )

  return (
    <>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <FormItem name='celltemp_model' label={null} rules={[{ required: true }]}>
            <Select
              onSelect={(value: ModelOptions) => {
                const model = value.split(',')[0]
                const mode = value.split(',')[1]
                if (mode === 'custom') {
                  setcelltempModel(model)
                  setcustomParams(true)
                  model === 'sandia'
                    ? form.setFieldsValue({ a: 0, b: 0, dtc: 0 })
                    : form.setFieldsValue({ uc: 0, uv: 0, v: 0 })
                } else {
                  setcelltempModel(model)
                  setcustomParams(false)
                  form.setFieldsValue(
                    modelDefaultParams[
                      value as Exclude<ModelOptions, 'sandia,custom' | 'pvsyst,custom'>
                    ]
                  )
                }
              }}
            >
              <OptGroup label={t('project.spec.celltemp_sandia')}>
                <Option
                  value='sandia,glass/cell/glass,open-rack'
                  title={`${t('PV.glass/cell/glass')}, ${t('project.spec.mount.open-rack')}`}
                  disabled={pvModuleMaterial !== 'glass/cell/glass'}
                >
                  {t('PV.sandia')}, {t('PV.glass/cell/glass')}, {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value='sandia,glass/cell/glass,insulated-back'
                  title={`${t('PV.glass/cell/glass')}, ${t('project.spec.mount.insulated-back')}`}
                  disabled={pvModuleMaterial !== 'glass/cell/glass'}
                >
                  {t('PV.sandia')}, {t('PV.glass/cell/glass')},{' '}
                  {t('project.spec.mount.insulated-back')}
                </Option>
                <Option
                  value='sandia,glass/cell/polymer-sheet,open-rack'
                  title={`${t('PV.glass/cell/polymer-sheet')}, ${t(
                    'project.spec.mount.open-rack'
                  )}`}
                  disabled={pvModuleMaterial !== 'glass/cell/polymer-sheet'}
                >
                  {t('PV.sandia')}, {t('PV.glass/cell/polymer-sheet')},{' '}
                  {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value='sandia,glass/cell/polymer-sheet,insulated-back'
                  title={`${t('PV.glass/cell/polymer-sheet')}, ${t(
                    'project.spec.mount.insulated-back'
                  )}`}
                  disabled={pvModuleMaterial !== 'glass/cell/polymer-sheet'}
                >
                  {t('PV.sandia')}, {t('PV.glass/cell/polymer-sheet')},{' '}
                  {t('project.spec.mount.insulated-back')}
                </Option>
                <Option
                  value='sandia,polymer/thin-film/steel,open-rack'
                  title={`${t('PV.polymer/thin-film/steel')}, ${t('project.spec.mount.open-rack')}`}
                  disabled={pvModuleMaterial !== 'polymer/thin-film/steel'}
                >
                  {t('PV.sandia')}, {t('PV.polymer/thin-film/steel')},{' '}
                  {t('project.spec.mount.open-rack')}
                </Option>
                <Option value='sandia,custom' title={t('project.spec.custom')}>
                  {t('PV.sandia')}, {t('project.spec.custom')}
                </Option>
              </OptGroup>
              <OptGroup label={t('project.spec.celltemp_pvsyst')}>
                <Option value={'pvsyst,open-rack'} title={t('project.spec.mount.open-rack')}>
                  {t('PV.pvsyst')}, {t('project.spec.mount.open-rack')}
                </Option>
                <Option
                  value={'pvsyst,insulated-back'}
                  title={t('project.spec.mount.insulated-back')}
                >
                  {t('PV.pvsyst')}, {t('project.spec.mount.insulated-back')}
                </Option>
                <Option value='pvsyst,custom' title={t('project.spec.custom')}>
                  {t('PV.pvsyst')}, {t('project.spec.custom')}
                </Option>
              </OptGroup>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>{celltempModel === 'pvsyst' ? pvsystCelltempParamField : sandiaCelltempParamField}</Row>
    </>
  )
}
