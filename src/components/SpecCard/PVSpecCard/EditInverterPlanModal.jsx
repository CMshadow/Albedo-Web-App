import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Modal, Form, Divider, InputNumber, Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'
import { w2other } from '../../../utils/unitConverter'
import * as styles from './EditInverterPlanModal.module.scss'

export const EditInverterPlanModal = ({
  pvID, showModal, setshowModal, setautoInvPlan, capacity, N1, autoPlan
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )

  const selPV = pvData.find(pv => pv.pvID === pvID) || {}
  const selInv = inverterData.find(inv => inv.inverterID === autoPlan.inverterID)

  const [curN1, setcurN1] = useState(null)
  const [curN2, setcurN2] = useState(null)

  const submitForm = (values => {
    const numInv = genNumInv()
    setautoInvPlan({
      plan: new Array(numInv).fill(0).map(_ => ({pps: curN1, spi: curN2})),
      inverterID: autoPlan.inverterID,
      inverterUserID: autoPlan.inverterUserID
    })
    setshowModal(false)
  })
  
  const genNumInv = () => {
    return Math.floor(capacity * 1000 / curN2 / selPV.pmax / curN1)
  }

  const genActualCapacity = () => {
    return curN1 * curN2 * genNumInv() * selPV.pmax
  }

  const AllowDCOverAcRatio = () => {
    return selInv.pdcMax / selInv.paco
  }

  const ActualDCOverACRatio = () => {
    return curN1 * curN2 * selPV.pmax / (selInv.paco * 1000)
  }

  return (
    <Modal
      title={t('project.autoInverter.edit.title')}
      visible={showModal}
      onOk={() => form.submit()}
      onCancel={() => {
        setshowModal(false)
        setautoInvPlan({})
      }}
      okButtonProps={{disabled: !curN1 || !curN2}}
      okText={t('project.autoInverter.use')}
      cancelText={t('project.autoInverter.notuse')}
      maskClosable={false}
      width={'85vw'}
      destroyOnClose
      style={{ top: 20 }}
    >
      {
        selPV && selInv ?
        <Row gutter={[15, 15]} align='middle' justify='center'>
          <Col span={20}>
            <Row>
              <Col span={7}>
                <Divider>预计装机量</Divider>
                <Descriptions bordered size='small' column={2} layout='vertical'>
                  <Descriptions.Item label={t('project.spec.capacity')} span={1}>
                    {`${w2other(capacity * 1000).value} ${w2other(capacity * 1000).unit}`}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.spec.pvNum')} span={1}>
                    {Math.floor(capacity * 1000 / selPV.pmax)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col offset={1} span={16}>
                <Divider>实际装机量</Divider>
                <Descriptions bordered size='small' column={5} layout='vertical'>
                  <Descriptions.Item label={'实际直流装机容量'} span={1}>
                    {
                      curN1 && curN2 ? 
                      `${w2other(genActualCapacity()).value} ${w2other(genActualCapacity()).unit}` :
                      '-'
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={'逆变器数量'} span={1}>
                  {
                    curN1 && curN2 ? 
                    genNumInv() : 
                    '-'
                  }
                </Descriptions.Item>
                  <Descriptions.Item label={'实际接入组件数量'} span={2}>
                    {
                      curN1 && curN2 ? 
                      curN1 * curN2 * genNumInv() : 
                      '-'
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={'未接入组件数量'} span={1}>
                    {
                      curN1 && curN2 ? 
                      Math.floor(capacity * 1000 / selPV.pmax) - curN1 * curN2 * genNumInv() : 
                      '-'
                    }
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Row>
              <Col span={15}>
                <Divider>串联组件数N1</Divider>
                <Descriptions bordered size='small' column={2} layout='vertical'>
                  <Descriptions.Item label={'最大直流输入电压限制'} span={1}>
                    N1 ≤ {N1.N1vdcMax ? N1.N1vdcMax.toFixed(2) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={'MPPT电压范围限制'} span={1}>
                    {N1.N1Min ? N1.N1Min.toFixed(2) : '-'} ≤ N1 ≤ {N1.N1vmpptMax ? N1.N1vmpptMax.toFixed(2) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={'最大超配系数限制'} span={1}>
                    {
                      curN2 && selInv ?
                      `N1 ≤ ${(selInv.pdcMax * 1000 / (curN2 * selPV.pmax)).toFixed(2)}` :
                      '-'
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label={'N1取值范围'} span={1}>
                    {`
                      ${N1.N1Min ? Math.ceil(N1.N1Min) : '-'} 
                      ≤ N1 ≤ 
                      ${N1.N1vdcMax && N1.N1vmpptMax ? Math.floor(Math.min(N1.N1vdcMax, N1.N1vmpptMax)) : '-'}
                    `}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col offset={1} span={8}>
                <Divider>并联组串数N2</Divider>
                <Descriptions bordered size='small' column={1} layout='vertical'>
                  <Descriptions.Item label={'最大直流功率限制'} span={1}>
                  {
                    curN1 && selInv ?
                    `N2 ≤ ${(selInv.pdcMax / curN1 / selPV.pmax * 1000).toFixed(2)}` :
                    '-'
                  }
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider>逆变器</Divider>
            <Descriptions bordered size='small' column={4} layout='vertical'>
              <Descriptions.Item label={'逆变器数量(计算值)'} span={1}>
                {
                  curN1 && curN2 ? 
                  (capacity * 1000 / curN2 / selPV.pmax / curN1).toFixed(2) : 
                  '-'
                }
              </Descriptions.Item>
              <Descriptions.Item label={'逆变器数量(设计值)'} span={1}>
                {
                  curN1 && curN2 ? 
                  genNumInv() : 
                  '-'
                }
              </Descriptions.Item>
              <Descriptions.Item label={'逆变器最大允许超配系数'} span={1}>
                {
                  selInv ? 
                  AllowDCOverAcRatio().toFixed(2) : 
                  '-'
                }
              </Descriptions.Item>
              <Descriptions.Item label={'逆变器实际超配系数'} span={1}>
                {
                  curN1 && curN2 ? 
                  ActualDCOverACRatio().toFixed(2) : 
                  '-'
                }
              </Descriptions.Item>
            </Descriptions>

            <Divider>校验</Divider>
            <Descriptions bordered size='small' column={3} layout='vertical'>
              <Descriptions.Item label={'逆变器额定直流输入电压核算'} span={1}>
                {
                  curN1 && selInv && (curN1 * selPV.vmpo < selInv.vdcMax) ? 
                  '满足' : '不满足'
                }
              </Descriptions.Item>
              <Descriptions.Item label={'逆变器实际超配系数核算'} span={1}>
                {
                  curN1 && curN2 && selInv && ActualDCOverACRatio() <= AllowDCOverAcRatio() ? 
                  '满足' : '不满足'
                }
              </Descriptions.Item>
              <Descriptions.Item label={'N1按逆变器最大超配系数核算'} span={1}>
                {
                  curN1 && curN2 && selInv && curN1 <= selInv.pdcMax * 1000 / (curN2 * selPV.pmax) ?
                  '满足' : '不满足'
                }
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col span={4}>
            <Form
              preserve={false}
              form={form}
              name="edit-inverter-plan"
              scrollToFirstError
              hideRequiredMark
              onFinish={submitForm}
            >
                <Form.Item label='N1' name='N1' rules={[{required: true}]}>
                  <InputNumber min={0} precision={0} value={curN1} onChange={val => setcurN1(val)}/>
                </Form.Item>
                <Form.Item label='N2' name='N2' rules={[{required: true}]}>
                  <InputNumber min={0} precision={0} value={curN2} onChange={val => setcurN2(val)}/>
                </Form.Item>
            </Form>
          </Col>
        </Row> :
        null
      }
    </Modal>
  )
}