import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Input, Row, Col, Button, Collapse, Checkbox, Select } from 'antd';
import { editCombibox } from '../../store/action/index'
import { other2m } from '../../utils/unitConverter'
import * as styles from './EditForm.module.scss'
const FormItem = Form.Item;
const { Panel } = Collapse;

const rowGutter = { md: 8, lg: 15, xl: 32 };

export const EditForm = ({buildingID, combiboxIndex, setediting, disabled}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const combiboxData = buildings[buildingIndex].combibox[combiboxIndex]
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const [selVac, setselVac] = useState(null)

  const CBlayout = {}
  buildings[buildingIndex].data.forEach((spec, specIndex) => 
    CBlayout[specIndex] = spec.inverter_wiring.map(() => false)
  )
  console.log(CBlayout)
  const [CBvalues, setCBvalues] = useState(CBlayout)

  // 所有使用的逆变器的vac
  const allVac = new Set(buildings[buildingIndex].data.flatMap(spec => 
    spec.inverter_wiring.map(inverterSpec => 
      inverterSpec.inverter_model.inverterID ?
      inverterData.find(obj => 
        obj.inverterID === inverterSpec.inverter_model.inverterID
      ).vac :
      null
    ).filter(elem => elem !== null)
  ))

  const everyInvVac = {}
  buildings[buildingIndex].data.forEach((spec, specIndex) => 
    everyInvVac[specIndex] = spec.inverter_wiring.map(inverterSpec => 
      inverterSpec.inverter_model.inverterID ?
      inverterData.find(obj => 
        obj.inverterID === inverterSpec.inverter_model.inverterID
      ).vac :
      null
    ).filter(elem => elem !== null)
  )
  console.log(everyInvVac)

  const createCheckboxOptions = (subAryIndex, subAryInv) => 
    subAryInv.map((inv, index) => ({
      value: `${subAryIndex + 1}-${inv.inverter_serial_number}`,
      label: `${t('project.spec.subAry')}${subAryIndex + 1}-${inv.inverter_serial_number}`,
      disabled: everyInvVac[subAryIndex][index] !== selVac
    }))


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

  const submitForm = (values) => {
    console.log(values)
    values.linked_inverter_serial_num = []
    buildings[buildingIndex].data.forEach((subAry, subAryIndex) => {
      values.linked_inverter_serial_num = [
        ...values.linked_inverter_serial_num,
        ...values[`linked_inverter_serial_num_${subAryIndex + 1}`]
      ]
      delete values[`linked_inverter_serial_num_${subAryIndex + 1}`]
    })
    values.combibox_cable_len = other2m(unit, Number(values.combibox_cable_len))
    dispatch(editCombibox({buildingID, combiboxIndex, ...values}))
    setediting(false)
  }

  const genInitValues = () => {
    const initValues = {...combiboxData}
    if (combiboxData.linked_inverter_serial_num) {
      combiboxData.linked_inverter_serial_num.forEach(serial => {
        const subAryIndex = serial.split('-')[0]
        const key = `linked_inverter_serial_num_${subAryIndex}`
        if (key in initValues) {
          initValues[key].push(serial)
        } else {
          initValues[key] = [serial]
        }
      })
    }
    console.log(initValues)
    return initValues
  }

  return (
    <Form
      colon={false}
      form={form}
      hideRequiredMark
      name="combiboxSpec"
      scrollToFirstError
      validateMessages={validateMessages}
      onFinish={submitForm}
      initialValues={genInitValues()}
    >
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name='combibox_vac'
            label={t('project.spec.combibox_vac')}
            rules={[{required: true}]}
          >
            <Select 
              options={[...allVac].map(val => ({
                label: `${val} V`,
                value: val
              }))}
              onChange={val => setselVac(val)}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name='combibox_name'
            label={t('project.spec.combibox_name')}
            rules={[{required: true}]}
          >
            <Input/>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name='combibox_cable_len'
            label={t('project.spec.combibox_cable_len')}
            rules={[{required: true}]}
          >
            <Input type='number' addonAfter={unit}/>
          </FormItem>
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col span={24}>
          <FormItem 
            label={
              <div style={{paddingTop: 12}}>
                {t('project.spec.linked_inverter_serial_num')}
              </div>
            }
          >
            <Collapse ghost>
            {
              buildings[buildingIndex].data.map((subAry, subAryIndex) => 
                <Panel 
                  header={`${t('project.spec.subAry')}${subAryIndex + 1}`} 
                  key={subAryIndex}
                  forceRender
                >
                  <FormItem
                    name={`linked_inverter_serial_num_${subAryIndex + 1}`}
                    noStyle
                  >
                    <Checkbox.Group
                      options={createCheckboxOptions(subAryIndex, subAry.inverter_wiring)}
                    />
                  </FormItem>
                </Panel>
              )
            }
            </Collapse>
          </FormItem>
        </Col>
      </Row>
      <Row align='middle' justify='center'>
        <FormItem className={styles.submitBut}>
          <Button disabled={disabled} type='primary' onClick={handleOk}>
            {t('form.confirm')}
          </Button>
        </FormItem>
      </Row>
    </Form>
  )
}
