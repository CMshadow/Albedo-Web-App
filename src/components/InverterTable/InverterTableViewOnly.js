import React, { useState } from 'react';
import { Table, Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchString, SearchRange } from '../TableColFilters/TableColSearch';
import { InverterDetailTable } from '../InverterDetailTable/InverterDetailTable'

// 表单中的数字columns和单位
// 格式[colKey, 类型('n'=num, 's'=str, 'b'=bool), 单位, col宽度]
const colKeys = [
  ['paco', 'n', 'kWp', 175], ['vac', 'n', 'V', 175],['pdcMax', 'n', 'kWp', 175],
  ['mpptNum', 'n', '', 175], ['vdcMax', 'n', 'V', 200], ['vso', 'n', 'V', 175],
  ['idcMax', 'n', 'A', 200], ['mpptIdcMax', 'n', 'A', 180],
  ['strIdcMax', 'n', 'A', 180], ['vmpptMin', 'n', 'V', 200],
  ['vmpptMax', 'n', 'V', 200], ['inverterEffcy', 'n', '%', 175]
]

export const InverterTableViewOnly = ({data, activeData, setactiveData}) => {
  const { t } = useTranslation();
  const [showDrawer, setshowDrawer] = useState(false)
  const [viewInverterID, setviewInverterID] = useState(null)

  // 点击组件名显示详细信息
  const onClickName = (inverterID) => {
    setviewInverterID(inverterID)
    setshowDrawer(true)
  }

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
  // 生成表单组件提供商
  tableCols.splice(0, 0, {
    title: t('InverterTable.table.companyName'),
    dataIndex: 'companyName',
    key: 'companyName',
    sorter: (a, b) => a.companyName - b.companyName,
    width: 200,
    ...SearchString({colKey: 'companyName', data, setactiveData}),
  })
  // 生成表单组件名称列属性
  tableCols.splice(0, 0, {
    title: t('InverterTable.table.name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name - b.name,
    fixed: 'left',
    width: 250,
    ...SearchString({colKey: 'name', onClick: onClickName, data, setactiveData}),
  })

  return (
    <>
      <Table
        columns={tableCols}
        dataSource={activeData}
        rowKey='inverterID'
        pagination={{
          position: ['bottomCenter'],
          total: activeData.length,
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true
        }}
        scroll={{ x: '100%', y: 'calc(100vh - 275px)' }}
      />
      <Drawer
        bodyStyle={{padding: '0px'}}
        placement="right"
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        <InverterDetailTable inverterID={viewInverterID} />
      </Drawer>
    </>
  )
}
