import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, Input, InputNumber, Card, Descriptions, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTable } from './HeaderTable'
import { other2wh } from '../../utils/unitConverter'
import './GainTable.scss'
const EditableContext = React.createContext();
const Item = Descriptions.Item
const Title = Typography.Title

export const GainTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  console.log(reportData[buildingID])

  const dataSource = [
    {
      key: 1,
      series: 0,
      name: t('gain.name.construction'),
      unit: t('gain.unit.price'),
      'cash-in-flow-all-in': 0,
      'cash-in-flow-hold': 0,
      'cash-out-flow-all-in': reportData[buildingID].ttl_investment,
      'cash-out-flow-hold': reportData[buildingID].ttl_investment,
      'net-cash-flow-all-in': -reportData[buildingID].ttl_investment,
      'net-cash-flow-hold': -reportData[buildingID].ttl_investment,
      'acc-net-cash-flow-all-in': -reportData[buildingID].ttl_investment,
      'acc-net-cash-flow-hold': -reportData[buildingID].ttl_investment,
    }
  ]
  reportData[buildingID].year25_AC_power.forEach(obj => {
    
  })


  const columns = [
    {
      title: t('gain.series.three'),
      dataIndex: 'series',
      width: '5%',
    }, {
      title: t('gain.name.investment-gain'),
      dataIndex: 'name',
      width: '10%',
    }, {
      title: t('gain.unit'),
      dataIndex: 'unit',
      width: '5%',
    }, {
      title: t('gain.cash-in-flow'),
      children: [
        {
          title: t('gain.all-in'),
          dataIndex: 'cash-in-flow-all-in',
          width: '10%'
        }, {
          title: t('gain.hold'),
          dataIndex: 'cash-in-flow-hold',
          width: '10%'
        }
      ]
    }, {
      title: t('gain.cash-out-flow'),
      children: [
        {
          title: t('gain.all-in'),
          dataIndex: 'cash-out-flow-all-in',
          width: '10%'
        }, {
          title: t('gain.hold'),
          dataIndex: 'cash-out-flow-hold',
          width: '10%'
        }
      ]
    }, {
      title: t('gain.net-cash-flow'),
      children: [
        {
          title: t('gain.all-in'),
          dataIndex: 'net-cash-flow-all-in',
          width: '10%'
        }, {
          title: t('gain.hold'),
          dataIndex: 'net-cash-flow-hold',
          width: '10%'
        }
      ]
    }, {
      title: t('gain.acc-net-cash-flow'),
      children: [
        {
          title: t('gain.all-in'),
          dataIndex: 'acc-net-cash-flow-all-in',
          width: '10%'
        }, {
          title: t('gain.hold'),
          dataIndex: 'acc-net-cash-flow-hold',
          width: '10%'
        }
      ]
    }
  ];


  // 生成表单头
  const genHeader = () => <HeaderTable buildingID={buildingID}/>

  return (
    <Card
      title={
        <Title
          className='cardTitle'
          level={4}
        >
          {projectData.projectTitle + t('gain.title')}
        </Title>
      }
      headStyle={{textAlign: 'center'}}
    >
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size='middle'
        title={genHeader}
      />
    </Card>
  )
}
