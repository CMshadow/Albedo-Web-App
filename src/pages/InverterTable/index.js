import React, { useState } from 'react'
import { Button, Card, Tabs } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { InverterModal } from './Modal'
import { getInverter } from './service'
import { InverterTable } from '../../components/Table/InverterTable/InverterTable'
import { InverterTableViewOnly } from '../../components/Table/InverterTable/InverterTableViewOnly'
import { setInverterData } from '../../store/action/index'
import * as styles from './index.module.scss'
const { TabPane } = Tabs

const InverterTablePage = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const myData = useSelector(state => state.inverter.data)
  const [activeMyData, setactiveMyData] = useState(myData)
  const officialData = useSelector(state => state.inverter.officialData)
  const [activeOfficialData, setactiveOfficialData] = useState(officialData)
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    const response = dispatch(getInverter())
    response.then(data => {
      dispatch(setInverterData(data))
      setactiveMyData(data)
      setloading(false)
    })
  }

  return (
    <Card bodyStyle={{ padding: '20px 12px' }}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab={t('InverterTable.my')} key="1">
          <Button className={styles.leftBut} type="primary" size="large" onClick={() => setshowModal(true)}>
            {t('InverterTable.add-Inverter')}
          </Button>
          <Button
            className={styles.rightBut}
            shape="circle"
            onClick={() => fetchData()}
            icon={<SyncOutlined spin={loading} />}
          />
          <InverterTable
            loading={loading}
            data={myData}
            activeData={activeMyData}
            setactiveData={setactiveMyData}
            setshowModal={setshowModal}
            seteditRecord={seteditRecord}
            showEditBut
          />
          <InverterModal
            showModal={showModal}
            setshowModal={setshowModal}
            setactiveData={setactiveMyData}
            editRecord={editRecord}
            seteditRecord={seteditRecord}
          />
        </TabPane>
        <TabPane tab={t('InverterTable.official')} key="2">
          <InverterTableViewOnly
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

export default InverterTablePage
