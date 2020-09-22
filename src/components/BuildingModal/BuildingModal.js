import React, { useEffect } from 'react'
import { Modal, Input, Form, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addBuilding, editBuilding } from '../../store/action/index';
import { other2m, m2other } from '../../utils/unitConverter'
const FormItem = Form.Item;

export const BuildingModal = ({showModal, setshowModal, editRecord, seteditRecord}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  // modal被关闭后回调
  const onClose = () => {
    form.resetFields();
    seteditRecord(null);
  }

  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form.validateFields()
    .then(success => {
      form.submit()
    })
    .catch(err => {
      form.scrollToField(err.errorFields[0].name[0])
      return
    })
  }

  const handleCancel = () => {
    setshowModal(false)
  }

  const submitForm = (values) => {
    values.combibox_cable_len = other2m(unit, values.combibox_cable_len)
    if (editRecord) {
      dispatch(editBuilding({buildingID: editRecord.buildingID, ...values}))
    } else {
      dispatch(addBuilding(values, t))
    }
    setshowModal(false)
  }

  // 组件渲染后加载表单初始值
  useEffect(() => {
    const defaultValues = {...editRecord}
    defaultValues.combibox_cable_len = m2other(unit, defaultValues.combibox_cable_len) || null
    form.setFieldsValue(defaultValues || null)
  }, [editRecord, form, unit])

  return (
    <Modal
      visible={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      title={t('project.add.building')}
      afterClose={onClose}
    >
      <Form
        colon={false}
        form={form}
        hideRequiredMark
        name="buildingName"
        scrollToFirstError
        validateMessages={validateMessages}
        onFinish={submitForm}
      >
        <FormItem
          name='buildingName'
          label={t('project.add.buildingName')}
          rules={[{required: true}]}
        >
          <Input />
        </FormItem>
        <FormItem
          name='combibox_cable_len'
          label={t('project.add.combibox_cable_len')}
          rules={[{required: true}]}
        >
          <InputNumber
            formatter={value => `${value}${unit}`}
            parser={value => value.replace(unit, '')}
            precision={2}
            min={0}
            style={{width: '100%'}}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}
