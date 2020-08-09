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
      sorter: (a, b) => a.projectTitle - b.projectTitle,
      fixed: 'left',
      width: 250,
      ...SearchString({colKey: 'projectTitle'}),
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
      sorter: (a, b) => a.projectAddress - b.projectAddress,
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
          <DeleteAction record={record} setdata={setdata} />
        </div>
      ),
    }
  ]

  // 手动触发更新列表数据
  const fetchData = () => {
    setloading(true)
    dispatch(getProject()).then(data => {
      setdata(data)
      setloading(false)
    })
  }

  // 组件渲染后自动获取表单数据
  useEffect(() => {
    setloading(true)
    dispatch(getProject()).then(data => {
      setdata(data)
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
        dataSource={data}
        rowKey='projectID'
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          total: data.length,
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true
        }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 275px)' }}
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
