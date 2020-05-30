import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, InputNumber, Row, Col, Select, Button, Drawer } from 'antd';
import { TableOutlined } from '@ant-design/icons'
import { editInverterSpec, setInverterActiveData } from '../../store/action/index'
import { InverterTableViewOnly } from '../InverterTable/InverterTableViewOnly'
const FormItem = Form.Item;

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};

export const EditForm = ({buildingID, specIndex, invIndex, setediting}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [showDrawer, setshowDrawer] = useState(false)
  const inverterData = useSelector(state => state.inverter)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const invSpec = buildings[buildingIndex].data[specIndex]
    .inverter_wiring[invIndex]

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
    dispatch(editInverterSpec({buildingID, specIndex, invIndex, ...values}))
    setediting(false)
  }

  return (
    <div>
      <Form
        colon={false}
        form={form}
        hideRequiredMark
        name="newSpec"
        scrollToFirstError
        validateMessages={validateMessages}
        onFinish={submitForm}
        initialValues={invSpec}
      >
        <Row gutter={12}>
          <Col span={22}>
            <FormItem
              name='inverterID'
              label={t('project.spec.inverter')}
              rules={[{required: true}]}
            >
              <Select
                options={
                  inverterData.activeData.map(record => ({
                    label: record.name,
                    value: record.inverterID
                  }))
                }
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              shape="circle"
              icon={<TableOutlined />}
              onClick={() => setshowDrawer(true)}
            />
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={12}>
            <FormItem
              name='string_per_inverter'
              label={t('project.spec.string_per_inverter')}
              rules={[{required: true}]}
            >
              <InputNumber precision={0} min={1} style={{width: '100%'}}/>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='panels_per_string'
              label={t('project.spec.panels_per_string')}
              rules={[{required: true}]}
            >
              <InputNumber precision={0} min={1} style={{width: '100%'}}/>
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type='primary' onClick={handleOk}>{t('form.confirm')}</Button>
        </FormItem>
      </Form>
      <Drawer
        bodyStyle={{padding: '0px'}}
        title={t('InverterTable.table')}
        placement="right"
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        <InverterTableViewOnly
          data={inverterData.data}
          activeData={inverterData.activeData}
          setactiveData={(activeData) => dispatch(setInverterActiveData(activeData))}
        />
      </Drawer>
    </div>
  )
}
