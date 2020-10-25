import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Spin, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { PacPdcChart } from '../../Charts/PacPdcChart'
import { InverterEfficiencyChart } from '../../Charts/InverterEfficiencyChart'
import { getPerformanceCurve } from '../../../pages/InverterTable/service'

const { TabPane } = Tabs;

export const PerformanceCurve = ({inverterID, userID, show, setshow, setinverterID, setuserID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const userInv = useSelector(state => state.inverter.data)
  const officialInv = useSelector(state => state.inverter.officialData)
  const inv = userInv.concat(officialInv).find(inv => inv.inverterID === inverterID) || {}
  const [loading, setloading] = useState(false)
  const [pacpdcDataSrc, setpacpdcDataSrc] = useState([])
  const [pdceffDataSrc, setpdceffDataSrc] = useState([])

  useEffect(() => {
    if (inverterID && userID) {
      setloading(true)
      dispatch(getPerformanceCurve({inverterID, userID}))
      .then(res => {
        const pacpdcDataSrc = []
        const pdceffDataSrc = []
        const vdcTexts = ['vdcMin', 'vdco', 'vdcMax']
        vdcTexts.forEach((vdcText, vdc_index) => {
          res.pdc.forEach((pdc, pdc_index) => {
            pacpdcDataSrc.push({
              pdc: pdc, 
              pac: res.pac[vdc_index][pdc_index], 
              vdc: `${t(`PacPdcChart.${vdcText}`)}: ${inv[vdcText]} V`
            })
            pdceffDataSrc.push({
              pac_percent: res.pac[vdc_index][pdc_index] / inv.paco_sandia, 
              eff: res.eff[vdc_index][pdc_index], 
              vdc: `${t(`PacPdcChart.${vdcText}`)}: ${inv[vdcText]} V`
            })
          })
        })
        setpacpdcDataSrc(pacpdcDataSrc)
        setpdceffDataSrc(pdceffDataSrc)
        setloading(false)
      })
      .catch(e => setloading(false))
    }
  }, [dispatch, inv, inverterID, t, userID])

  return (
    <Modal
      visible={show}
      width='50vw'
      onCancel={() => {
        setinverterID(false)
        setshow(false)
      }}
      title={t("InverterTable.table.curve-title")}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab={t("InverterTable.table.pdc-pac-curve")} key="1">
            <PacPdcChart dataSource={pacpdcDataSrc} />
          </TabPane>
          <TabPane tab={t("InverterTable.table.inverter-efficiency-curve")} key="2">
            <InverterEfficiencyChart dataSource={pdceffDataSrc} />
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};
