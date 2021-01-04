import React, { useState, useEffect } from 'react'
import { Card, Button, Table, Badge, Divider, Popconfirm, message } from 'antd'
import { SyncOutlined, SearchOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { CreateModal } from './Modal'
import styles from './index.module.scss'
import { WeatherPortfolio } from '../../@types'
import { deleteWeatherPortfolio, getWeatherPortfolio } from '../../services'
import { ColumnsType } from 'antd/lib/table'
import { SearchString } from '../../components/Table/TableColFilters/TableColSearch'
import { useHistory } from 'react-router-dom'

const WeatherManager = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [showModal, setshowModal] = useState(false)
  const [portfolios, setportfolios] = useState<WeatherPortfolio[]>([])
  const [loading, setloading] = useState(false)

  useEffect(() => {
    setloading(true)
    getWeatherPortfolio({}).then(res => {
      setloading(false)
      setportfolios(res)
    })
  }, [])

  const onDelete = (record: WeatherPortfolio) => {
    setloading(true)
    deleteWeatherPortfolio({ portfolioID: record.portfolioID })
      .then(() => {
        message.success(t('project.success.deleteProject'))
        getWeatherPortfolio({}).then(data => {
          setportfolios(data)
          setloading(false)
        })
      })
      .catch(() => setloading(false))
  }

  const tableCols: ColumnsType<WeatherPortfolio> = [
    {
      title: t('weatherManager.portfolio.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: WeatherPortfolio, b: WeatherPortfolio) => a.name.localeCompare(b.name),
      fixed: 'left',
      ...SearchString('name'),
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toString().toLowerCase()),
      render: (value: string, record: WeatherPortfolio) => (
        <Button type='link' onClick={() => history.push(`/weather/${record.portfolioID}`)}>
          {value}
        </Button>
      ),
    },
    {
      title: t('weatherManager.portfolio.address'),
      dataIndex: 'address',
      key: 'address',
      sorter: (a: WeatherPortfolio, b: WeatherPortfolio) => a.address.localeCompare(b.address),
      ...SearchString('address'),
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.address.toString().toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: t('weatherManager.portfolio.meteonorm'),
      dataIndex: 'meteonorm_src',
      key: 'meteonorm_src',
      render: (val: string | null) =>
        val ? (
          <Badge status='success' text={t('weatherManager.portfolio.src.yes')} />
        ) : (
          <Badge status='default' text={t('weatherManager.portfolio.src.no')} />
        ),
    },
    {
      title: t('weatherManager.portfolio.nasa'),
      dataIndex: 'nasa_src',
      key: 'nasa_src',
      render: (val: string | null) =>
        val ? (
          <Badge status='success' text={t('weatherManager.portfolio.src.yes')} />
        ) : (
          <Badge status='default' text={t('weatherManager.portfolio.src.no')} />
        ),
    },
    {
      title: t('weatherManager.portfolio.custom'),
      dataIndex: 'custom_src',
      key: 'custom_src',
      render: (val: string | null) =>
        val ? (
          <Badge status='success' text={t('weatherManager.portfolio.src.yes')} />
        ) : (
          <Badge status='default' text={t('weatherManager.portfolio.src.no')} />
        ),
    },
    {
      title: t('table.action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (value: void, record: WeatherPortfolio) => (
        <div>
          <Button
            type='link'
            icon={<FileTextOutlined />}
            onClick={() => history.push(`/weather/${record.portfolioID}`)}
          />
          <Divider type='vertical' />
          <Popconfirm
            title={t('warning.delete')}
            onConfirm={() => onDelete(record)}
            onCancel={() => {
              return
            }}
            okText={t('action.confirm')}
            cancelText={t('action.cancel')}
            placement='topRight'
          >
            <Button type='link' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Card bodyStyle={{ padding: '20px 12px' }}>
      <Button
        className={styles.leftBut}
        type='primary'
        size='large'
        onClick={() => setshowModal(true)}
      >
        {t('weatherManager.add')}
      </Button>
      <Button
        className={styles.rightBut}
        shape='circle'
        icon={<SyncOutlined />}
        onClick={() => {
          setloading(true)
          getWeatherPortfolio({}).then(res => {
            setloading(false)
            setportfolios(res)
          })
        }}
      />
      <Table
        columns={tableCols}
        loading={loading}
        dataSource={portfolios}
        rowKey='portfolioID'
        pagination={{
          position: ['bottomCenter'],
          showTotal: total => `${total}` + t('table.totalCount'),
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content' }}
      />
      <CreateModal
        showModal={showModal}
        setshowModal={setshowModal}
        afterClose={() => {
          setloading(true)
          getWeatherPortfolio({}).then(res => {
            setloading(false)
            setportfolios(res)
          })
        }}
      />
    </Card>
  )
}

export default WeatherManager
