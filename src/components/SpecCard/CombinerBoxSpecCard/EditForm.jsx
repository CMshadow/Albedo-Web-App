import React, { useState, useEffect } from 'react'
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
import { editCombibox } from '../../../store/action/index'
import { other2m } from '../../../utils/unitConverter'
import * as styles from './CombinerBoxSpecCard.module.scss'
const FormItem = Form.Item
const { Panel } = Collapse
const { Text } = Typography

const rowGutter = { md: 8, lg: 15, xl: 32 }

export const EditForm = ({ buildingID, combiboxIndex, seteditingFalse }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const buildingName = buildings[buildingIndex].buildingName
  const allPowercabinets = useSelector(state => state.project.powercabinets)
  const allTransformers = useSelector(state => state.project.transformers)
  const combiboxData = buildings[buildingIndex].combibox[combiboxIndex]
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const [selVac, setselVac] = useState(combiboxData.combibox_vac || null)

  // 其他所有设备连接的逆变器值
  const otherCombiboxValues = buildings[buildingIndex].combibox
    .filter((combibox, index) => index !== combiboxIndex)
    .flatMap(combibox => combibox.linked_inverter_serial_num)
    .concat(
      allTransformers.flatMap(transformer =>
        transformer.linked_inverter_serial_num
          .filter(serial => serial.split('-')[0] === buildingName)
          .map(serial => serial.split('-').slice(1).join('-'))
      )
    )
    .concat(
      allPowercabinets.flatMap(powercabinet =>
        powercabinet.linked_inverter_serial_num
          .filter(serial => serial.split('-')[0] === buildingName)
          .map(serial => serial.split('-').slice(1).join('-'))
      )
    )

  // 这个光伏单元下所有使用的逆变器的vac
  const allVac = new Set(
    buildings[buildingIndex].data.flatMap(spec =>
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

  // 这个光伏单元下每个子阵列中每个逆变器的vac，子阵列index为key, [vac]为value
  const everyInvVac = {}
  buildings[buildingIndex].data.forEach(
    (spec, specIndex) =>
      (everyInvVac[specIndex] = spec.inverter_wiring
        .map(inverterSpec =>
          inverterSpec.inverter_model.inverterID
            ? inverterData.find(obj => obj.inverterID === inverterSpec.inverter_model.inverterID)
                .vac
            : null
        )
        .filter(elem => elem !== null))
  )

  // 将当前汇流箱接的逆变器划分到每个子区域
  const splitCombiboxInvSerial = () => {
    const values = {}
    combiboxData.linked_inverter_serial_num.forEach(serial => {
      const subAryIndex = serial.split('-')[0] - 1
      // const key = `linked_inverter_serial_num_${subAryIndex}`
      if (subAryIndex in values) {
        values[subAryIndex].push(serial)
      } else {
        values[subAryIndex] = [serial]
      }
    })
    return values
  }

  // 生成checkbox选项，禁用掉与汇流箱vac不符的选项，并禁用其他汇流箱已选选项
  const createCheckboxOptions = (subAryIndex, subAryInv) =>
    subAryInv.map((inv, index) => ({
      value: `${subAryIndex + 1}-${inv.inverter_serial_number}`,
      label: (
        <Tooltip
          title={inverterData.find(obj => obj.inverterID === inv.inverter_model.inverterID).name}
        >
          <Text style={{ color: '#faad14' }}>{`S${subAryIndex + 1}-${
            inv.inverter_serial_number
          }`}</Text>
        </Tooltip>
      ),
      disabled:
        everyInvVac[subAryIndex][index] !== selVac ||
        otherCombiboxValues.includes(`${subAryIndex + 1}-${inv.inverter_serial_number}`),
    }))

  // 判断一个subAry的checkall状态
  const determineCheckAll = (subAry_curCBValues, subAry_CBOptions) => {
    let status
    if (subAry_curCBValues.length > 0) {
      status = subAry_CBOptions
        .filter(obj => !obj.disabled)
        .map(obj => obj.value)
        .every(val => subAry_curCBValues.includes(val))
    } else {
      status = false
    }
    return status
  }

  // 判断一个subAry的intermediate状态
  const determineIntermediate = (subAry_curCBValues, subAry_CBOptions) => {
    let status
    if (subAry_curCBValues.length > 0) {
      status =
        subAry_CBOptions
          .filter(obj => !obj.disabled)
          .map(obj => obj.value)
          .some(val => subAry_curCBValues.includes(val)) &&
        !subAry_CBOptions
          .filter(obj => !obj.disabled)
          .map(obj => obj.value)
          .every(val => subAry_curCBValues.includes(val))
    } else {
      status = false
    }
    return status
  }

  // 初始化所有subAry的checkAll状态
  const initCheckAll = () => {
    const curCBvalues = splitCombiboxInvSerial()
    const initCheckAll = buildings[buildingIndex].data.map((_, specIndex) => {
      const subAry_CBOptions = createCheckboxOptions(
        specIndex,
        buildings[buildingIndex].data[specIndex].inverter_wiring
      )
      return determineCheckAll(curCBvalues[specIndex] || [], subAry_CBOptions)
    })
    return initCheckAll
  }

  // 初始化所有subAry的intermediate状态
  const initIntermediate = () => {
    const curCBvalues = splitCombiboxInvSerial()
    const initIntermediate = buildings[buildingIndex].data.map((_, specIndex) => {
      const subAry_CBOptions = createCheckboxOptions(
        specIndex,
        buildings[buildingIndex].data[specIndex].inverter_wiring
      )
      return determineIntermediate(curCBvalues[specIndex] || [], subAry_CBOptions)
    })
    return initIntermediate
  }

  const [checkAll, setcheckAll] = useState(initCheckAll())
  const [intermediate, setintermediate] = useState(initIntermediate())

  // 某个subAry种checkbox值变化后更新全部checkAll状态
  const updateCheckAll = (subAryIndex, subAryInv, curCBValues) => {
    const status = determineCheckAll(curCBValues, createCheckboxOptions(subAryIndex, subAryInv))
    const newcheckAll = [...checkAll]
    newcheckAll[subAryIndex] = status
    setcheckAll(newcheckAll)
  }

  // 某个subAry种checkbox值变化后更新全部intermediate状态
  const updateInterMediate = (subAryIndex, subAryInv, curCBValues) => {
    const status = determineIntermediate(curCBValues, createCheckboxOptions(subAryIndex, subAryInv))
    const newintermediate = [...intermediate]
    newintermediate[subAryIndex] = status
    setintermediate(newintermediate)
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
    buildings[buildingIndex].data.forEach((subAry, subAryIndex) => {
      values.linked_inverter_serial_num = [
        ...values.linked_inverter_serial_num,
        ...(values[`linked_inverter_serial_num_${subAryIndex + 1}`] || []),
      ]
      delete values[`linked_inverter_serial_num_${subAryIndex + 1}`]
    })
    values.combibox_cable_len = other2m(unit, Number(values.combibox_cable_len))
    dispatch(editCombibox({ buildingID, combiboxIndex, ...values }))
    seteditingFalse()
  }

  // 生成表单默认值
  const genInitValues = () => {
    const initValues = { ...combiboxData }
    const initCBValues = splitCombiboxInvSerial()
    Object.keys(initCBValues).forEach(
      subAryIndex =>
        (initValues[`linked_inverter_serial_num_${Number(subAryIndex) + 1}`] =
          initCBValues[subAryIndex])
    )
    return initValues
  }

  // 改变汇流箱vac后回调uncheck掉所有与新vac不符的选项
  const reInvalidateCheckbox = vac => {
    buildings[buildingIndex].data.forEach((spec, specIndex) => {
      const key = `linked_inverter_serial_num_${specIndex + 1}`
      const curCBValues = form.getFieldValue(key) || []
      const newCBValues = curCBValues.filter(val => {
        const [subAryIndex, invSerialNum] = val.split('-')
        return everyInvVac[subAryIndex - 1][invSerialNum - 1] === vac ? true : false
      })
      form.setFieldsValue({ [key]: newCBValues })
    })
  }

  // 点击checkAll按钮后根据当前checkAll状态判定勾选所有可选项，或全部不勾选,并更新checkAll状态和intermediate状态
  const checkUncheckAll = (subAryIndex, subAryInv) => {
    const key = `linked_inverter_serial_num_${subAryIndex + 1}`
    const CBoptions = createCheckboxOptions(subAryIndex, subAryInv)
    let newCBValues
    if (!checkAll[subAryIndex]) {
      newCBValues = subAryInv
        .map(inv => `${subAryIndex + 1}-${inv.inverter_serial_number}`)
        .filter(value => !CBoptions.find(obj => obj.value === value).disabled)
      const newcheckAll = [...checkAll]
      newcheckAll[subAryIndex] = true
      setcheckAll(newcheckAll)
    } else {
      newCBValues = []
      const newcheckAll = [...checkAll]
      newcheckAll[subAryIndex] = false
      setcheckAll(newcheckAll)
    }
    form.setFieldsValue({ [key]: newCBValues })
    const newintermediate = [...intermediate]
    newintermediate[subAryIndex] = false
    setintermediate(newintermediate)
  }

  useEffect(() => {
    buildings[buildingIndex].data.forEach((_, specIndex) => {
      const curCBValues = form.getFieldValue(`linked_inverter_serial_num_${specIndex + 1}`) || []
      form.setFieldsValue({
        [`linked_inverter_serial_num_${specIndex + 1}`]: curCBValues.filter(
          value => !otherCombiboxValues.includes(value)
        ),
      })
    })
  }, [buildingIndex, buildings, form, otherCombiboxValues])

  return (
    <Form
      colon={false}
      form={form}
      hideRequiredMark
      name="combiboxSpec"
      scrollToFirstError
      onFinish={submitForm}
      initialValues={genInitValues()}
    >
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name="combibox_vac"
            label={t('project.spec.combibox_vac')}
            rules={[{ required: true }]}
          >
            <Select
              options={[...allVac].map(val => ({
                label: `${val} V`,
                value: val,
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
            name="combibox_name"
            label={t('project.spec.combibox_name')}
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            name="combibox_cable_len"
            label={t('project.spec.combibox_cable_len')}
            normalize={val => (val ? Number(val) : val)}
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <Input type="number" addonAfter={unit} />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={rowGutter}>
        <Col span={24}>
          <FormItem
            label={
              <div style={{ paddingTop: 12 }}>{t('project.spec.linked_inverter_serial_num')}</div>
            }
          >
            <Collapse ghost>
              {buildings[buildingIndex].data.map((subAry, subAryIndex) => (
                <Panel
                  header={`${t('project.spec.subAry')}${subAryIndex + 1}`}
                  key={subAryIndex}
                  forceRender
                >
                  <Checkbox
                    indeterminate={intermediate[subAryIndex]}
                    onChange={() => checkUncheckAll(subAryIndex, subAry.inverter_wiring)}
                    checked={checkAll[subAryIndex]}
                  >
                    {t('action.checkall')}
                  </Checkbox>
                  <Divider className={styles.divider} />
                  <FormItem name={`linked_inverter_serial_num_${subAryIndex + 1}`} noStyle>
                    <Checkbox.Group
                      options={createCheckboxOptions(subAryIndex, subAry.inverter_wiring)}
                      onChange={values => {
                        updateCheckAll(subAryIndex, subAry.inverter_wiring, values)
                        updateInterMediate(subAryIndex, subAry.inverter_wiring, values)
                      }}
                    />
                  </FormItem>
                </Panel>
              ))}
            </Collapse>
          </FormItem>
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
