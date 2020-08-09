import React, { useState } from 'react';
import { Table, Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchString, SearchRange } from '../TableColFilters/TableColSearch';
import { PVDetailTable } from '../PVDetailTable/PVDetailTable'

// 表单中的数字columns和单位
// 格式[colKey, 类型('n'=num, 's'=str, 'b'=bool), 单位, col宽度]
const colKeys = [
  ['pmax', 'n', 'Wp', 150], ['vmpo', 'n', 'V', 175], ['impo', 'n', 'A', 175],
  ['isco', 'n', 'A', 150], ['voco', 'n', 'V', 150]
]

export const PVTableViewOnly = ({data, activeData, setactiveData}) => {
  const { t } = useTranslation();
  const [showDrawer, setshowDrawer] = useState(false)
  const [viewPVID, setviewPVID] = useState(false)

  // 点击组件名显示详细信息
  const onClickName = (pvID) => {
    setviewPVID(pvID)
    setshowDrawer(true)
  }

  // 组件材质筛选选项
  const moduleMaterialFilters = [
    {
      text: t('PV.glass/cell/glass'),
      value: 'glass/cell/glass',
    },
    {
      text: t('PV.glass/cell/polymer-sheet'),
      value: 'glass/cell/polymer-sheet',
    },
    {
      text: t('PV.polymer/thin-film/steel'),
      value: 'polymer/thin-film/steel',
    }
  ]

  // 生成表单所有数字列属性
  const tableCols = colKeys.map(([key, type, unit, width], index) => {
    return {
      title: t(`PVtable.table.${key}`),
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
    title: t('PVtable.table.companyName'),
    dataIndex: 'companyName',
    key: 'companyName',
    sorter: (a, b) => a.companyName - b.companyName,
    width: 150,
    ...SearchString({colKey: 'companyName', data, setactiveData}),
  })
  // 生成表单组件备注列属性
  tableCols.splice(0, 0, {
    title: t('PVtable.table.note'),
    dataIndex: 'note',
    key: 'note',
    width: 150,
  })
  // 生成表单组件名称列属性
  tableCols.splice(0, 0, {
    title: t('PVtable.table.name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name - b.name,
    fixed: 'left',
    width: 250,
    ...SearchString({colKey: 'name', onClick: onClickName, data, setactiveData}),
  })
  // 生成表单组件材质列属性
  tableCols.push({
    title: t('PVtable.table.moduleMaterial'),
    dataIndex: 'moduleMaterial',
    key: 'moduleMaterial',
    render: (value) => t(`PV.${value}`),
    filters: moduleMaterialFilters,
    onFilter: (value, record) => record.moduleMaterial.indexOf(value) === 0,
    width: 200
  })

  return (
    <>
      <Table
        columns={tableCols}
        dataSource={activeData}
        rowKey='pvID'
        pagination={{
          position: ['bottomCenter'],
          total: activeData.length,
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 275px)' }}
      />
      <Drawer
        bodyStyle={{padding: '0px'}}
        placement="right"
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        <PVDetailTable pvID={viewPVID} />
      </Drawer>
    </>
  )
}
