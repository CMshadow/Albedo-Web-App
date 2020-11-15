import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Collapse,
  Checkbox,
  Select,
  Tooltip,
  Divider,
  Typography,
} from 'antd'
import { TransformerModel } from '../../Model/TransformerModel/TransformerModel'
import { editTransformer } from '../../../store/action/index'
import { other2m } from '../../../utils/unitConverter'
import * as styles from './TransformerSpecCard.module.scss'
const FormItem = Form.Item
const { Panel } = Collapse
const { Text } = Typography

const rowGutter = { md: 8, lg: 15, xl: 32 }

export const EditForm = ({ transformerIndex, seteditingFalse }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

  const projectACVolDropFac = useSelector(state => state.project.ACVolDropFac)
  const buildings = useSelector(state => state.project.buildings)
  const allPowercabinets = useSelector(state => state.project.powercabinets)
  const allTransformers = useSelector(state => state.project.transformers)
  const transformerData = allTransformers[transformerIndex]
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const [selVac, setselVac] = useState(transformerData.transformer_vac || null)
  const [curCapacity, setcurCapacity] = useState(transformerData.transformer_linked_capacity || 0)
  const [formChanged, setformChanged] = useState(false)

  // 其他所有设备连接的汇流箱值
  const usedCombiboxSerial = allTransformers
    .filter((trans, index) => index !== transformerIndex)
    .flatMap(transformer => transformer.linked_combibox_serial_num)
    .concat(allPowercabinets.flatMap(powercabinet => powercabinet.linked_combibox_serial_num))
  // 其他所有设备连接的逆变器值
  const usedInverterSerial = allTransformers
    .filter((trans, index) => index !== transformerIndex)
    .flatMap(transformer => transformer.linked_inverter_serial_num)
    .concat(allPowercabinets.flatMap(powercabinet => powercabinet.linked_inverter_serial_num))

  // 所有光伏单元下所有汇流箱的vac
  const allCombiboxVac = new Set(
    buildings.flatMap(building => building.combibox.map(combibox => combibox.combibox_vac))
  )
  // 所有光伏单元下所有逆变器的vac
  const allInverterVac = new Set(
    buildings.flatMap(building =>
      building.data.flatMap(spec =>
        spec.inverter_wiring
          .map(inverterSpec =>
            inverterSpec.inverter_model.inverterID
              ? inverterData.find(obj => obj.inverterID === inverterSpec.inverter_model.inverterID)
                  .vac
              : null
          )
          .filter(elem => elem !== null)
      )
    )
  )
  // 所有vac
  const allVac = new Set([...allCombiboxVac, ...allInverterVac])

  // 每个光伏单元中没有接入汇流箱的逆变器serial, 光伏单元index为key, [完整逆变器serial]为value
  const unlinkedInverterSerial = {}
  buildings.forEach((building, buildingIndex) => {
    const linkedInverterSerial = building.combibox.flatMap(combibox =>
      combibox.linked_inverter_serial_num.map(serial => `${building.buildingName}-${serial}`)
    )
    const allInverterSerial = building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring.map(
        inv => `${building.buildingName}-${specIndex + 1}-${inv.inverter_serial_number}`
      )
    )
    unlinkedInverterSerial[buildingIndex] = allInverterSerial.filter(
      serial => !linkedInverterSerial.includes(serial)
    )
  })

  // 每个光伏单元下每个汇流箱的vac，光伏单元index为key, [vac]为value
  const everyCombiboxVac = {}
  buildings.forEach((building, buildingIndex) => {
    everyCombiboxVac[buildingIndex] = building.combibox.map(combibox => combibox.combibox_vac)
  })
  // 每个光伏单元下所有没有接入汇流箱的逆变器的vac，光伏单元index为key, [逆变器vac]为value
  const everyInverterVac = {}
  buildings.forEach((building, buildingIndex) => {
    everyInverterVac[buildingIndex] = building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring
        .filter(inv =>
          unlinkedInverterSerial[buildingIndex].includes(
            `${building.buildingName}-${specIndex + 1}-${inv.inverter_serial_number}`
          )
        )
        .map(inv => inverterData.find(obj => obj.inverterID === inv.inverter_model.inverterID).vac)
    )
  })

  // 对每个光伏单元生成关联汇流箱的选项, 禁用掉与变压器vac不符的选项，并禁用其他变压器已选选项
  const createCombiboxCheckboxOptions = buildingIndex =>
    buildings[buildingIndex].combibox.map((combibox, combiboxIndex) => ({
      value: combibox.combibox_serial_num,
      label: (
        <Tooltip title={combibox.combibox_name}>
          <Text style={{ color: '#1890ff' }}>{`C${
            combibox.combibox_serial_num.split('-')[1]
          }`}</Text>
        </Tooltip>
      ),
      disabled:
        everyCombiboxVac[buildingIndex][combiboxIndex] !== selVac ||
        usedCombiboxSerial.includes(combibox.combibox_serial_num),
    }))
  // 对每个光伏单元生成关联逆变器的选项, 禁用掉与变压器vac不符的选项，并禁用其他变压器已选选项
  const createInverterCheckboxOptions = buildingIndex =>
    unlinkedInverterSerial[buildingIndex].map((serial, serialIndex) => {
      return {
        value: serial,
        label: (
          <Text style={{ color: '#faad14' }}>{`S${serial.split('-').slice(-2).join('-')}`}</Text>
        ),
        disabled:
          everyInverterVac[buildingIndex][serialIndex] !== selVac ||
          usedInverterSerial.includes(serial),
      }
    })

  // 将当前变压器接的汇流箱/逆变器划分到每个光伏单元
  const splitLinkedEquipmentSerial = equipment => {
    const values = {}
    transformerData[`linked_${equipment}_serial_num`].forEach(serial => {
      const buildingName = serial.split('-')[0]
      const buildingIndex = buildings.indexOf(
        buildings.find(building => building.buildingName === buildingName)
      )
      if (buildingIndex in values) {
        values[buildingIndex].push(serial)
      } else {
        values[buildingIndex] = [serial]
      }
    })
    return values
  }

  // 判断一个光伏单元的checkall状态
  const determineCheckAll = (curCBValues, CBOptions) => {
    let status
    if (curCBValues.length > 0) {
      status = CBOptions.filter(obj => !obj.disabled)
        .map(obj => obj.value)
        .every(val => curCBValues.includes(val))
    } else {
      status = false
    }
    return status
  }

  // 判断一个光伏单元的intermediate状态
  const determineIntermediate = (curCBValues, CBOptions) => {
    let status
    if (curCBValues.length > 0) {
      status =
        CBOptions.filter(obj => !obj.disabled)
          .map(obj => obj.value)
          .some(val => curCBValues.includes(val)) &&
        !CBOptions.filter(obj => !obj.disabled)
          .map(obj => obj.value)
          .every(val => curCBValues.includes(val))
    } else {
      status = false
    }
    return status
  }

  // 初始化所有光伏单元的checkAll状态
  const initCheckAll = () => {
    const curCombiboxCBValues = splitLinkedEquipmentSerial('combibox')
    const curInvCBValues = splitLinkedEquipmentSerial('inverter')
    const initCheckAll = buildings.map((_, buildingIndex) => {
      const combiboxCBOptions = createCombiboxCheckboxOptions(buildingIndex)
      const invCBOptions = createInverterCheckboxOptions(buildingIndex)
      return determineCheckAll(
        [...(curCombiboxCBValues[buildingIndex] || []), ...(curInvCBValues[buildingIndex] || [])],
        [...combiboxCBOptions, ...invCBOptions]
      )
    })
    return initCheckAll
  }

  // 初始化所有subAry的intermediate状态
  const initIntermediate = () => {
    const curCombiboxCBValues = splitLinkedEquipmentSerial('combibox')
    const curInvCBValues = splitLinkedEquipmentSerial('inverter')
    const initIntermediate = buildings.map((_, buildingIndex) => {
      const combiboxCBOptions = createCombiboxCheckboxOptions(buildingIndex)
      const invCBOptions = createInverterCheckboxOptions(buildingIndex)
      return determineIntermediate(
        [...(curCombiboxCBValues[buildingIndex] || []), ...(curInvCBValues[buildingIndex] || [])],
        [...combiboxCBOptions, ...invCBOptions]
      )
    })
    return initIntermediate
  }

  const [checkAll, setcheckAll] = useState(initCheckAll())
  const [intermediate, setintermediate] = useState(initIntermediate())

  // 某个subAry种checkbox值变化后更新全部checkAll状态
  const updateCheckAll = (buildingIndex, curCombiboxCBValues, curInvCBValues) => {
    const combiboxCBValues =
      curCombiboxCBValues || form.getFieldValue(`linked_combibox_serial_num_${buildingIndex}`) || []
    const invCBValues =
      curInvCBValues || form.getFieldValue(`linked_inverter_serial_num_${buildingIndex}`) || []
    const status = determineCheckAll(
      [...combiboxCBValues, ...invCBValues],
      [
        ...createCombiboxCheckboxOptions(buildingIndex),
        ...createInverterCheckboxOptions(buildingIndex),
      ]
    )
    const newCheckAll = [...checkAll]
    newCheckAll[buildingIndex] = status
    setcheckAll(newCheckAll)
  }

  // 某个subAry种checkbox值变化后更新全部intermediate状态
  const updateIntermediate = (buildingIndex, curCombiboxCBValues, curInvCBValues) => {
    const combiboxCBValues =
      curCombiboxCBValues || form.getFieldValue(`linked_combibox_serial_num_${buildingIndex}`) || []
    const invCBValues =
      curInvCBValues || form.getFieldValue(`linked_inverter_serial_num_${buildingIndex}`) || []
    const status = determineIntermediate(
      [...combiboxCBValues, ...invCBValues],
      [
        ...createCombiboxCheckboxOptions(buildingIndex),
        ...createInverterCheckboxOptions(buildingIndex),
      ]
    )
    const newIntermediate = [...intermediate]
    newIntermediate[buildingIndex] = status
    setintermediate(newIntermediate)
  }

  const calculateCapacity = (onChangbuildingIndex, linkedCombiboxSerial, linkedInverterSerial) => {
    const combiboxCapacity = buildings
      .map((building, buildingIndex) => {
        let combiboxSerial
        if (buildingIndex === onChangbuildingIndex && linkedCombiboxSerial) {
          combiboxSerial = linkedCombiboxSerial
        } else {
          combiboxSerial = form.getFieldValue(`linked_combibox_serial_num_${buildingIndex}`) || []
        }
        return combiboxSerial.reduce(
          (acc, serial) =>
            acc +
            building.combibox
              .find(combibox => combibox.combibox_serial_num === serial)
              .linked_inverter_serial_num.reduce((acc2, invSerial) => {
                const specIndex = invSerial.split('-')[0] - 1
                const invIndex = invSerial.split('-')[1] - 1
                const findInv = building.data[specIndex].inverter_wiring[invIndex]
                return (
                  acc2 +
                  inverterData.find(obj => obj.inverterID === findInv.inverter_model.inverterID)
                    .pacMax
                )
              }, 0),
          0
        )
      })
      .reduce((acc, val) => acc + val, 0)

    const inverterCapacity = buildings
      .map((building, buildingIndex) => {
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
          return (
            acc +
            inverterData.find(obj => obj.inverterID === findInv.inverter_model.inverterID).pacMax
          )
        }, 0)
      })
      .reduce((acc, val) => acc + val, 0)
    setcurCapacity(combiboxCapacity + inverterCapacity)
  }

  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(success => {
        form.submit()
      })
      .catch(err => {
        form.scrollToField(err.errorFields[0].name[0])
        return
      })
  }

  const submitForm = values => {
    values.linked_inverter_serial_num = []
    buildings.forEach((building, buildingIndex) => {
      values.linked_inverter_serial_num = [
        ...values.linked_inverter_serial_num,
        ...(values[`linked_inverter_serial_num_${buildingIndex}`] || []),
      ]
      delete values[`linked_inverter_serial_num_${buildingIndex}`]
    })
    values.linked_combibox_serial_num = []
    buildings.forEach((building, buildingIndex) => {
      values.linked_combibox_serial_num = [
        ...values.linked_combibox_serial_num,
        ...(values[`linked_combibox_serial_num_${buildingIndex}`] || []),
      ]
      delete values[`linked_combibox_serial_num_${buildingIndex}`]
    })
    values.transformer_cable_len = other2m(unit, Number(values.transformer_cable_len))
    if (values.transformer_wir_num > 1) {
      values.transformer_wir_choice = `${values.transformer_wir_num} (${values.transformer_wir_choice})`
    }
    dispatch(editTransformer({ transformerIndex, ...values }))
    seteditingFalse()
  }

  // 生成表单默认值
  const genInitValues = () => {
    const initValues = { ...transformerData }
    initValues.transformer_ACVolDropFac =
      transformerData.transformer_ACVolDropFac || projectACVolDropFac
    const initInvCBValues = splitLinkedEquipmentSerial('inverter')
    Object.keys(initInvCBValues).forEach(
      buildingIndex =>
        (initValues[`linked_inverter_serial_num_${buildingIndex}`] = initInvCBValues[buildingIndex])
    )
    const initCombiboxCBValues = splitLinkedEquipmentSerial('combibox')
    Object.keys(initCombiboxCBValues).forEach(
      buildingIndex =>
        (initValues[`linked_combibox_serial_num_${buildingIndex}`] =
          initCombiboxCBValues[buildingIndex])
    )
    if (transformerData.transformer_wir_choice) {
      if (transformerData.transformer_wir_choice.includes('(')) {
        const chunk = transformerData.transformer_wir_choice.split('(')
        initValues.transformer_wir_num = Number(chunk[0].trim())
        initValues.transformer_wir_choice = chunk[1].split(')')[0].trim()
      } else {
        initValues.transformer_wir_num = 1
      }
    }
    return initValues
  }

  // 改变汇流箱vac后回调uncheck掉所有与新vac不符的选项
  const reInvalidateCheckbox = vac => {
    buildings.forEach((building, buildingIndex) => {
      const combiboxKey = `linked_combibox_serial_num_${buildingIndex}`
      const curCombiboxCBValues = form.getFieldValue(combiboxKey) || []
      const newCombiboxCBValues = curCombiboxCBValues.filter((serial, index) => {
        return everyCombiboxVac[buildingIndex][index] === vac ? true : false
      })
      form.setFieldsValue({ [combiboxKey]: newCombiboxCBValues })

      const inverterKey = `linked_inverter_serial_num_${buildingIndex}`
      const curInverterCBValues = form.getFieldValue(inverterKey) || []
      const newInverterCBValues = curInverterCBValues.filter((serial, index) => {
        return everyInverterVac[buildingIndex][index] === vac ? true : false
      })
      form.setFieldsValue({ [inverterKey]: newInverterCBValues })
    })
    setcheckAll(checkAll.map(_ => false))
    setintermediate(intermediate.map(_ => false))
    calculateCapacity()
  }

  // 点击checkAll按钮后根据当前checkAll状态判定勾选所有可选项，或全部不勾选,并更新checkAll状态和intermediate状态
  const checkUncheckAll = buildingIndex => {
    const combiboxKey = `linked_combibox_serial_num_${buildingIndex}`
    const combiboxCBoptions = createCombiboxCheckboxOptions(buildingIndex)
    const invKey = `linked_inverter_serial_num_${buildingIndex}`
    const invCBoptions = createInverterCheckboxOptions(buildingIndex)

    let check = false
    let newCombiboxCBValues
    let newInvCBValues
    if (!checkAll[buildingIndex]) {
      newCombiboxCBValues = combiboxCBoptions.filter(obj => !obj.disabled).map(obj => obj.value)
      newInvCBValues = invCBoptions.filter(obj => !obj.disabled).map(obj => obj.value)
      const newcheckAll = [...checkAll]
      newcheckAll[buildingIndex] = true
      setcheckAll(newcheckAll)
      check = true
    } else {
      newCombiboxCBValues = []
      newInvCBValues = []
      const newcheckAll = [...checkAll]
      newcheckAll[buildingIndex] = false
      setcheckAll(newcheckAll)
    }
    form.setFieldsValue({ [combiboxKey]: newCombiboxCBValues })
    form.setFieldsValue({ [invKey]: newInvCBValues })
    const newIntermediate = [...intermediate]
    newIntermediate[buildingIndex] = false
    setintermediate(newIntermediate)
    return check
  }

  return (
    <Form
      colon={false}
      form={form}
      hideRequiredMark
      name="transformerSpec"
      scrollToFirstError
      onFinish={submitForm}
      initialValues={genInitValues()}
    >
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name="transformer_vac"
            label={t('project.spec.transformer_vac')}
            rules={[{ required: true }]}
          >
            <Select
              options={[...allVac].map(val => ({
                label: `${val} V`,
                value: val,
              }))}
              onChange={val => {
                setformChanged(true)
                setselVac(val)
                reInvalidateCheckbox(val)
              }}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name="transformer_name"
            label={t('project.spec.transformer_name')}
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name="transformer_linked_capacity"
            label={t('project.spec.transformer.linked-capacity')}
          >
            <Input type="number" disabled addonAfter="kVA" />
          </FormItem>
        </Col>
      </Row>

      <TransformerModel
        form={form}
        transformerData={transformerData}
        curCapacity={curCapacity}
        formChanged={formChanged}
        setformChanged={setformChanged}
      >
        <Row gutter={rowGutter}>
          <Col span={24}>
            <Collapse ghost>
              {buildings.map((building, buildingIndex) => (
                <Panel forceRender key={building.buildingID} header={building.buildingName}>
                  <Checkbox
                    indeterminate={intermediate[buildingIndex]}
                    onChange={() => {
                      setformChanged(true)
                      const check = checkUncheckAll(buildingIndex)
                      check
                        ? calculateCapacity(buildingIndex, null, null)
                        : calculateCapacity(buildingIndex, [], [])
                    }}
                    checked={checkAll[buildingIndex]}
                  >
                    {t('action.checkall')}
                  </Checkbox>
                  <Divider className={styles.divider} />
                  {createCombiboxCheckboxOptions(buildingIndex).length > 0 ? (
                    <FormItem
                      name={`linked_combibox_serial_num_${buildingIndex}`}
                      label={t('project.spec.linked_combibox_serial_num')}
                    >
                      <Checkbox.Group
                        options={createCombiboxCheckboxOptions(buildingIndex)}
                        onChange={vals => {
                          setformChanged(true)
                          calculateCapacity(buildingIndex, vals, null)
                          updateCheckAll(buildingIndex, vals, null)
                          updateIntermediate(buildingIndex, vals, null)
                        }}
                      />
                    </FormItem>
                  ) : null}
                  {createInverterCheckboxOptions(buildingIndex).length > 0 ? (
                    <FormItem
                      name={`linked_inverter_serial_num_${buildingIndex}`}
                      label={t('project.spec.linked_inverter_serial_num')}
                    >
                      <Checkbox.Group
                        options={createInverterCheckboxOptions(buildingIndex)}
                        onChange={vals => {
                          setformChanged(true)
                          calculateCapacity(buildingIndex, null, vals)
                          updateCheckAll(buildingIndex, null, vals)
                          updateIntermediate(buildingIndex, null, vals)
                        }}
                      />
                    </FormItem>
                  ) : null}
                </Panel>
              ))}
            </Collapse>
          </Col>
        </Row>
      </TransformerModel>

      <Row align="middle" justify="center">
        <FormItem className={styles.submitBut}>
          <Button type="primary" onClick={handleOk}>
            {t('form.confirm')}
          </Button>
        </FormItem>
      </Row>
    </Form>
  )
}
