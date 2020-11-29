import React, { useState } from 'react'
import { Table, Divider, Button, Drawer, Tooltip } from 'antd'
import { EditOutlined, LineChartOutlined, FilterFilled, SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { SearchString, SearchRange } from '../TableColFilters/TableColSearch'
import { PVDetailTable } from '../PVDetailTable/PVDetailTable'
import { DeleteAction } from './Actions'
import { IVModal } from './IVModal'
import { PV } from '../../../@types'
import { ColumnsType } from 'antd/lib/table'

type ShownCol = 'pmax' | 'vmpo' | 'impo' | 'isco' | 'voco'

// 表单中的数字columns和单位
// 格式[colKey, 类型('n'=num, 's'=str, 'b'=bool), 单位, col宽度]
const colKeys: [ShownCol, 'n' | 's', string, number][] = [
  ['pmax', 'n', 'Wp', 150],
  ['vmpo', 'n', 'V', 175],
  ['impo', 'n', 'A', 175],
  ['isco', 'n', 'A', 150],
  ['voco', 'n', 'V', 150],
]

type PVTableProps = {
  loading: boolean
  data: PV[]
  setshowEditModal: React.Dispatch<React.SetStateAction<boolean>>
  seteditRecord: React.Dispatch<React.SetStateAction<PV | null>>
  showEditBut: boolean
}

export const PVTable: React.FC<PVTableProps> = ({
  loading,
  data,
  setshowEditModal,
  seteditRecord,
  showEditBut = false,
}) => {
  const { t } = useTranslation()
  const [showDrawer, setshowDrawer] = useState(false)
  const [viewPVID, setviewPVID] = useState<string>()
  const [viewPVUserID, setviewPVUserID] = useState<string>()
  const [showIVModal, setshowIVModal] = useState(false)

  // 点击行显示详细信息
  const onClickRow = (pvID: string) => {
    setviewPVID(pvID)
    setshowDrawer(true)
  }

  // 点击IV曲线图标
  const onClickIVCurve = (pvID: string, pv_userID: string) => {
    setviewPVID(pvID)
    setviewPVUserID(pv_userID)
    setshowIVModal(true)
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
    },
  ]

  // 生成表单所有数字列属性
  const tableCols: ColumnsType<PV> = colKeys.map(([key, type, unit, width], index) => {
    return {
      title: t(`PVtable.table.${key}`),
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
    sorter: (a, b) => a.name.localeCompare(b.name),
    fixed: 'left',
    width: 250,
    ...SearchString('name'),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record.name?.toLowerCase().includes(value.toString().toLowerCase()) || false,
  })
  // 生成表单组件材质列属性
  tableCols.push({
    title: t('PVtable.table.moduleMaterial'),
    dataIndex: 'moduleMaterial',
    key: 'moduleMaterial',
    render: value => t(`PV.${value}`),
    filters: moduleMaterialFilters,
    onFilter: (value, record) => record.moduleMaterial.indexOf(value.toString()) === 0,
    width: 200,
  })
  // 生成表单操作列属性
  tableCols.push({
    title: t('table.action'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: showEditBut ? 175 : 50,
    render: (value, record) => (
      <div>
        <Tooltip title={t('PVtable.table.iv-curve')}>
          <Button
            type='link'
            icon={<LineChartOutlined />}
            onClick={e => {
              e.stopPropagation()
              onClickIVCurve(record.pvID, record.userID)
            }}
          />
        </Tooltip>
        {showEditBut ? (
          <>
            <Divider type='vertical' />
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={e => {
                e.stopPropagation()
                seteditRecord(record)
                setshowEditModal(true)
              }}
            />
            <Divider type='vertical' />
            <DeleteAction record={record} />
          </>
        ) : null}
      </div>
    ),
  })

  return (
    <>
      <Table
        columns={tableCols}
        dataSource={data}
        rowKey='pvID'
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 275px)' }}
        onRow={record => {
          return {
            onClick: () => onClickRow(record.pvID),
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
        {viewPVID ? <PVDetailTable pvID={viewPVID} count={0} /> : null}
      </Drawer>
      <IVModal
        pvID={viewPVID}
        userID={viewPVUserID}
        show={showIVModal}
        setshow={setshowIVModal}
        setpvID={setviewPVID}
        setuserID={setviewPVUserID}
      />
    </>
  )
}
