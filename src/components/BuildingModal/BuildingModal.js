import React, { useEffect } from 'react'
import { Modal, Input, Form, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addBuilding, editBuilding } from '../../store/action/index';
const FormItem = Form.Item;

export const BuildingModal = ({showModal, setshowModal, editRecord, seteditRecord}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

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
    if (editRecord) {
      dispatch(editBuilding({buildingID: editRecord.buildingID, ...values}))
    } else {
      dispatch(addBuilding(values))
    }
    setshowModal(false)
  }

  // 组件渲染后加载表单初始值
  useEffect(() => {
    form.setFieldsValue(editRecord || null)
  }, [editRecord, form])

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
            formatter={value => `${value}m`}
            parser={value => value.replace('m', '')}
            precision={2}
            min={0}
            style={{width: '100%'}}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}
