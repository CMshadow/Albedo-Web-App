import React, { useState, useEffect, useContext, useRef } from 'react'
import { Finance } from 'financejs'
import { Table, Form, InputNumber, Card, Typography, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTable } from './HeaderTable'
import { createGainData } from '../../../utils/createGainData'
import { updateReportAttributes } from '../../../store/action/index'
import './GainTable.scss'
import { FormInstance } from 'antd/lib/form'
import { GainEntry, RootState } from '../../../@types'
import { ColumnsType } from 'antd/lib/table'
const EditableContext = React.createContext<FormInstance | undefined>(undefined)
const Title = Typography.Title
const Text = Typography.Text
const finance = new Finance()

const EditableRow = (row: GainEntry) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...row} />
      </EditableContext.Provider>
    </Form>
  )
}

type EditableCellProps = {
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof GainEntry | undefined
  record: GainEntry
  handleSave: (p: GainEntry) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<Input>(null)
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) inputRef.current && inputRef.current.focus()
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    if (dataIndex) form?.setFieldsValue({ [dataIndex]: record[dataIndex] || null })
  }

  const save = async () => {
    try {
      const values = (await form?.validateFields()) || {}
      const formatedValues: { [key: string]: number } = {}
      Object.keys(values).forEach(key => {
        formatedValues[key] = Math.abs(values[key])
      })
      toggleEdit()
      handleSave({ ...record, ...formatedValues })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = <div className='noneditable'>{children}</div>

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0, width: '100%' }} name={dataIndex} rules={[{ required: true }]}>
        <InputNumber
          ref={inputRef}
          style={{ width: '100%' }}
          onPressEnter={save}
          onBlur={save}
          min={0}
        />
      </Form.Item>
    ) : (
      <div className='editable-cell-wrap' onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export const GainTable: React.FC<{ buildingID: string }> = ({ buildingID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const reportData = useSelector((state: RootState) => state.report)

  const [dataSource, setdataSource] = useState(createGainData(reportData[buildingID]))

  // 组件渲染后动态更新数据
  useEffect(() => {
    const initDataSource = createGainData(reportData[buildingID])
    setdataSource(initDataSource)
  }, [buildingID, reportData, t])

  const columns: ColumnsType<GainEntry> = [
    {
      key: '0',
      title: t('gain.series.three'),
      dataIndex: 'series',
      align: 'center',
      width: '5%',
    },
    {
      key: '1',
      title: t('gain.name.investment-gain'),
      dataIndex: 'name',
      align: 'center',
      width: '10%',
      render: text =>
        text === 'construction'
          ? t('gain.name.construction')
          : t('gain.year.prefix') + text + t('gain.year.suffix'),
    },
    {
      key: '2',
      title: t('gain.unit'),
      dataIndex: 'unit',
      align: 'center',
      width: '5%',
      render: text => t(`gain.unit.${text}`),
    },
    {
      key: '3',
      title: t('gain.cash-in-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'cash-in-flow-togrid',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
        {
          title: t('gain.selfuse'),
          dataIndex: 'cash-in-flow-selfuse',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
      ],
    },
    {
      key: '4',
      title: t('gain.cash-out-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'cash-out-flow-togrid',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
        {
          title: t('gain.selfuse'),
          dataIndex: 'cash-out-flow-selfuse',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
      ],
    },
    {
      key: '5',
      title: t('gain.net-cash-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'net-cash-flow-togrid',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
        {
          title: t('gain.selfuse'),
          dataIndex: 'net-cash-flow-selfuse',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
      ],
    },
    {
      key: '6',
      title: t('gain.acc-net-cash-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'acc-net-cash-flow-togrid',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
        {
          title: t('gain.selfuse'),
          dataIndex: 'acc-net-cash-flow-selfuse',
          width: '10%',
          render: text => (text !== undefined ? text.toLocaleString() : null),
        },
      ],
    },
  ]
  const formatedColumns = columns.flatMap(col => {
    if ('children' in col) {
      return {
        ...col,
        children: col.children.map(sub => ({
          ...sub,
          onCell: (record: GainEntry) => {
            return {
              record,
              editable: col.key === '4' && record.key !== '0',
              dataIndex: 'dataIndex' in sub ? sub.dataIndex : undefined,
              title: sub.title,
              handleSave: handleSave,
            } as React.HTMLAttributes<HTMLElement>
          },
        })),
      }
    } else {
      return col
    }
  })

  // 保存用户输入至表格，并更新其他相关格
  const handleSave = (row: GainEntry) => {
    const newData = [...dataSource]
    // 寻找更新的row index
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    // 相关值计算
    newData.slice(index).forEach((record, recordIndex) => {
      const newCashInFlowToGrid = Number(
        ((record['cash-in-flow-togrid'] || 0) - (record['cash-out-flow-togrid'] || 0)).toFixed(2)
      )
      const newCashInFlowSelfUse = Number(
        ((record['cash-in-flow-selfuse'] || 0) - (record['cash-out-flow-selfuse'] || 0)).toFixed(2)
      )
      record['net-cash-flow-togrid'] = newCashInFlowToGrid
      record['net-cash-flow-selfuse'] = newCashInFlowSelfUse
      record['acc-net-cash-flow-togrid'] = Number(
        (
          (newData[index + recordIndex - 1]['acc-net-cash-flow-togrid'] || 0) + newCashInFlowToGrid
        ).toFixed(2)
      )
      record['acc-net-cash-flow-selfuse'] = Number(
        (
          (newData[index + recordIndex - 1]['acc-net-cash-flow-selfuse'] || 0) +
          newCashInFlowSelfUse
        ).toFixed(2)
      )
    })
    dispatch(
      updateReportAttributes({
        buildingID,
        gain: newData,
      })
    )
    setdataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  // 生成表单头
  const genHeader = () => <HeaderTable buildingID={buildingID} />

  // 计算回本周期
  const calculatePayback = (dataSource: GainEntry[], type: 'selfuse' | 'togrid') => {
    const dataIndexAccNet = `acc-net-cash-flow-${type}` as const
    const dataIndexNet = `net-cash-flow-${type}` as const

    let paybackPeriod = 0
    let paybackAmount = dataSource[paybackPeriod][dataIndexAccNet] || 0
    while (paybackAmount < 0 && paybackPeriod < dataSource.length - 1) {
      paybackPeriod += 1
      paybackAmount = dataSource[paybackPeriod][dataIndexAccNet] || 0
    }
    if (paybackAmount >= 0) {
      const offset = paybackAmount / (dataSource[paybackPeriod][dataIndexNet] || 0)
      return Number((paybackPeriod - offset).toFixed(2))
    } else {
      return t('gain.cannot-payback').toString()
    }
  }

  // 生成表单统计数据
  const genSummary = (dataSource: GainEntry[]) => {
    //更新统计数值
    const ttlCashInFlowToGrid = Number(
      dataSource.reduce((sum, record) => sum + (record['cash-in-flow-togrid'] || 0), 0).toFixed(2)
    )
    const ttlCashInFlowSelfUse = Number(
      dataSource.reduce((sum, record) => sum + (record['cash-in-flow-selfuse'] || 0), 0).toFixed(2)
    )
    const netCashFlowToGrid = dataSource
      .map(record => record['net-cash-flow-togrid'])
      .filter((num): num is number => num !== undefined)
    const netCashFlowSelfUse = dataSource
      .map(record => record['net-cash-flow-selfuse'])
      .filter((num): num is number => num !== undefined)
    const paybackPeriodToGrid = dataSource.length > 0 ? calculatePayback(dataSource, 'togrid') : 0
    const paybackPeriodSelfUse = dataSource.length > 0 ? calculatePayback(dataSource, 'selfuse') : 0
    const paybackPeriodAvg =
      typeof paybackPeriodToGrid === 'number' && typeof paybackPeriodSelfUse === 'number'
        ? Number(((paybackPeriodToGrid + paybackPeriodSelfUse) / 2).toFixed(2))
        : paybackPeriodToGrid
    let irrToGrid = NaN
    try {
      irrToGrid = finance.IRR(netCashFlowToGrid[0], ...netCashFlowToGrid.slice(1))
    } catch (e) {
      console.log(e)
    }
    let irrSelfUse = NaN
    try {
      irrSelfUse = finance.IRR(netCashFlowSelfUse[0], ...netCashFlowSelfUse.slice(1))
    } catch (e) {
      console.log(e)
    }
    return (
      <>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell rowSpan={2} colSpan={2} index={0}>
            <Text strong>{t('gain.cash-in-flow.25year')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell rowSpan={2} index={1}>
            <Text strong>{t('gain.unit.price')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={2}>
            <Text strong>{t('gain.togrid')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={3}>
            <Text strong>{ttlCashInFlowToGrid.toLocaleString()}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2} index={4}>
            <Text strong>{t('gain.selfuse')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={5}>
            <Text strong>{ttlCashInFlowSelfUse.toLocaleString()}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell rowSpan={2} colSpan={2} index={6}>
            <Text strong>{t('gain.cash-in-flow.irr')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell rowSpan={2} index={7}>
            %
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={8}>
            <Text strong>{t('gain.togrid')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={9}>
            <Text strong>{irrToGrid}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2} index={10}>
            <Text strong>{t('gain.selfuse')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={11}>
            <Text strong>{irrSelfUse}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell rowSpan={3} colSpan={2} index={12}>
            <Text strong>{t('gain.payback-period')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell rowSpan={3} index={13}>
            <Text strong>{t('gain.unit.year')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={14}>
            <Text strong>{t('gain.togrid')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={15}>
            <Text strong>{paybackPeriodToGrid}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2} index={16}>
            <Text strong>{t('gain.selfuse')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={17}>
            <Text strong>{paybackPeriodSelfUse}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2} index={18}>
            <Text strong>{t('gain.average')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} index={19}>
            <Text strong>{paybackPeriodAvg}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('gain.title')}
        </Title>
      }
      hoverable
      className='card'
    >
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={formatedColumns}
        pagination={false}
        size='middle'
        title={genHeader}
        summary={genSummary}
      />
    </Card>
  )
}
