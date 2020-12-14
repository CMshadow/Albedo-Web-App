import React, { useState, useEffect } from 'react'
import { Button, Table, Divider, Card, Tabs } from 'antd'
import { DashboardTwoTone, SyncOutlined, SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { SearchString } from '../../components/Table/TableColFilters/TableColSearch'
import { CreateProjectModal } from './Modal'
import { getProject } from '../../services'
import { DeleteAction } from './Actions'
import styles from './ProjectTable.module.scss'
import { Project } from '../../@types'
import { ColumnsType } from 'antd/lib/table'

const { TabPane } = Tabs

const ProjectTable: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [data, setdata] = useState<Project[]>([])
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)

  const tableCols: ColumnsType<Project> = [
    {
      title: t('project.create.title'),
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      sorter: (a: Project, b: Project) => a.projectTitle.localeCompare(b.projectTitle),
      fixed: 'left',
      width: 250,
      ...SearchString('projectTitle'),
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.projectTitle.toString().toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: t('project.create.address'),
      dataIndex: 'projectAddress',
      key: 'projectAddress',
      width: 250,
      sorter: (a: Project, b: Project) => a.projectAddress.localeCompare(b.projectAddress),
    },
    {
      title: t('project.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Project, b: Project) => a.createdAt - b.createdAt,
      width: 200,
      render: (val: number) => new Date(val * 1000).toLocaleString(),
    },
    {
      title: t('project.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: Project, b: Project) => a.updatedAt - b.updatedAt,
      width: 200,
      render: (val: number) => new Date(val * 1000).toLocaleString(),
    },
    {
      title: t('table.action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 125,
      render: (value: void, record: Project) => (
        <div>
          <Button
            type='link'
            icon={<DashboardTwoTone />}
            onClick={() => {
              history.push(`project/${record.projectID}/dashboard`)
            }}
          />
          <Divider type='vertical' />
          <DeleteAction record={record} setdata={setdata} setloading={setloading} />
        </div>
      ),
    },
  ]

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    getProject({}).then(data => {
      setdata(data)
      setloading(false)
    })
  }

  // 组件渲染后自动获取表单数据
  useEffect(() => {
    setloading(true)
    getProject({}).then(data => {
      setdata(data)
      setloading(false)
    })
  }, [dispatch])

  const genTable = (projectType: 'domestic' | 'commercial') => {
    const validData = data.filter(d => d.projectType === projectType)
    return (
      <Table
        columns={tableCols}
        dataSource={validData}
        rowKey='projectID'
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          total: validData.length,
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content' }}
      />
    )
  }

  return (
    <Card bodyStyle={{ padding: '20px 12px' }}>
      <Button
        className={styles.leftBut}
        type='primary'
        size='large'
        onClick={() => setshowModal(true)}
      >
        {t('project.create-project')}
      </Button>
      <Button
        className={styles.rightBut}
        shape='circle'
        onClick={fetchData}
        icon={<SyncOutlined spin={loading} />}
      />
      <Tabs defaultActiveKey='1' centered>
        <TabPane tab={t('project.type.domestic')} key='1'>
          {genTable('domestic')}
        </TabPane>
        <TabPane tab={t('project.type.commercial')} key='2'>
          {genTable('commercial')}
        </TabPane>
      </Tabs>
      <CreateProjectModal showModal={showModal} setshowModal={setshowModal} />
    </Card>
  )
}

export default ProjectTable
