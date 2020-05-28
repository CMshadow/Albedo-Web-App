import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Input, Row, Col, Select, Button, Drawer } from 'antd';
import { TableOutlined } from '@ant-design/icons'
import { editPVSpec, setPVActiveData } from '../../store/action/index'
import { PVTableViewOnly } from '../PVTable/PVTableViewOnly'
const FormItem = Form.Item;

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};

export const EditForm = ({buildingID, specIndex}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [showDrawer, setshowDrawer] = useState(false)
  const [tilt, settilt] = useState({value: null})
  const [azimuth, setazimuth] = useState({value: null})
  const pvData = useSelector(state => state.pv)

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  const handleOk = () => {
    if (tilt.validateStatus === 'error' || azimuth.validateStatus === 'error') {
      return
    }
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
    dispatch(editPVSpec({buildingID, specIndex, ...values}))
  }

  const tiltChange = (event) => {
    settilt({ ...validateTilt(event.target.value), value: event.target.value});
  }

  const validateTilt = (tilt) => {
    if (Number(tilt) < 0 || Number(tilt) > 60) {
      return {
        validateStatus: 'error',
        errorMsg: t('project.error.tilt'),
      }
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  const azimuthChange = (event) => {
    setazimuth({ ...validateAzimuth(event.target.value), value: event.target.value});
  }

  const validateAzimuth = (azimuth) => {
    if (Number(azimuth) < 0 || Number(azimuth) > 360) {
      return {
        validateStatus: 'error',
        errorMsg: t('project.error.azimuth'),
      }
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
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
      >
        <Row gutter={12}>
          <Col span={14}>
            <FormItem
              name='pvID'
              label={t('project.spec.pv')}
              rules={[{required: true}]}
            >
              <Select
                options={
                  pvData.activeData.map(record => ({
                    label: record.name,
                    value: record.pvID
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
          <Col span={8}>
            <FormItem
              name='tilt_angle'
              label={t('project.spec.tilt_angle')}
              rules={[{required: true}]}
              validateStatus={tilt.validateStatus}
              help={tilt.errorMsg || null}
            >
              <Input
                addonAfter='°'
                type='number'
                value={tilt.value}
                onChange={tiltChange}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              name='azimuth'
              label={t('project.spec.azimuth')}
              rules={[{required: true}]}
              validateStatus={azimuth.validateStatus}
              help={azimuth.errorMsg || null}
            >
              <Input
                addonAfter='°'
                type='number'
                value={azimuth.value}
                onChange={azimuthChange}
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type='primary' onClick={handleOk}>{t('form.confirm')}</Button>
        </FormItem>
      </Form>
      <Drawer
        bodyStyle={{padding: '0px'}}
        title={t('PVtable.table')}
        placement="right"
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        <PVTableViewOnly
          data={pvData.data}
          activeData={pvData.activeData}
          setactiveData={(activeData) => dispatch(setPVActiveData(activeData))}
        />
      </Drawer>
    </div>
  )
}
