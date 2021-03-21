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
          const ivData: IvsV[] = Object.keys(res.iv).flatMap(irr =>
            res.iv[irr].map(v => ({ current: v[0], voltage: v[1], irr: irr }))
          )
          const pvData: PvsV[] = Object.keys(res.pv).flatMap(irr =>
            res.pv[irr].map(v => ({ power: v[0], voltage: v[1], irr: irr }))
          )
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
