import React from 'react'
import { Modal, Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addBuilding } from '../../store/action/index';
const FormItem = Form.Item;

export const BuildingNameModal = ({showModal, setshowModal}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

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
    dispatch(addBuilding(values.buildingName))
    setshowModal(false)
  }

  return (
    <Modal
      visible={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      title={t('project.add.building')}
      afterClose={form.resetFields}
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
      </Form>
    </Modal>
  )
}
