import React, { useState, useEffect } from 'react';
import { Table, Divider, Button } from 'antd';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { InverterModal } from './Modal';
import { getInverter } from './service';
import { SearchString, SearchRange } from '../../components/TableColFilters/TableColSearch';
import { DeleteAction } from './Actions';
import * as styles from './InverterTable.module.scss';

// 表单中的数字columns和单位
// 格式[colKey, 类型('n'=num, 's'=str, 'b'=bool), 单位, col宽度]
const colKeys = [
  ['paco', 'n', 'kWp', 175], ['vac', 'n', 'V', 175],['pdcMax', 'n', 'kWp', 175],
  ['mpptNum', 'n', '', 175], ['vdcMax', 'n', 'V', 200], ['vso', 'n', 'V', 175],
  ['idcMax', 'n', 'A', 200], ['mpptIdcMax', 'n', 'A', 180],
  ['strIdcMax', 'n', 'A', 180], ['vmpptMin', 'n', 'V', 200],
  ['vmpptMax', 'n', 'V', 200], ['inverterEffcy', 'n', '%', 175]
]

const InverterTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setdata] = useState([]);
  const [activeData, setactiveData] = useState([]);
  const [loading, setloading] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [editRecord, seteditRecord] = useState(null);

  // 生成表单所有数字列属性
  const tableCols = colKeys.map(([key, type, unit, width], index) => {
    return {
      title: t(`InverterTable.table.${key}`),
      dataIndex: key,
      key: key,
      render: (value) => `${value} ${unit}`,
      sorter: (a, b) => a[key] - b[key],
      multiple: index,
      width: width,
      ...SearchRange({
        colKey: key,
        data,
        setactiveData
      })
    }
  })
  // 生成表单组件名称列属性
  tableCols.splice(0, 0, {
    title: t('InverterTable.table.name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name - b.name,
    fixed: 'left',
    width: 250,
    ...SearchString({colKey: 'name'}),
  })
  // 生成表单操作列属性
  tableCols.push({
    title: t('table.action'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 125,
    render: (value, record) => (
      <div>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            seteditRecord(record)
            setshowModal(true)
          }}
        />
        <Divider type='vertical' />
        <DeleteAction record={record} setdata={setdata} setactiveData={setactiveData} />
      </div>
    ),
  })

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
    <div>
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
      <Table
        columns={tableCols}
        dataSource={activeData}
        rowKey='inverterID'
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          total: activeData.length,
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true
        }}
        scroll={{ x: '100%', y: 'calc(100vh - 275px)' }}
      />
      <InverterModal
        showModal={showModal}
        setshowModal={setshowModal}
        setdata={setdata}
        setactiveData={setactiveData}
        editRecord={editRecord}
        seteditRecord={seteditRecord}
      />
    </div>
  )
}

export default InverterTable
