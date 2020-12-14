import React, { useEffect } from 'react'
import { Modal, Input, Form } from 'antd'
import { v1 as uuidv1 } from 'uuid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { addBuilding, editBuilding } from '../../store/action/index'
import { other2m, m2other } from '../../utils/unitConverter'
import { Building, RootState } from '../../@types'
const FormItem = Form.Item

type BuildingModalProps = {
  showModal: boolean
  setshowModal: React.Dispatch<React.SetStateAction<boolean>>
  editRecord: Building | undefined
  seteditRecord: React.Dispatch<React.SetStateAction<Building | undefined>>
  setactiveKey?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const BuildingModal: React.FC<BuildingModalProps> = props => {
  const { showModal, setshowModal, editRecord, seteditRecord, setactiveKey } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const projectType = useSelector((state: RootState) => state.project?.projectType)
  const unit = useSelector((state: RootState) => state.unit.unit)

  // modal被关闭后回调
  const onClose = () => {
    form.resetFields()
    seteditRecord(undefined)
  }

  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(() => {
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

  const submitForm = (values: { buildingName: string; combibox_cable_len: number }) => {
    values.combibox_cable_len = other2m(unit, values.combibox_cable_len)
    let buildingID
    if (editRecord) {
      buildingID = editRecord.buildingID
      dispatch(editBuilding({ buildingID: editRecord.buildingID, ...values }))
    } else {
      buildingID = uuidv1()
      dispatch(addBuilding({ buildingID: buildingID, ...values }))
    }
    if (setactiveKey) setactiveKey(buildingID)
    setshowModal(false)
  }

  // 组件渲染后加载表单初始值
  useEffect(() => {
    const defaultValues = { ...editRecord }
    const init_combibox_cable_len = m2other(unit, defaultValues.combibox_cable_len)
    if (init_combibox_cable_len) defaultValues.combibox_cable_len = init_combibox_cable_len
    form.setFieldsValue(defaultValues || null)
  }, [editRecord, form, unit])

  const titleText = () =>
    projectType === 'domestic' ? t('project.add.building') : t('project.add.unit')

  const buildingNameText = () =>
    projectType === 'domestic' ? t('project.add.buildingName') : t('project.add.unitName')

  const combibox_cable_lenText = () =>
    projectType === 'domestic'
      ? t('project.add.combibox_cable_len')
      : t('project.add.combibox_cable_avg_len')

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
        name={uuidv1()}
        scrollToFirstError
        onFinish={submitForm}
      >
        <FormItem name='buildingName' label={buildingNameText()} rules={[{ required: true }]}>
          <Input />
        </FormItem>
        <FormItem
          name='combibox_cable_len'
          label={combibox_cable_lenText()}
          normalize={val => (val ? Number(val) : val)}
          rules={[{ required: true, type: 'number', min: 0 }]}
        >
          <Input type='number' addonAfter={unit} />
        </FormItem>
      </Form>
    </Modal>
  )
}
