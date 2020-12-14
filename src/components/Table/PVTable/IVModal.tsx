import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Modal, Spin, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { IVChart } from '../../Charts/IVChart'
import { PVChart } from '../../Charts/PVChart'
import { getIVCurve } from '../../../services'

const { TabPane } = Tabs

type IVModalProps = {
  pvID: string | undefined
  userID: string | undefined
  show: boolean
  setshow: React.Dispatch<React.SetStateAction<boolean>>
  setpvID: React.Dispatch<React.SetStateAction<string | undefined>>
  setuserID: React.Dispatch<React.SetStateAction<string | undefined>>
}

type IvsV = { current: number; irr: string; voltage: number }

type PvsV = { power: number; voltage: number; irr: string }

export const IVModal: React.FC<IVModalProps> = ({
  pvID,
  userID,
  show,
  setshow,
  setpvID,
  setuserID,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false)
  const [ivDataSrc, setivDataSrc] = useState<IvsV[]>([])
  const [pvDataSrc, setpvDataSrc] = useState<PvsV[]>([])

  useEffect(() => {
    if (pvID && userID) {
      setloading(true)
      getIVCurve({ pvID, userID })
        .then(res => {
          const ivData: IvsV[] = []
          const pvData: PvsV[] = []
          Object.keys(res).forEach(key => {
            ivData.push({ current: res[key].i_sc, voltage: 0, irr: key })
            ivData.push({ current: 0, voltage: res[key].v_oc, irr: key })
            ivData.push({ current: res[key].i_mp, voltage: res[key].v_mp, irr: key })
            ivData.push({ current: res[key].i_x, voltage: res[key].v_oc * 0.5, irr: key })
            ivData.push({
              current: res[key].i_xx,
              voltage: (res[key].v_oc + res[key].v_mp) * 0.5,
              irr: key,
            })

            pvData.push({ power: res[key].i_sc * 0, voltage: 0, irr: key })
            pvData.push({ power: 0 * res[key].v_oc, voltage: res[key].v_oc, irr: key })
            pvData.push({ power: res[key].i_mp * res[key].v_mp, voltage: res[key].v_mp, irr: key })
            pvData.push({
              power: res[key].i_x * res[key].v_oc * 0.5,
              voltage: res[key].v_oc * 0.5,
              irr: key,
            })
            pvData.push({
              power: res[key].i_xx * (res[key].v_oc + res[key].v_mp) * 0.5,
              voltage: (res[key].v_oc + res[key].v_mp) * 0.5,
              irr: key,
            })
          })
          setivDataSrc(ivData)
          setpvDataSrc(pvData)
          setloading(false)
        })
        .catch(() => setloading(false))
    }
  }, [dispatch, pvID, userID])

  return (
    <Modal
      visible={show}
      width='50vw'
      onCancel={() => {
        setpvID(undefined)
        setuserID(undefined)
        setshow(false)
      }}
      title={t('PVtable.table.iv-pv-curve')}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey='1' centered>
          <TabPane tab={t('PVtable.table.iv-curve')} key='1'>
            <IVChart dataSource={ivDataSrc} />
          </TabPane>
          <TabPane tab={t('PVtable.table.pv-curve')} key='2'>
            <PVChart dataSource={pvDataSrc} />
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  )
}
