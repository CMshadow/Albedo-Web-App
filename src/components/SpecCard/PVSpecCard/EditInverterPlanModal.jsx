import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import ChangeHighlight from 'react-change-highlight'
import { Row, Col, Modal, Form, Divider, InputNumber, Descriptions, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { w2other } from '../../../utils/unitConverter'

const { Text } = Typography

export const EditInverterPlanModal = ({ pvID, showModal, setshowModal, setautoInvPlan, capacity, N1, autoPlan }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const pvData = useSelector(state => state.pv.data).concat(useSelector(state => state.pv.officialData))
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )

  const selPV = pvData.find(pv => pv.pvID === pvID) || {}
  const selInv = inverterData.find(inv => inv.inverterID === autoPlan.inverterID)

  const [curN1, setcurN1] = useState(null)
  const [curN2, setcurN2] = useState(null)
  const actualCapRef = useRef()
  const invNumRef = useRef()
  const pvNumRef = useRef()
  const unusedNumRef = useRef()
  const N1RatioRef = useRef()
  const N2Ref = useRef()
  const invReqRef = useRef()
  const invNeedRef = useRef()
  const invRatioRef = useRef()

  const pass = (
    <Text strong style={{ color: '#52c41a' }}>
      {t('form.pass')}
    </Text>
  )
  const fail = (
    <Text strong style={{ color: '#ff4d4f' }}>
      {t('form.fail')}
    </Text>
  )

  const submitForm = values => {
    const numInv = genNumInv()
    setautoInvPlan({
      plan: new Array(numInv).fill(0).map(_ => ({ pps: curN1, spi: curN2 })),
      inverterID: autoPlan.inverterID,
      inverterUserID: autoPlan.inverterUserID,
    })
    setshowModal(false)
  }

  const genNumInv = () => {
    return Math.floor((capacity * 1000) / curN2 / selPV.pmax / curN1)
  }

  const genActualCapacity = () => {
    return curN1 * curN2 * genNumInv() * selPV.pmax
  }

  const AllowDCOverAcRatio = () => {
    return selInv.pdcMax / selInv.paco
  }

  const ActualDCOverACRatio = () => {
    return (curN1 * curN2 * selPV.pmax) / (selInv.paco * 1000)
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
      okButtonProps={{ disabled: !curN1 || !curN2 }}
      okText={t('project.autoInverter.use')}
      cancelText={t('project.autoInverter.notuse')}
      maskClosable={false}
      width={'85vw'}
      destroyOnClose
      style={{ top: 20 }}
    >
      {selPV && selInv ? (
        <Row gutter={[15, 15]} align="middle" justify="center">
          <Col span={20}>
            <Row>
              <Col span={7}>
                <Divider>{t('project.modifyPlan.expected_capacity')}</Divider>
                <Descriptions bordered size="small" column={2} layout="vertical">
                  <Descriptions.Item label={t('project.spec.capacity')} span={1}>
                    {`${w2other(capacity * 1000).value} ${w2other(capacity * 1000).unit}`}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.spec.pvNum')} span={1}>
                    {Math.floor((capacity * 1000) / selPV.pmax)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col offset={1} span={16}>
                <Divider>{t('project.modifyPlan.actual_capacity')}</Divider>
                <Descriptions bordered size="small" column={5} layout="vertical">
                  <Descriptions.Item label={t('project.modifyPlan.actual_dc_capacity')} span={1}>
                    <ChangeHighlight>
                      <div ref={actualCapRef}>
                        {curN1 && curN2
                          ? `${w2other(genActualCapacity()).value} ${w2other(genActualCapacity()).unit}`
                          : '-'}
                      </div>
                    </ChangeHighlight>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.modifyPlan.inv_num')} span={1}>
                    <ChangeHighlight>
                      <div ref={invNumRef}>{curN1 && curN2 ? genNumInv() : '-'}</div>
                    </ChangeHighlight>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.modifyPlan.pv_num')} span={2}>
                    <ChangeHighlight>
                      <div ref={pvNumRef}>{curN1 && curN2 ? curN1 * curN2 * genNumInv() : '-'}</div>
                    </ChangeHighlight>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.modifyPlan.unused_pv_num')} span={1}>
                    <ChangeHighlight>
                      <div ref={unusedNumRef}>
                        {curN1 && curN2
                          ? Math.floor((capacity * 1000) / selPV.pmax) - curN1 * curN2 * genNumInv()
                          : '-'}
                      </div>
                    </ChangeHighlight>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Row>
              <Col span={15}>
                <Divider>{t('project.modifyPlan.n1')}</Divider>
                <Descriptions bordered size="small" column={2} layout="vertical">
                  <Descriptions.Item label={t('project.modifyPlan.n1_limit_dc')} span={1}>
                    N1 ≤ {N1.N1vdcMax ? N1.N1vdcMax.toFixed(2) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.modifyPlan.n1_limit_mppt')} span={1}>
                    {N1.N1Min ? N1.N1Min.toFixed(2) : '-'} ≤ N1 ≤ {N1.N1vmpptMax ? N1.N1vmpptMax.toFixed(2) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.modifyPlan.n1_limit_ratio')} span={1}>
                    <ChangeHighlight>
                      <div ref={N1RatioRef}>
                        {curN2 && selInv ? `N1 ≤ ${((selInv.pdcMax * 1000) / (curN2 * selPV.pmax)).toFixed(2)}` : '-'}
                      </div>
                    </ChangeHighlight>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('project.modifyPlan.n1_range')} span={1}>
                    {`
                      ${N1.N1Min ? Math.ceil(N1.N1Min) : '-'} 
                      ≤ N1 ≤ 
                      ${N1.N1vdcMax && N1.N1vmpptMax ? Math.floor(Math.min(N1.N1vdcMax, N1.N1vmpptMax)) : '-'}
                    `}
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col offset={1} span={8}>
                <Divider>{t('project.modifyPlan.n2')}</Divider>
                <Descriptions bordered size="small" column={1} layout="vertical">
                  <Descriptions.Item label={t('project.modifyPlan.n2_limit_power')} span={1}>
                    <ChangeHighlight>
                      <div ref={N2Ref}>
                        {curN1 && selInv ? `N2 ≤ ${((selInv.pdcMax / curN1 / selPV.pmax) * 1000).toFixed(2)}` : '-'}
                      </div>
                    </ChangeHighlight>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider>{t('project.modifyPlan.inv')}</Divider>
            <Descriptions bordered size="small" column={4} layout="vertical">
              <Descriptions.Item label={t('project.modifyPlan.inv_expected')} span={1}>
                <ChangeHighlight>
                  <div ref={invReqRef}>
                    {curN1 && curN2 ? ((capacity * 1000) / curN2 / selPV.pmax / curN1).toFixed(2) : '-'}
                  </div>
                </ChangeHighlight>
              </Descriptions.Item>
              <Descriptions.Item label={t('project.modifyPlan.inv_actual')} span={1}>
                <ChangeHighlight>
                  <div ref={invNeedRef}>{curN1 && curN2 ? genNumInv() : '-'}</div>
                </ChangeHighlight>
              </Descriptions.Item>
              <Descriptions.Item label={t('project.modifyPlan.inv_max_ratio')} span={1}>
                {selInv ? AllowDCOverAcRatio().toFixed(2) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('project.modifyPlan.inv_actual_ratio')} span={1}>
                <ChangeHighlight>
                  <div ref={invRatioRef}>{curN1 && curN2 ? ActualDCOverACRatio().toFixed(2) : '-'}</div>
                </ChangeHighlight>
              </Descriptions.Item>
            </Descriptions>

            <Divider>{t('project.modifyPlan.validation')}</Divider>
            <Descriptions bordered size="small" column={3} layout="vertical">
              <Descriptions.Item label={t('project.modifyPlan.power_validation')} span={1}>
                {curN1 && selInv && curN1 * selPV.vmpo < selInv.vdcMax ? pass : fail}
              </Descriptions.Item>
              <Descriptions.Item label={t('project.modifyPlan.ratio_validation')} span={1}>
                {curN1 && curN2 && selInv && ActualDCOverACRatio() <= AllowDCOverAcRatio() ? pass : fail}
              </Descriptions.Item>
              <Descriptions.Item label={t('project.modifyPlan.n1_validation')} span={1}>
                {curN1 && curN2 && selInv && curN1 <= (selInv.pdcMax * 1000) / (curN2 * selPV.pmax) ? pass : fail}
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
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              labelAlign="left"
            >
              <Form.Item label="N1" name="N1" rules={[{ required: true }]} validateStatus="warning">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  value={curN1}
                  onChange={val => setcurN1(val)}
                />
              </Form.Item>
              <Form.Item label="N2" name="N2" rules={[{ required: true }]} validateStatus="warning">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={0}
                  value={curN2}
                  onChange={val => setcurN2(val)}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ) : null}
    </Modal>
  )
}
