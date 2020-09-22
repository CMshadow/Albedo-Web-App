import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Button, Table, Divider, Card } from 'antd';
import { DashboardTwoTone } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CreateProjectModal } from './Modal';
import { getProject } from './service';
import { DeleteAction } from './Actions';
import { SearchString } from '../../components/TableColFilters/TableColSearch';
import * as styles from './ProjectTable.module.scss';


const ProjectTable = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setdata] = useState([]);
  const [activeData, setactiveData] = useState([])
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)

  // 项目类型筛选选项
  const projectTypeFilters = [
    {
      text: t('project.type.domestic'),
      value: 'domestic',
    },
    {
      text: t('project.type.commercial'),
      value: 'commercial',
    }
  ]

  const tableCols = [
    {
      title: t('project.create.title'),
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      sorter: (a, b) => a.projectTitle.localeCompare(b.projectTitle),
      fixed: 'left',
      width: 250,
      ...SearchString({colKey: 'projectTitle', data, setactiveData}),
      render: (val, record) => (
        <Link to={`/project/${record.projectID}/dashboard`}>
          {val}
        </Link>
      ),
    },
    {
      title: t('project.create.address'),
      dataIndex: 'projectAddress',
      key: 'projectAddress',
      width: 250,
      sorter: (a, b) => a.projectAddress.localeCompare(b.projectAddress),
    },
    {
      title: t('project.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a.createdAt - b.createdAt,
      width: 200,
      render: val => new Date(val * 1000).toLocaleString()
    },
    {
      title: t('project.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => a.updatedAt - b.updatedAt,
      width: 200,
      render: val => new Date(val * 1000).toLocaleString()
    },
    {
      title: t('project.create.type'),
      dataIndex: 'projectType',
      key: 'projectType',
      render: (value) => t(`project.type.${value}`),
      filters: projectTypeFilters,
      onFilter: (value, record) => record.projectType.indexOf(value) === 0,
      width: 150
    },
    {
      title: t('table.action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 125,
      render: (value, record) => (
        <div>
          <Button
            type="link"
            icon={<DashboardTwoTone />}
            onClick={() => {
              history.push(`project/${record.projectID}/dashboard`);
            }}
          />
          <Divider type='vertical' />
          <DeleteAction record={record} setdata={setdata} setactiveData={setactiveData} setloading={setloading}/>
        </div>
      ),
    }
  ]

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    dispatch(getProject()).then(data => {
      setdata(data)
      setactiveData(data)
      setloading(false)
    })
  }

  // 组件渲染后自动获取表单数据
  useEffect(() => {
    setloading(true)
    dispatch(getProject()).then(data => {
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
        size='large'
        onClick={() => setshowModal(true)}
      >
        {t('project.create-project')}
      </Button>
      <Button
        className={styles.rightBut}
        shape="circle"
        onClick={fetchData}
        icon={<SyncOutlined spin={loading}/>}
      />
      <Table
        columns={tableCols}
        dataSource={activeData}
        rowKey='projectID'
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          total: activeData.length,
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true
        }}
        scroll={{ x: 'max-content' }}
      />
      <CreateProjectModal showModal={showModal} setshowModal={setshowModal} />
    </Card>
  )
}

const mapStateToProps = state => {
  return {
    cognitoUser: state.auth.cognitoUser
  }
}

export default connect(mapStateToProps)(ProjectTable)
