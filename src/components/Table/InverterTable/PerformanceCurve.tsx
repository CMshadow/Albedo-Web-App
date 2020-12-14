import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Spin, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { PacPdcChart } from '../../Charts/PacPdcChart'
import { InverterEfficiencyChart } from '../../Charts/InverterEfficiencyChart'
import { getPerformanceCurve } from '../../../services'
import { RootState } from '../../../@types'

const { TabPane } = Tabs

type PerformanceCurveProps = {
  inverterID: string | undefined
  userID: string | undefined
  show: boolean
  setshow: React.Dispatch<React.SetStateAction<boolean>>
  setinverterID: React.Dispatch<React.SetStateAction<string | undefined>>
  setuserID: React.Dispatch<React.SetStateAction<string | undefined>>
}

type PacvsPdc = { pdc: number; pac: number; vdc: string }

type PdcvsEff = { pac_percent: number; eff: number; vdc: string }

export const PerformanceCurve: React.FC<PerformanceCurveProps> = ({
  inverterID,
  userID,
  show,
  setshow,
  setinverterID,
  setuserID,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userInv = useSelector((state: RootState) => state.inverter.data)
  const officialInv = useSelector((state: RootState) => state.inverter.officialData)
  const inv = useMemo(
    () => userInv.concat(officialInv).find(inv => inv.inverterID === inverterID),
    [inverterID, officialInv, userInv]
  )
  const [loading, setloading] = useState(false)
  const [pacpdcDataSrc, setpacpdcDataSrc] = useState<PacvsPdc[]>([])
  const [pdceffDataSrc, setpdceffDataSrc] = useState<PdcvsEff[]>([])

  useEffect(() => {
    if (inverterID && userID && inv) {
      setloading(true)
      getPerformanceCurve({ inverterID, userID })
        .then(res => {
          const pacpdcDataSrc: PacvsPdc[] = []
          const pdceffDataSrc: PdcvsEff[] = []
          const vdcTexts = ['vdcMin', 'vdco', 'vdcMax'] as const
          vdcTexts.forEach((vdcText, vdc_index) => {
            res.pdc.forEach((pdc, pdc_index) => {
              pacpdcDataSrc.push({
                pdc: pdc,
                pac: res.pac[vdc_index][pdc_index],
                vdc: `${t(`PacPdcChart.${vdcText}`)}: ${inv[vdcText]} V`,
              })
              pdceffDataSrc.push({
                pac_percent: res.pac[vdc_index][pdc_index] / inv.paco_sandia,
                eff: res.eff[vdc_index][pdc_index],
                vdc: `${t(`PacPdcChart.${vdcText}`)}: ${inv[vdcText]} V`,
              })
            })
          })
          setpacpdcDataSrc(pacpdcDataSrc)
          setpdceffDataSrc(pdceffDataSrc)
          setloading(false)
        })
        .catch(() => setloading(false))
    }
  }, [dispatch, inv, inverterID, t, userID])

  return (
    <Modal
      visible={show}
      width='50vw'
      onCancel={() => {
        setinverterID(undefined)
        setuserID(undefined)
        setshow(false)
      }}
      title={t('InverterTable.table.curve-title')}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey='1' centered>
          <TabPane tab={t('InverterTable.table.pdc-pac-curve')} key='1'>
            <PacPdcChart dataSource={pacpdcDataSrc} />
          </TabPane>
          <TabPane tab={t('InverterTable.table.inverter-efficiency-curve')} key='2'>
            <InverterEfficiencyChart dataSource={pdceffDataSrc} />
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  )
}
