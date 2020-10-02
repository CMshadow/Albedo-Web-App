import React, { useEffect } from 'react'
import { Modal, Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addBuilding, editBuilding } from '../../store/action/index';
import { other2m } from '../../utils/unitConverter'
const FormItem = Form.Item;

export const BuildingModal = ({showModal, setshowModal, editRecord, seteditRecord}) => {
  const { t } = useTranslation()
  const projectType = useSelector(state => state.project.projectType)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

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
    form.setFieldsValue(editRecord || null)
  }, [editRecord, form])

  const titleText = () =>
    projectType === 'domestic' ? t('project.add.building') : t('project.add.unit')

  const buildingNameText = () =>
    projectType === 'domestic' ? t('project.add.buildingName') : t('project.add.unitName')

  const combibox_cable_lenText = () =>
    projectType === 'domestic' ? t('project.add.combibox_cable_len') : t('project.add.combibox_cable_avg_len')

  return (
    <Modal
      forceRender
      visible={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      title={titleText()}
      afterClose={onClose}
    >
      <Form
        colon={false}
        form={form}
        hideRequiredMark
        name="buildingName"
        scrollToFirstError
        onFinish={submitForm}
      >
        <FormItem
          name='buildingName'
          label={buildingNameText()}
          rules={[{required: true}]}
        >
          <Input />
        </FormItem>
        <FormItem
          name='combibox_cable_len'
          label={combibox_cable_lenText()}
          normalize={val => val ? Number(val) : val}
          rules={[{required: true, type: 'number', min: 0}]}
        >
          <Input type='number' addonAfter={unit}/>
        </FormItem>
      </Form>
    </Modal>
  )
}
