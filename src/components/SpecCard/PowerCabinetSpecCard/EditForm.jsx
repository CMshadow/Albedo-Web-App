import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Form, Input, Row, Col, Button, Collapse, Checkbox, Select, Tooltip, Divider, Typography } from 'antd'
import { editPowercabinet } from '../../../store/action/index'
import * as styles from './PowerCabinetSpecCard.module.scss'
const FormItem = Form.Item
const { Panel } = Collapse
const { Text } = Typography

const rowGutter = { md: 8, lg: 15, xl: 32 }

const findUnusedCombiboxSerial = (powercabinetIndex, allTransformers, allPowercabinets, building) => {
  const allCombiboxSerial = building.combibox.map(combibox => combibox.combibox_serial_num)
  const allUsedCombiboxSerial = allTransformers
    .flatMap(trans => trans.linked_combibox_serial_num)
    .concat(
      allPowercabinets
        .filter((_, index) => index !== powercabinetIndex)
        .flatMap(powercabinet => powercabinet.linked_combibox_serial_num)
    )
  return allCombiboxSerial.filter(serial => !allUsedCombiboxSerial.includes(serial))
}

const findUnusedInverterSerial = (powercabinetIndex, allTransformers, allPowercabinets, building) => {
  const allInverterSerial = building.data.flatMap((spec, specIndex) =>
    spec.inverter_wiring.map(inverter => `${building.buildingName}-${specIndex + 1}-${inverter.inverter_serial_number}`)
  )
  const allUsedInverterSerial = allTransformers
    .flatMap(trans => trans.linked_inverter_serial_num)
    .concat(
      building.combibox
        ? building.combibox.flatMap(combibox =>
            combibox.linked_inverter_serial_num.map(serial => `${building.buildingName}-${serial}`)
          )
        : []
    )
    .concat(
      allPowercabinets
        .filter((_, index) => index !== powercabinetIndex)
        .flatMap(powercabinet => powercabinet.linked_inverter_serial_num)
    )
  return allInverterSerial.filter(serial => !allUsedInverterSerial.includes(serial))
}

export const EditForm = ({ powercabinetIndex, seteditingFalse }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const buildings = useSelector(state => state.project.buildings)
  const allTransformers = useSelector(state => state.project.transformers)
  const allPowercabinets = useSelector(state => state.project.powercabinets)
  const powercabinetData = allPowercabinets[powercabinetIndex]
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const [selUb, setselUb] = useState(powercabinetData.Ub || null)

  // 其他并网柜连接的变压器值
  const usedTransformerSerial = allPowercabinets
    .filter((powercabinet, index) => index !== powercabinetIndex)
    .flatMap(powercabinet => powercabinet.linked_transformer_serial_num)
  // 其他并网柜连接的汇流箱值
  const usedCombiboxSerial = allPowercabinets
    .filter((powercabinet, index) => index !== powercabinetIndex)
    .flatMap(powercabinet => powercabinet.linked_combibox_serial_num)
  // 其他并网柜连接的逆变器值
  const usedInverterSerial = allPowercabinets
    .filter((powercabinet, index) => index !== powercabinetIndex)
    .flatMap(powercabinet => powercabinet.linked_inverter_serial_num)

  // 所有Ub
  const allUb = new Set([...allTransformers.map(transformer => transformer.Ut), 400].sort((a, b) => (a < b ? 1 : -1)))

  // 每个光伏单元中没有接入变压器的汇流箱serial, 光伏单元index为key, [完整汇流箱serial]为value
  const unlinkedCombiboxSerial = {}
  buildings.forEach((building, buildingIndex) => {
    unlinkedCombiboxSerial[buildingIndex] = findUnusedCombiboxSerial(
      powercabinetIndex,
      allTransformers,
      allPowercabinets,
      building
    )
  })
  // 每个光伏单元中没有接入变压器的逆变器serial, 光伏单元index为key, [完整逆变器serial]为value
  const unlinkedInverterSerial = {}
  buildings.forEach((building, buildingIndex) => {
    unlinkedInverterSerial[buildingIndex] = findUnusedInverterSerial(
      powercabinetIndex,
      allTransformers,
      allPowercabinets,
      building
    )
  })

  // 每个光伏单元下每个汇流箱的vac，光伏单元index为key, [vac]为value
  const everyCombiboxVac = {}
  buildings.forEach((building, buildingIndex) => {
    everyCombiboxVac[buildingIndex] = building.combibox
      .filter(combibox => unlinkedCombiboxSerial[buildingIndex].includes(combibox.combibox_serial_num))
      .map(combibox => combibox.combibox_vac)
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

  const createTransformerCheckboxOptions = () =>
    allTransformers.map((transformer, transformerIndex) => ({
      value: transformer.transformer_serial_num,
      label: (
        <Tooltip title={transformer.transformer_name}>
          <Text style={{ color: '#95de64' }}>{`T${transformer.transformer_serial_num}`}</Text>
        </Tooltip>
      ),
      disabled: transformer.Ut !== selUb || usedTransformerSerial.includes(transformer.transformer_serial_num),
    }))
  // 对每个光伏单元生成关联汇流箱的选项, 禁用掉与变压器vac不符的选项，并禁用其他变压器已选选项
  const createCombiboxCheckboxOptions = buildingIndex =>
    unlinkedCombiboxSerial[buildingIndex].map((serial, serialIndex) => ({
      value: serial,
      label: <Text style={{ color: '#1890ff' }}>{`C${serial.split('-')[1]}`}</Text>,
      disabled: everyCombiboxVac[buildingIndex][serialIndex] > selUb || usedCombiboxSerial.includes(serial),
    }))
  // 对每个光伏单元生成关联逆变器的选项, 禁用掉与变压器vac不符的选项，并禁用其他变压器已选选项
  const createInverterCheckboxOptions = buildingIndex =>
    unlinkedInverterSerial[buildingIndex].map((serial, serialIndex) => {
      return {
        value: serial,
        label: <Text style={{ color: '#faad14' }}>{`S${serial.split('-').slice(-2).join('-')}`}</Text>,
        disabled: everyInverterVac[buildingIndex][serialIndex] > selUb || usedInverterSerial.includes(serial),
      }
    })

  // 将当前并网柜接的汇流箱/逆变器划分到每个光伏单元
  const splitLinkedEquipmentSerial = equipment => {
    const values = {}
    powercabinetData[`linked_${equipment}_serial_num`].forEach(serial => {
      const buildingName = serial.split('-')[0]
      const buildingIndex = buildings.indexOf(buildings.find(building => building.buildingName === buildingName))
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
    if (curCBValues && curCBValues.length > 0) {
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
    if (curCBValues && curCBValues.length > 0) {
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
  // 初始化所有变压器的checkAll状态
  const initTransformersCheckAll = () => {
    const transformerCBOptions = createTransformerCheckboxOptions()
    return determineCheckAll(powercabinetData[`linked_transformer_serial_num`], transformerCBOptions)
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
  // 初始化所有变压器的intermediate状态
  const initTransformersIntermediate = () => {
    const transformerCBOptions = createTransformerCheckboxOptions()
    return determineIntermediate(powercabinetData[`linked_transformer_serial_num`], transformerCBOptions)
  }

  const [checkAll, setcheckAll] = useState(initCheckAll())
  const [intermediate, setintermediate] = useState(initIntermediate())
  const [transCheckAll, settransCheckAll] = useState(initTransformersCheckAll())
  const [transIntermediate, settransIntermediate] = useState(initTransformersIntermediate())

  // 某个subAry种checkbox值变化后更新全部checkAll状态
  const updateCheckAll = (buildingIndex, curCombiboxCBValues, curInvCBValues) => {
    const combiboxCBValues =
      curCombiboxCBValues || form.getFieldValue(`linked_combibox_serial_num_${buildingIndex}`) || []
    const invCBValues = curInvCBValues || form.getFieldValue(`linked_inverter_serial_num_${buildingIndex}`) || []
    const status = determineCheckAll(
      [...combiboxCBValues, ...invCBValues],
      [...createCombiboxCheckboxOptions(buildingIndex), ...createInverterCheckboxOptions(buildingIndex)]
    )
    const newCheckAll = [...checkAll]
    newCheckAll[buildingIndex] = status
    setcheckAll(newCheckAll)
  }
  // 更新变压器checkAll状态
  const updateTransformerCheckAll = curTransformerCBValues => {
    const transformerCBValues = curTransformerCBValues || form.getFieldValue('linked_transformer_serial_num') || []
    const newTransformerCheckAll = determineCheckAll(transformerCBValues, createTransformerCheckboxOptions())
    settransCheckAll(newTransformerCheckAll)
  }

  // 某个subAry种checkbox值变化后更新全部intermediate状态
  const updateIntermediate = (buildingIndex, curCombiboxCBValues, curInvCBValues) => {
    const combiboxCBValues =
      curCombiboxCBValues || form.getFieldValue(`linked_combibox_serial_num_${buildingIndex}`) || []
    const invCBValues = curInvCBValues || form.getFieldValue(`linked_inverter_serial_num_${buildingIndex}`) || []
    const status = determineIntermediate(
      [...combiboxCBValues, ...invCBValues],
      [...createCombiboxCheckboxOptions(buildingIndex), ...createInverterCheckboxOptions(buildingIndex)]
    )
    const newIntermediate = [...intermediate]
    newIntermediate[buildingIndex] = status
    setintermediate(newIntermediate)
  }
  // 更新变压器intermediate状态
  const updateTransformerIntermediate = curTransformerCBValues => {
    const transformerCBValues = curTransformerCBValues || form.getFieldValue('linked_transformer_serial_num') || []
    const newTransformerCheckAll = determineIntermediate(transformerCBValues, createTransformerCheckboxOptions())
    settransIntermediate(newTransformerCheckAll)
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
    dispatch(editPowercabinet({ powercabinetIndex, ...values }))
    seteditingFalse()
  }

  // 生成表单默认值
  const genInitValues = () => {
    const initValues = { ...powercabinetData }
    const initInvCBValues = splitLinkedEquipmentSerial('inverter')
    Object.keys(initInvCBValues).forEach(
      buildingIndex => (initValues[`linked_inverter_serial_num_${buildingIndex}`] = initInvCBValues[buildingIndex])
    )
    const initCombiboxCBValues = splitLinkedEquipmentSerial('combibox')
    Object.keys(initCombiboxCBValues).forEach(
      buildingIndex => (initValues[`linked_combibox_serial_num_${buildingIndex}`] = initCombiboxCBValues[buildingIndex])
    )
    return initValues
  }

  const calculateCapacity = (
    linkedTransformerSerial,
    onChangbuildingIndex,
    linkedCombiboxSerial,
    linkedInverterSerial
  ) => {
    const transformerSerial = linkedTransformerSerial || form.getFieldValue(`linked_transformer_serial_num`) || []
    const transformerCapacity = transformerSerial.reduce((acc, serial) => {
      return acc + allTransformers.find(trans => trans.transformer_serial_num === serial).transformer_capacity
    }, 0)

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
                return acc2 + inverterData.find(obj => obj.inverterID === findInv.inverter_model.inverterID).pacMax
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
          return acc + inverterData.find(obj => obj.inverterID === findInv.inverter_model.inverterID).pacMax
        }, 0)
      })
      .reduce((acc, val) => acc + val, 0)

    form.setFieldsValue({
      powercabinet_linked_capacity: transformerCapacity + combiboxCapacity + inverterCapacity,
    })
  }

  // 改变并网柜Ub后回调uncheck掉所有与新Ub不符的选项
  const reInvalidateCheckbox = Ub => {
    if (Ub < 6000) {
      buildings.forEach((building, buildingIndex) => {
        const combiboxKey = `linked_combibox_serial_num_${buildingIndex}`
        const curCombiboxCBValues = form.getFieldValue(combiboxKey) || []
        const newCombiboxCBValues = curCombiboxCBValues.filter((serial, index) => {
          return everyCombiboxVac[buildingIndex][index] <= Ub ? true : false
        })
        form.setFieldsValue({ [combiboxKey]: newCombiboxCBValues })

        const inverterKey = `linked_inverter_serial_num_${buildingIndex}`
        const curInverterCBValues = form.getFieldValue(inverterKey) || []
        const newInverterCBValues = curInverterCBValues.filter((serial, index) => {
          return everyInverterVac[buildingIndex][index] <= Ub ? true : false
        })
        form.setFieldsValue({ [inverterKey]: newInverterCBValues })
      })
      setcheckAll(checkAll.map(_ => false))
      setintermediate(intermediate.map(_ => false))
    } else {
      const curTransformerCBValues = form.getFieldValue('linked_transformer_serial_num') || []
      const newTransformerCBValues = curTransformerCBValues.filter(serial => {
        return allTransformers.find(trans => trans.transformer_serial_num === serial).Ut === Ub ? true : false
      })
      form.setFieldsValue({ linked_transformer_serial_num: newTransformerCBValues })
      settransCheckAll(false)
      settransIntermediate(false)
    }
    calculateCapacity()
  }

  // 点击汇流箱和逆变器checkAll按钮后根据当前checkAll状态判定勾选所有可选项，或全部不勾选,并更新checkAll状态和intermediate状态
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

  const transformerCheckUncheckAll = () => {
    const transformerKey = 'linked_transformer_serial_num'
    const transformerCBoptions = createTransformerCheckboxOptions()

    let check = false
    let newTransformerValues
    if (!transCheckAll) {
      newTransformerValues = transformerCBoptions.filter(obj => !obj.disabled).map(obj => obj.value)
      settransCheckAll(true)
      check = true
    } else {
      newTransformerValues = []
      settransCheckAll(false)
      check = true
    }
    form.setFieldsValue({ [transformerKey]: newTransformerValues })
    settransIntermediate(false)
    return check
  }

  return (
    <Form
      colon={false}
      form={form}
      hideRequiredMark
      name="powercabinateSpec"
      scrollToFirstError
      onFinish={submitForm}
      initialValues={genInitValues()}
    >
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem name="Ub" label={t('project.spec.powercabinet.Ub')} rules={[{ required: true }]}>
            <Select
              options={[...allUb].map(val => ({
                label: `${val} V`,
                value: val,
              }))}
              onChange={val => {
                setselUb(val)
                reInvalidateCheckbox(val)
              }}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name="powercabinet_name"
            label={t('project.spec.powercabinet.powercabinet_name')}
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem name="powercabinet_linked_capacity" label={t('project.spec.powercabinet.linked-capacity')}>
            <Input type="number" disabled addonAfter="kVA" />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col span={24}>
          {[6000, 10000, 35000].includes(selUb) ? (
            <>
              <Checkbox
                indeterminate={transIntermediate}
                onChange={() => {
                  const check = transformerCheckUncheckAll()
                  check ? calculateCapacity() : calculateCapacity([])
                }}
                checked={transCheckAll}
              >
                {t('action.checkall')}
              </Checkbox>
              <Divider className={styles.divider} />
              <FormItem name={`linked_transformer_serial_num`} label={t('project.spec.linked_transformer_serial_num')}>
                <Checkbox.Group
                  options={createTransformerCheckboxOptions()}
                  onChange={vals => {
                    calculateCapacity(vals)
                    updateTransformerCheckAll(vals)
                    updateTransformerIntermediate(vals)
                  }}
                />
              </FormItem>
            </>
          ) : (
            <Collapse ghost>
              {buildings.map((building, buildingIndex) => (
                <Panel forceRender key={building.buildingID} header={building.buildingName}>
                  <Checkbox
                    indeterminate={intermediate[buildingIndex]}
                    onChange={() => {
                      const check = checkUncheckAll(buildingIndex)
                      check
                        ? calculateCapacity(null, buildingIndex, null, null)
                        : calculateCapacity(null, buildingIndex, [], [])
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
                          calculateCapacity(null, buildingIndex, vals, null)
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
                          calculateCapacity(null, buildingIndex, null, vals)
                          updateCheckAll(buildingIndex, null, vals)
                          updateIntermediate(buildingIndex, null, vals)
                        }}
                      />
                    </FormItem>
                  ) : null}
                </Panel>
              ))}
            </Collapse>
          )}
        </Col>
      </Row>

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
