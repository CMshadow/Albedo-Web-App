import React, { useState } from 'react'
import { Button, Card, Tabs } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { PVModal } from './Modal'
import { getPV } from './service'
import { PVTable } from '../../components/Table/PVTable/PVTable'
import { PVTableViewOnly } from '../../components/Table/PVTable/PVTableViewOnly'
import { setPVData } from '../../store/action/index'
import * as styles from './index.module.scss'
const { TabPane } = Tabs

const PVTablePage = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const myData = useSelector(state => state.pv.data)
  const [activeMyData, setactiveMyData] = useState(myData)
  const officialData = useSelector(state => state.pv.officialData)
  const [activeOfficialData, setactiveOfficialData] = useState(officialData)
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    dispatch(getPV()).then(data => {
      dispatch(setPVData(data))
      setactiveMyData(data)
      setloading(false)
    })
  }

  return (
    <Card bodyStyle={{ padding: '20px 12px' }}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab={t('PVTable.my')} key="1">
          <Button className={styles.leftBut} type="primary" size="large" onClick={() => setshowModal(true)}>
            {t('PVtable.add-PV')}
          </Button>
          <Button
            className={styles.rightBut}
            shape="circle"
            onClick={fetchData}
            icon={<SyncOutlined spin={loading} />}
          />
          <PVTable
            loading={loading}
            data={myData}
            activeData={activeMyData}
            setactiveData={setactiveMyData}
            setshowModal={setshowModal}
            seteditRecord={seteditRecord}
            showEditBut
          />
          <PVModal
            setactiveData={setactiveMyData}
            showModal={showModal}
            setshowModal={setshowModal}
            editRecord={editRecord}
            seteditRecord={seteditRecord}
          />
        </TabPane>
        <TabPane tab={t('PVTable.official')} key="2">
          <PVTableViewOnly
            loading={loading}
            data={officialData}
            activeData={activeOfficialData}
            setactiveData={setactiveOfficialData}
          />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default PVTablePage
