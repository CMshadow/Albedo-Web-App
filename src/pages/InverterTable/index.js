import React, { useState, useEffect } from 'react';
import { Button, Card } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InverterModal } from './Modal';
import { getInverter, deleteInverter } from './service';
import { InverterTable } from '../../components/InverterTable/InverterTable'
import * as styles from './index.module.scss';

const InverterTablePage = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setdata] = useState([]);
  const [activeData, setactiveData] = useState([]);
  const [loading, setloading] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [editRecord, seteditRecord] = useState(null);

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    const response = dispatch(getInverter())
    response.then(data => {
      setdata(data)
      setactiveData(data)
      setloading(false)
    })
  }

  // 组件渲染后自动获取表单数据
  useEffect(() => {
    setloading(true)
    const response = dispatch(getInverter())
    response.then(data => {
      setdata(data)
      setactiveData(data)
      setloading(false)
    })
  }, [dispatch])

  return (
    <Card bodyStyle={{padding: '20px 12px'}}>
      <Button
        className={styles.leftBut}
        type="primary"
        onClick={() => setshowModal(true)}
      >
        {t('InverterTable.add-Inverter')}
      </Button>
      <Button
        className={styles.rightBut}
        shape="circle"
        onClick={() => fetchData()}
        icon={<SyncOutlined spin={loading}/>}
      />
      <InverterTable
        loading={loading}
        data={data}
        setdata={setdata}
        activeData={activeData}
        setactiveData={setactiveData}
        getInverter={getInverter}
        deleteInverter={deleteInverter}
        setshowModal={setshowModal}
        seteditRecord={seteditRecord}
        showActionCol
      />
      <InverterModal
        showModal={showModal}
        setshowModal={setshowModal}
        setdata={setdata}
        setactiveData={setactiveData}
        editRecord={editRecord}
        seteditRecord={seteditRecord}
      />
    </Card>
  )
}

export default InverterTablePage
