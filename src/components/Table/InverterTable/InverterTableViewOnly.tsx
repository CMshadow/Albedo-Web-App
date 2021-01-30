import React, { useState } from 'react'
import { Table, Drawer, Tooltip, Button } from 'antd'
import { LineChartOutlined, SearchOutlined, FilterFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { SearchString, SearchRange } from '../TableColFilters/TableColSearch'
import { InverterDetailTable } from '../InverterDetailTable/InverterDetailTable'
import { PerformanceCurve } from './PerformanceCurve'
import { Inverter } from '../../../@types'
import { ColumnsType } from 'antd/lib/table'

type ShownCol =
  | 'paco'
  | 'vac'
  | 'pdcMax'
  | 'pacMax'
  | 'mpptNum'
  | 'vdcMax'
  | 'vso'
  | 'idcMax'
  | 'mpptIdcMax'
  | 'strIdcMax'
  | 'vmpptMin'
  | 'vmpptMax'
  | 'inverterEffcy'

// 表单中的数字columns和单位
// 格式[colKey, 类型('n'=num, 's'=str, 'b'=bool), 单位, col宽度]
const colKeys: [ShownCol, 'n' | 's', string, number][] = [
  ['paco', 'n', 'kWp', 175],
  ['vac', 'n', 'V', 175],
  ['pdcMax', 'n', 'kWp', 175],
  ['pacMax', 'n', 'kVA', 200],
  ['mpptNum', 'n', '', 175],
  ['vdcMax', 'n', 'V', 200],
  ['vso', 'n', 'V', 175],
  ['idcMax', 'n', 'A', 200],
  ['mpptIdcMax', 'n', 'A', 180],
  ['strIdcMax', 'n', 'A', 180],
  ['vmpptMin', 'n', 'V', 200],
  ['vmpptMax', 'n', 'V', 200],
  ['inverterEffcy', 'n', '%', 175],
]

type InverterTableViewOnlyProps = { data: Inverter[] }

export const InverterTableViewOnly: React.FC<InverterTableViewOnlyProps> = ({ data }) => {
  const { t } = useTranslation()
  const [showDrawer, setshowDrawer] = useState(false)
  const [viewInverterID, setviewInverterID] = useState<string>()
  const [viewInverterUserID, setviewInverterUserID] = useState<string>()
  const [showModal, setshowModal] = useState(false)

  // 点击组件名显示详细信息
  const onClickRow = (inverterID: string) => {
    setviewInverterID(inverterID)
    setshowDrawer(true)
  }

  // 点击IV曲线图标
  const onClickCurve = (inverterID: string, userID: string) => {
    setviewInverterID(inverterID)
    setviewInverterUserID(userID)
    setshowModal(true)
  }

  // 生成表单所有数字列属性
  const tableCols: ColumnsType<Inverter> = colKeys.map(([key, , unit, width], index) => {
    return {
      title: t(`InverterTable.table.${key}`),
      dataIndex: key,
      key: key,
      render: value => `${value} ${unit}`,
      sorter: (a, b) => a[key] - b[key],
      multiple: index,
      width: width,
      ...SearchRange({
        colKey: key,
        data,
      }),
      filterIcon: filtered => <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />,
    }
  })
  // 生成表单组件提供商
  tableCols.splice(0, 0, {
    title: t('InverterTable.table.companyName'),
    dataIndex: 'companyName',
    key: 'companyName',
    sorter: (a, b) =>
      !a.companyName || !b.companyName ? 0 : a.companyName.localeCompare(b.companyName),
    width: 150,
    ...SearchString('companyName', 'tag'),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record.companyName?.toLowerCase().includes(value.toString().toLowerCase()) || false,
  })
  // 生成表单组件备注列属性
  tableCols.splice(0, 0, {
    title: t('InverterTable.table.note'),
    dataIndex: 'note',
    key: 'note',
    width: 150,
  })
  // 生成表单组件名称列属性
  tableCols.splice(0, 0, {
    title: t('InverterTable.table.name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    fixed: 'left',
    width: 250,
    ...SearchString('name'),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record.name?.toLowerCase().includes(value.toString().toLowerCase()) || false,
  })
  // 生成表单操作列属性
  tableCols.push({
    title: t('table.action'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 50,
    render: (value, record) => (
      <Tooltip title={t('InverterTable.table.curve-title')}>
        <Button
          type='link'
          icon={<LineChartOutlined />}
          onClick={e => {
            e.stopPropagation()
            onClickCurve(record.inverterID, record.userID)
          }}
        />
      </Tooltip>
    ),
  })

  return (
    <>
      <Table
        columns={tableCols}
        dataSource={data}
        rowKey='inverterID'
        pagination={{
          position: ['bottomCenter'],
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 275px)' }}
        onRow={record => {
          return {
            onClick: () => onClickRow(record.inverterID),
          }
        }}
      />
      <Drawer
        bodyStyle={{ padding: '0px' }}
        placement='right'
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        {viewInverterID ? <InverterDetailTable inverterID={viewInverterID} count={0} /> : null}
      </Drawer>
      <PerformanceCurve
        inverterID={viewInverterID}
        userID={viewInverterUserID}
        show={showModal}
        setshow={setshowModal}
        setinverterID={setviewInverterID}
        setuserID={setviewInverterUserID}
      />
    </>
  )
}
