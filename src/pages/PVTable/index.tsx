import React, { useState } from 'react'
import { Button, Card, Tabs } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { PVModal } from './Modal'
import { getPV } from '../../services'
import { PVTable } from '../../components/Table/PVTable/PVTable'
import { PVTableViewOnly } from '../../components/Table/PVTable/PVTableViewOnly'
import { setPVData } from '../../store/action'
import styles from './index.module.scss'
import { RootState, PV } from '../../@types'
const { TabPane } = Tabs

const PVTablePage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const myData = useSelector((state: RootState) => state.pv.data)
  const officialData = useSelector((state: RootState) => state.pv.officialData)
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState<PV | null>(null)

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    getPV({}).then(data => {
      dispatch(setPVData(data))
      setloading(false)
    })
  }

  return (
    <Card bodyStyle={{ padding: '20px 12px' }}>
      <Tabs defaultActiveKey='1' type='card'>
        <TabPane tab={t('PVTable.my')} key='1'>
          <Button
            className={styles.leftBut}
            type='primary'
            size='large'
            onClick={() => setshowModal(true)}
          >
            {t('PVtable.add-PV')}
          </Button>
          <Button
            className={styles.rightBut}
            shape='circle'
            onClick={fetchData}
            icon={<SyncOutlined spin={loading} />}
          />
          <PVTable
            loading={loading}
            data={myData}
            setshowEditModal={setshowModal}
            seteditRecord={seteditRecord}
            showEditBut
          />
          <PVModal
            showModal={showModal}
            setshowModal={setshowModal}
            editRecord={editRecord}
            seteditRecord={seteditRecord}
          />
        </TabPane>
        <TabPane tab={t('PVTable.official')} key='2'>
          <PVTableViewOnly data={officialData} />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default PVTablePage
