import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Input, Row, Col, Button, Collapse, Checkbox, Select, Tooltip } from 'antd';
import { TransformerModel } from '../../TransformerModel/TransformerModel'
import { editTransformer } from '../../../store/action/index'
import { other2m } from '../../../utils/unitConverter'
import * as styles from './EditForm.module.scss'
const FormItem = Form.Item;
const { Panel } = Collapse;

const rowGutter = { md: 8, lg: 15, xl: 32 };

export const EditForm = ({transformerIndex, seteditingFalse}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

  const buildings = useSelector(state => state.project.buildings)
  const allTransformers = useSelector(state => state.project.transformers)
  const transformerData = allTransformers[transformerIndex]
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const [selVac, setselVac] = useState(transformerData.transformer_vac || null)
  const [curCapacity, setcurCapacity] = useState(transformerData.transformer_capacity || 0)

  // 其他变压器连接的汇流箱值
  const usedConmbiboxSerial = allTransformers
    .filter((trans, index) => index !== transformerIndex)
    .flatMap(transformer => transformer.linked_combibox_serial_num)
  // 其他变压器连接的逆变器值
  const usedInverterSerial = allTransformers
    .filter((trans, index) => index !== transformerIndex)
    .flatMap(transformer => transformer.linked_inverter_serial_num)

  // 所有光伏单元下所有汇流箱的vac
  const allCombiboxVac = new Set(buildings.flatMap(building => 
    building.combibox.map(combibox => 
      combibox.combibox_vac
    )
  ))
  // 所有光伏单元下所有逆变器的vac
  const allInverterVac = new Set(buildings.flatMap(building => 
    building.data.flatMap(spec =>
      spec.inverter_wiring.map(inverterSpec => 
        inverterSpec.inverter_model.inverterID ?
        inverterData.find(obj => 
          obj.inverterID === inverterSpec.inverter_model.inverterID
        ).vac :
        null
      ).filter(elem => elem !== null)
    )
  ))
  // 所有vac
  const allVac = new Set([...allCombiboxVac, ...allInverterVac])

  // 每个光伏单元中没有接入汇流箱的逆变器serial, 光伏单元index为key, [完整逆变器serial]为value
  const unlinkedInverterSerial = {}
  buildings.forEach((building, buildingIndex) => {
    const linkedInverterSerial = building.combibox.flatMap(combibox =>
      combibox.linked_inverter_serial_num.map(serial => `${building.buildingName}-${serial}`)
    )
    const allInverterSerial = building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring.map(inv => `${building.buildingName}-${specIndex + 1}-${inv.inverter_serial_number}`)
    )
    unlinkedInverterSerial[buildingIndex] = allInverterSerial.filter(serial => 
      !linkedInverterSerial.includes(serial)
    )
  })
  
  // 每个光伏单元下每个汇流箱的vac，光伏单元index为key, [vac]为value
  const everyCombiboxVac = {}
  buildings.forEach((building, buildingIndex) => {
    everyCombiboxVac[buildingIndex] = building.combibox.map(combibox =>
      combibox.combibox_vac
    )
  })
  // 每个光伏单元下所有没有接入汇流箱的逆变器的vac，光伏单元index为key, [逆变器vac]为value
  const everyInverterVac = {}
  buildings.forEach((building, buildingIndex) => {
    everyInverterVac[buildingIndex] = building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring.filter(inv => 
        unlinkedInverterSerial[buildingIndex].includes(
          `${building.buildingName}-${specIndex + 1}-${inv.inverter_serial_number}`
        )
      ).map(inv => 
        inverterData.find(obj => 
          obj.inverterID === inv.inverter_model.inverterID
        ).vac
      )
    )
  })

  // 对每个光伏单元生成关联汇流箱的选项, 禁用掉与变压器vac不符的选项，并禁用其他变压器已选选项
  const createCombiboxCheckboxOptions = (buildingIndex) => (
    buildings[buildingIndex].combibox.map((combibox, combiboxIndex) => ({
      value: combibox.combibox_serial_num,
      label: 
        <Tooltip title={combibox.combibox_name}>
          {`C${combibox.combibox_serial_num.split('-')[1]}`}
        </Tooltip>,
      disabled: everyCombiboxVac[buildingIndex][combiboxIndex] !== selVac ||
        usedConmbiboxSerial.includes(combibox.combibox_serial_num)
    }))
  )
  // 对每个光伏单元生成关联逆变器的选项, 禁用掉与变压器vac不符的选项，并禁用其他变压器已选选项
  const createInverterCheckboxOptions = (buildingIndex) => (
    unlinkedInverterSerial[buildingIndex].map((serial, serialIndex) => {
      return {
        value: serial,
        label: `S${serial.split('-').slice(-2,).join('-')}`,
        disabled: everyInverterVac[buildingIndex][serialIndex] !== selVac ||
          usedInverterSerial.includes(serial)
      }
    })
  )

  const calculateCapacity = (onChangbuildingIndex, linkedCombiboxSerial, linkedInverterSerial) => {
    const combiboxCapacity = buildings.map((building, buildingIndex) => {
      let combiboxSerial
      if (buildingIndex === onChangbuildingIndex && linkedCombiboxSerial) {
        combiboxSerial = linkedCombiboxSerial
      } else {
        combiboxSerial = form.getFieldValue(`linked_combibox_serial_num_${buildingIndex}`) || []
      }
      return combiboxSerial.reduce((acc, serial) => 
        acc + building.combibox.find(combibox => 
          combibox.combibox_serial_num === serial
        ).linked_inverter_serial_num.reduce((acc2, invSerial) => {
          const specIndex = invSerial.split('-')[0] - 1
          const invIndex = invSerial.split('-')[1] - 1
          const findInv = building.data[specIndex].inverter_wiring[invIndex]
          return acc2 + inverterData.find(obj => 
            obj.inverterID === findInv.inverter_model.inverterID
          ).paco
        }, 0)
      , 0)
    }).reduce((acc, val) => acc + val, 0)

    const inverterCapacity = buildings.map((building, buildingIndex) => {
      let inverterSerial
      if (buildingIndex === onChangbuildingIndex && linkedInverterSerial) {
        inverterSerial = linkedInverterSerial
      } else {
        inverterSerial = form.getFieldValue(`linked_inverter_serial_num_${buildingIndex}`) || []
      }
      return inverterSerial.reduce((acc, serial) => {
        const specIndex = serial.split('-')[1] - 1
        const invIndex = serial.split('-')[2] - 1
        const findInv = building.data[specIndex].inverter_wiring[invIndex]
        return acc + inverterData.find(obj => 
          obj.inverterID === findInv.inverter_model.inverterID
        ).paco
      }, 0)
    }).reduce((acc, val) => acc + val, 0)
    setcurCapacity(combiboxCapacity + inverterCapacity)
  }

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
  }

  // 改变汇流箱vac后回调uncheck掉所有与新vac不符的选项
  const reInvalidateCheckbox = (vac) => {
    buildings.forEach((building, buildingIndex) => {
      const combiboxKey = `linked_combibox_serial_num_${buildingIndex}`
      const curCombiboxCBValues = form.getFieldValue(combiboxKey) || []
      const newCombiboxCBValues = curCombiboxCBValues.filter((serial, index) => {
        return everyCombiboxVac[buildingIndex][index] === vac ? true : false
      })
      form.setFieldsValue({[combiboxKey]: newCombiboxCBValues})

      const inverterKey = `linked_inverter_serial_num_${buildingIndex}`
      const curInverterCBValues = form.getFieldValue(inverterKey) || []
      const newInverterCBValues = curInverterCBValues.filter((serial, index) => {
        return everyInverterVac[buildingIndex][index] === vac ? true : false
      })
      form.setFieldsValue({[inverterKey]: newInverterCBValues})
    })
    calculateCapacity()
  }

  return (
    <Form
      colon={false}
      form={form}
      hideRequiredMark
      name="transformerSpec"
      scrollToFirstError
      validateMessages={validateMessages}
      onFinish={submitForm}
      // initialValues={genInitValues()}
    >
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name='transformer_vac'
            label={t('project.spec.transformer_vac')}
            rules={[{required: true}]}
          >
            <Select 
              options={[...allVac].map(val => ({
                label: `${val} V`,
                value: val
              }))}
              onChange={val => {
                setselVac(val)
                reInvalidateCheckbox(val)
              }}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name='transformer_name'
            label={t('project.spec.transformer_name')}
            rules={[{required: true}]}
          >
            <Input/>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name='transformer_cable_len'
            label={t('project.spec.transformer_cable_len')}
            rules={[{required: true}]}
          >
            <Input type='number' addonAfter={unit}/>
          </FormItem>
        </Col>
      </Row>
      
      <TransformerModel 
        form={form} initUb={380} 
        curCapacity={curCapacity} setcurCapacity={setcurCapacity}
      />

      <Row gutter={rowGutter}>
        <Col span={24}>
          <FormItem 
            label={
              <div style={{paddingTop: 12}}>
                {t('project.spec.linked_combibox_inverter_serial_num')}
              </div>
            }
          >
            <Collapse ghost>
            {
              buildings.map((building, buildingIndex) => 
                <Panel forceRender key={building.buildingID} header={building.buildingName}>
                  {
                    createCombiboxCheckboxOptions(buildingIndex).length > 0 ?
                    <FormItem 
                      name={`linked_combibox_serial_num_${buildingIndex}`}
                      label={t('project.spec.linked_combibox_serial_num')}
                    >
                      <Checkbox.Group
                        options={createCombiboxCheckboxOptions(buildingIndex)}
                        onChange={vals => calculateCapacity(buildingIndex, vals, null)}
                      />
                    </FormItem> : 
                    null
                  }
                  {
                    createInverterCheckboxOptions(buildingIndex).length > 0 ?
                    <FormItem 
                      name={`linked_inverter_serial_num_${buildingIndex}`}
                      label={t('project.spec.linked_inverter_serial_num')}
                    >
                      <Checkbox.Group
                        options={createInverterCheckboxOptions(buildingIndex)}
                        onChange={vals => calculateCapacity(buildingIndex, null, vals)}
                      />
                    </FormItem> :
                    null
                  }   
                </Panel>
              )
            }
            </Collapse>
          </FormItem>
        </Col>
      </Row>
      
      <Row align='middle' justify='center'>
        <FormItem className={styles.submitBut}>
          <Button type='primary' onClick={handleOk}>
            {t('form.confirm')}
          </Button>
        </FormItem>
      </Row>
    </Form>
  )
}
