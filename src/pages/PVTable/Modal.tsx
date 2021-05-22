import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Divider,
  message,
  Collapse,
  Upload,
  Button,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import styles from './Modal.module.scss'
import { addPV, getPV, updatePV, parsePAN } from '../../services'
import { setPVData } from '../../store/action/index'
import { PV, PVPreUpload } from '../../@types'
import { UploadFile } from 'antd/lib/upload/interface'
const FormItem = Form.Item
const { Option } = Select
const { Panel } = Collapse

const labelCol = { span: 24 }
const wrapperCol = { span: 24 }

// PV表单默认值
const initValues = {
  siliconMaterial: 'mc-Si',
  moduleMaterial: 'glass/cell/glass',
  year1Decay: 2.5,
  year2To25Decay: 0.7,
  tenYDecay: Number((2.5 + 0.7 * 9).toFixed(2)),
  twentyfiveYDecay: Number((2.5 + 0.7 * 24).toFixed(2)),
}

type PVModalProps = {
  showModal: boolean
  setshowModal: React.Dispatch<React.SetStateAction<boolean>>
  editRecord: PV | null
  seteditRecord: React.Dispatch<React.SetStateAction<PV | null>>
}

type FormItemType = 's' | 'n' | 'c' | 'b'

export const PVModal: React.FC<PVModalProps> = props => {
  const { showModal, setshowModal, editRecord, seteditRecord } = props
  const { t } = useTranslation()
  const [loading, setloading] = useState(false)
  const [uploadFileList, setuploadFileList] = useState<UploadFile[]>([])
  const [optionIVData, setoptionIVData] = useState<{ [key: string]: [number, number][] }>()
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  // PV表单基本信息[key，类型，单位]
  const formBasicKeys: [keyof PVPreUpload, FormItemType, string][][] = [
    [
      ['name', 's', ''],
      ['note', 's', ''],
      ['panelWeight', 'n', 'kg'],
    ],
    [
      ['panelLength', 'n', 'mm'],
      ['panelWidth', 'n', 'mm'],
      ['panelHeight', 'n', 'mm'],
    ],
  ]
  // PV表单选择项[key，类型，可选项]
  const formSelectKeys: [keyof PVPreUpload, FormItemType, string | string[]][][] = [
    [
      ['siliconMaterial', 'c', ['mc-Si', 'c-Si']],
      [
        'moduleMaterial',
        'c',
        ['glass/cell/glass', 'glass/cell/polymer-sheet', 'polymer/thin-film/steel'],
      ],
    ],
  ]
  // PV表单进阶信息[key，类型，单位]
  const formAdvancedKeys: [keyof PVPreUpload, FormItemType, string][][] = [
    [
      ['pmax', 'n', 'Wp'],
      ['seriesCell', 'n', ''],
      ['parallelCell', 'n', ''],
    ],
    [
      ['vmpo', 'n', 'V'],
      ['voco', 'n', 'V'],
      ['betaVoco', 'n', '%/℃'],
    ],
    [
      ['impo', 'n', 'A'],
      ['isco', 'n', 'A'],
      ['alphaImp', 'n', '%/℃'],
    ],
    [
      ['ixo', 'n', 'A'],
      ['ixxo', 'n', 'A'],
      ['alphaIsc', 'n', '%/℃'],
    ],
    [
      ['t', 'n', '℃'],
      ['tPrime', 'n', '℃'],
      ['betaVmpo', 'n', '%/℃'],
    ],
    [
      ['tenYDecay', 'n', '%'],
      ['twentyfiveYDecay', 'n', '%'],
      ['gammaPmax', 'n', '%/℃'],
    ],
  ]
  // PV表单高级参数[key，类型，单位]
  const formProKeys: [keyof PVPreUpload, FormItemType, string][][] = [
    [
      ['year1Decay', 'n', '%'],
      ['year2To25Decay', 'n', '%'],
    ],
  ]

  // 根据 类型，单位/选择项 生成表单的用户输入组件
  const genFormItemInput = (type: FormItemType, unit: string | string[]) => {
    switch (type) {
      case 'c':
        return (
          <Select>
            {typeof unit === 'string' ? (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ) : (
              unit.map(choice => (
                <Option key={choice} value={choice}>
                  {t(`PV.${choice}`)}
                </Option>
              ))
            )}
          </Select>
        )
      case 'n':
        return <Input addonAfter={`${unit}`} type='number' className={styles.input} />
      case 's':
      default:
        return <Input />
    }
  }
  // 生成表单字段组件
  const genFormItems = (
    keys: [keyof PVPreUpload, FormItemType, string | string[]][][],
    itemsPerRow: number
  ) =>
    keys.map((keysInRow, index) => (
      <Row key={index}>
        {keysInRow.map(([key, type, unit]) => (
          <Col offset={1} span={24 / itemsPerRow - 1} key={key}>
            <FormItem
              valuePropName={type === 'b' ? 'checked' : 'value'}
              name={key}
              label={t(`PV.${key}`)}
              rules={type !== 'b' ? [{ required: true }] : undefined}
            >
              {genFormItemInput(type, unit)}
            </FormItem>
          </Col>
        ))}
      </Row>
    ))

  // modal被关闭后回调
  const onClose = () => {
    form.resetFields()
    seteditRecord(null)
  }

  // modal取消键onclick
  const handleCancel = () => {
    setshowModal(false)
  }

  // modal确认键onclick
  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(() => {
        setloading(true)
        form.submit()
      })
      .catch(err => {
        form.scrollToField(err.errorFields[0].name[0])
        return
      })
  }

  // 表单提交
  const submitForm = (values: Record<keyof PVPreUpload, unknown>) => {
    // 根据colKey的类型转换格式
    const allKeys = [
      ...formBasicKeys.flatMap(val => val),
      ...formSelectKeys.flatMap(val => val),
      ...formAdvancedKeys.flatMap(val => val),
      ...formProKeys.flatMap(val => val),
    ]
    allKeys.forEach(([key, type]) => {
      if (type === 'n') values[key] = Number(values[key])
      else if (type === 'b') {
        values[key] = values[key] ? true : false
      }
    })

    // 发送 创建/更新PV 后端请求
    let action: Promise<void | PV>
    if (editRecord) {
      action = updatePV({ pvID: editRecord.pvID, values: values as PVPreUpload })
    } else {
      action = addPV({ values: { ...values, singlediodeIVData: optionIVData } as PVPreUpload })
    }
    action
      .then(() => {
        getPV({}).then(data => {
          editRecord
            ? message.success(t('PV.success.updatePV'))
            : message.success(t('PV.success.createPV'))
          setloading(false)
          setshowModal(false)
          dispatch(setPVData(data))
        })
      })
      .catch(() => {
        setloading(false)
      })
  }

  const customRequest = (params: any) => {
    const reader = new FileReader()
    reader.readAsText(params.file)
    reader.onload = event => {
      if (!event.target || !event.target.result) {
        params.onError(Error('Failed to load File'))
        return
      }
      parsePAN({
        fileText: event.target.result,
        onUploadProgress: ({ total, loaded }) =>
          params.onProgress(
            {
              percent: Number(Math.round((loaded / total) * 100).toFixed(2)),
            },
            params.file
          ),
      })
        .then(res => {
          form.setFieldsValue(res)
          setoptionIVData(res.singlediodeIVData)
          params.onSuccess({}, params.file)
        })
        .catch(err => {
          params.onError(err)
        })
    }
    reader.onerror = () => {
      params.onError(Error('Failed to read file'))
      return
    }
  }

  // 组件渲染后加载表单初始值
  useEffect(() => {
    form.setFieldsValue(editRecord || initValues)
  }, [editRecord, form])

  return (
    <Modal
      title={editRecord ? t('PVtable.edit-PV') : t('PVtable.add-PV')}
      visible={showModal}
      forceRender
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      maskClosable={false}
      width={'90vw'}
      style={{ top: 20 }}
      afterClose={onClose}
    >
      <Form
        colon={false}
        preserve={false}
        form={form}
        className={styles.form}
        name='add-PV'
        scrollToFirstError
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        onFinish={submitForm}
      >
        {editRecord ? null : (
          <>
            <Row>
              <Col span={24}>
                <FormItem
                  label={t('PV.uploadpan')}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <Upload
                    accept='.pan'
                    fileList={uploadFileList}
                    customRequest={customRequest}
                    onChange={({ fileList }) => setuploadFileList(fileList.slice(-1))}
                  >
                    <Button icon={<UploadOutlined />}>{t('PV.uploadBut')} .pan</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Divider />
          </>
        )}
        {genFormItems(formBasicKeys, 3)}
        <Divider />
        {genFormItems(formSelectKeys, 2)}
        <Divider />
        {genFormItems(formAdvancedKeys, 3)}
        <Collapse bordered={false}>
          <Panel
            className={styles.collapsePanel}
            header={t('PVtable.proParams')}
            key='pro'
            forceRender
          >
            {genFormItems(formProKeys, 2)}
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  )
}
