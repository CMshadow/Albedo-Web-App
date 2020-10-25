import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Form, Input, Select, Checkbox, Row, Col, Modal, Divider, message, Collapse, Tooltip, Upload, Button } from 'antd';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import * as styles from './Modal.module.scss';
import { addInverter, getInverter, updateInverter, parseOND } from './service';
import { setInverterData } from '../../store/action/index'
import { getLanguage } from '../../utils/getLanguage';
const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;

const labelCol = { span: 24 };
const wrapperCol = { span: 24 };

// Inverter表单默认值
const initValues = {
  'c0': 0,
  'c1': 0,
  'c2': 0,
  'c3': 0,
  'radiator': 'forcedConvection'
}

export const InverterModal = ({showModal, setshowModal, setactiveData, editRecord, seteditRecord}) => {
  const { t } = useTranslation();
  const [loading, setloading] = useState(false);
  const [uploadFileList, setuploadFileList] = useState([])
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Inverter表单基本信息[key，类型，单位]
  const formBasicKeys = [
    [['name', 's', ''], ['note', 's', ''], ['inverterWeight', 'n', 'kg']],
    [['inverterLength', 'n', 'mm'], ['inverterWidth', 'n', 'mm'], ['inverterHeight', 'n', 'mm']],
  ]
  // Inverter表单进阶信息[key，类型，单位]
  const formAdvancedKeys = [
    [['vdcMin', 'n', 'V'], ['vdcMax', 'n', 'V'], ['vdco', 'n', 'V']],
    [['vac', 'n', 'V'], ['vmpptMin', 'n', 'V'], ['vmpptMax', 'n', 'V']],
    [['pdco', 'n', 'kWp'], ['paco', 'n', 'kWp'], ['pacMax', 'n', 'kVA']],
    [['vso', 'n', 'V'], ['pso', 'n', 'kWp'], ['pnt', 'n', 'W']],
    [['idcMax', 'n', 'A'], ['iacMax', 'n', 'A'], ['pdcMax', 'n', 'kWp']],
    [['mpptNum', 'n', ''], ['mpptIdcMax', 'n', 'A']],
    [['strNum', 'n', ''], ['strIdcMax', 'n', 'A']],

    [['inverterEffcy', 'n', '%'], ['nationEffcy', 'n', '%'], ['nominalPwrFac', 'n', 'cosφ']],
    [['acFreqMin', 'n', 'Hz'], ['acFreqMax', 'n', 'Hz'], ['THDi', 'n', '%']],
    [['workingTempMin', 'n', '℃'], ['workingTempMax', 'n', '℃'], ['workingAltMax', 'n', 'm']],
    [['protectLvl', 's', ''], ['commProtocal', 's', ''], ['radiator', 'c', ['forcedConvection', 'naturalConvection']]],
  ]
  // Inverter表单勾选信息[key，类型，可选项]
  const formBoolKeys = [
    [['grdTrblDetect', 'b', ''], ['overloadProtect', 'b', ''], ['revPolarityProtect', 'b', ''], ['overvoltageProtect', 'b', '']],
    [['shortCircuitProtect', 'b', ''], ['antiIslandProtect', 'b', ''], ['overheatProtect', 'b', '']]
  ]
  // Inverter表单高级参数[key，类型，可选项，有提示文本]
  const formProKeys = [
    [
      ['c0', 'n', '1/W', 'description'], ['c1', 'n', '1/V', 'description'], 
      ['c2', 'n', '1/V', 'description'], ['c3', 'n', '1/V', 'description']
    ],
  ]

  // 根据 类型，单位/选择项 生成表单的用户输入组件
  const genFormItemInput = (type, unit) => {
    switch (type) {
      case 'b': return (
        <Checkbox />
      )
      case 'c': return (
        <Select>
        {
          unit.map(choice =>
            <Option key={choice} value={choice}>{t(`Inverter.${choice}`)}</Option>
          )
        }
        </Select>
      )
      case 'n': return (
        <Input addonAfter={`${unit}`} type='number' className={styles.input} />
      )
      case 's':
      default: return (
        <Input />
      )
    }
  }

  //根据 类型，是否有提示文本生成表单字段的不同label
  const genFormItemLabel = (key, note) => {
    if (!note) {
      return t(`Inverter.${key}`)
    } else {
      return (
        <div>
          {t(`Inverter.${key}`)}
          <Tooltip title={t(`Inverter.${key}.${note}`)}>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    }
  }

  // 生成表单字段组件
  const genFormItems = (keys, itemsPerRow) => keys.map((keysInRow, index) =>
    <Row key={index}>
      {keysInRow.map(([key, type, unit, note]) =>
        <Col offset={1} span={ 24 / itemsPerRow - 1 } key={key}>
          <FormItem
            valuePropName={ type === 'b' ? 'checked' : 'value'}
            name={key}
            label={
              key === 'nationEffcy' ?
              t(`${getLanguage()}`) + genFormItemLabel(key, note) :
              genFormItemLabel(key, note)
            }
            rules={ type !== 'b' ? [{required: true}] : null }
          >
            { genFormItemInput(type, unit) }
          </FormItem>
        </Col>
      )}
    </Row>
  )

  const uploadOND = params => {
    const reader = new FileReader()
    reader.readAsText(params.file)
    reader.onload = event => {
      dispatch(
        parseOND(event.target.result, {
          onUploadProgress: ({total, loaded}) => 
            params.onProgress(() => ({
              percent: Math.round(loaded / total * 100).toFixed(2)
            }))
        })
      )
      .then(res => {
        form.setFieldsValue(res)
        params.onSuccess('success message')
      }).catch(err => {
        params.onError(err);
      })
    }
    reader.onerror = err => {
      params.onError(err)
    }
  }

  // modal被关闭后回调
  const onClose = () => {
    form.resetFields();
    seteditRecord(null);
  }

  // modal取消键onclick
  const handleCancel = () => {
    setshowModal(false);
  };

  // modal确认键onclick
  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form.validateFields()
    .then(success => {
      setloading(true);
      form.submit()
    })
    .catch(err => {
      form.scrollToField(err.errorFields[0].name[0])
      return
    })
  }

  // 表单提交
  const submitForm = (values) => {
    // 根据colKey的类型转换格式
    [].concat(...formBasicKeys).concat([].concat(...formAdvancedKeys))
    .concat([].concat(...formBoolKeys)).concat([].concat(...formProKeys))
    .forEach(([key, type,]) => {
      if (type === 'n') values[key] = Number(values[key])
      else if (type === 'b') {
        values[key] = values[key] ? true : false
      }
    })

    // 发送 创建/更新Inverter 后端请求
    let action;
    if (editRecord) {
      action = dispatch(updateInverter({inverterID: editRecord.inverterID, values: values}))
    } else {
      action = dispatch(addInverter({values}))
    }
    action.then(() => {
      dispatch(getInverter()).then(data => {
        setloading(false)
        setshowModal(false)
        editRecord ?
        message.success(t('Inverter.success.updateInverter')) :
        message.success(t('Inverter.success.createInverter'))
        dispatch(setInverterData(data))
        setactiveData(data)
      })
    }).catch(err => {
      setloading(false)
    })
  }

  // 组件渲染后加载表单初始值
  useEffect(() => {
    form.setFieldsValue(editRecord || initValues)
  }, [editRecord, form])

  return (
    <Modal
      title={
        editRecord ?
        t('InverterTable.edit-Inverter') :
        t('InverterTable.add-Inverter')
      }
      visible={showModal}
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
        form={form}
        className={styles.form}
        name="Inverter"
        scrollToFirstError
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        onFinish={submitForm}
      >
        {
          editRecord ? null :
          <>
            <Row>
              <Col span={24}>
                <FormItem 
                  label={ t('PV.uploadond') }
                  labelCol={{  span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <Upload 
                    accept='.ond'
                    fileList={uploadFileList}
                    customRequest={uploadOND}
                    onChange={({fileList}) => setuploadFileList(fileList.slice(-1,))}
                  >
                    <Button icon={<UploadOutlined/>}>{t('PV.uploadBut')} .ond</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Divider/>
          </>
        }
        {genFormItems(formBasicKeys, 3)}
        <Divider />
        {genFormItems(formAdvancedKeys, 3)}
        <Divider />
        {genFormItems(formBoolKeys, 4)}
        <Divider />
        <Collapse bordered={false}>
          <Panel
            className={styles.collapsePanel}
            header={t('InverterTable.proParams')}
            key="pro"
            forceRender
          >
            {genFormItems(formProKeys, 4)}
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  )
}
