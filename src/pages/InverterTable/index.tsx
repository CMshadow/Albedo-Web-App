import React, { useState } from 'react'
import { Button, Card, Tabs } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { InverterModal } from './Modal'
import { getInverter } from '../../services'
import { InverterTable } from '../../components/Table/InverterTable/InverterTable'
import { InverterTableViewOnly } from '../../components/Table/InverterTable/InverterTableViewOnly'
import { setInverterData } from '../../store/action'
import styles from './index.module.scss'
import { Inverter, RootState } from '../../@types'
const { TabPane } = Tabs

const InverterTablePage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const myData = useSelector((state: RootState) => state.inverter.data)
  const officialData = useSelector((state: RootState) => state.inverter.officialData)
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState<Inverter | null>(null)

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    getInverter({}).then(data => {
      dispatch(setInverterData(data))
      setloading(false)
    })
  }

  return (
    <Card bodyStyle={{ padding: '20px 12px' }}>
      <Tabs defaultActiveKey='1' type='card'>
        <TabPane tab={t('InverterTable.my')} key='1'>
          <Button
            className={styles.leftBut}
            type='primary'
            size='large'
            onClick={() => setshowModal(true)}
          >
            {t('InverterTable.add-Inverter')}
          </Button>
          <Button
            className={styles.rightBut}
            shape='round'
            onClick={() => fetchData()}
            loading={loading}
            icon={<SyncOutlined />}
            ghost
            type='primary'
          >
            {t('action.refresh')}
          </Button>
          <InverterTable
            loading={loading}
            data={myData}
            setshowEditModal={setshowModal}
            seteditRecord={seteditRecord}
            showEditBut
          />
          <InverterModal
            showModal={showModal}
            setshowModal={setshowModal}
            editRecord={editRecord}
            seteditRecord={seteditRecord}
          />
        </TabPane>
        <TabPane tab={t('InverterTable.official')} key='2'>
          <InverterTableViewOnly data={officialData} />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default InverterTablePage
