import React, { useState, useEffect, useRef, useContext } from 'react'
import { Finance } from 'financejs'
import { Table, Form, InputNumber, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTable } from './HeaderTable'
import { other2wh, wh2kwh } from '../../utils/unitConverter'
import { updateReportAttributes } from '../../store/action/index'
import './GainTable.scss'
const EditableContext = React.createContext();
const Title = Typography.Title
const Text = Typography.Text
let finance = new Finance();

const EditableRow = ({ index, ...props }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm();
  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  return (
    <Form form={form} component={false} validateMessages={validateMessages}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({title, editable, children, dataIndex, record, handleSave, ...restProps}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) inputRef.current.focus()
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({[dataIndex]: record[dataIndex] || null});
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = <div className="noneditable">{children}</div>

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{margin: 0, width: '100%'}}
        name={dataIndex}
        rules={[{required: true}]}
      >
        <InputNumber
          style={{width: '100%'}}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          min={0}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


export const GainTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)

  const [dataSource, setdataSource] = useState([])

  // 组件渲染后动态更新数据
  useEffect(() => {
    const initDataSource = [
      {
        key: 0,
        series: 0,
        name: t('gain.name.construction'),
        unit: t('gain.unit.price'),
        'cash-in-flow-togrid': 0,
        'cash-in-flow-selfuse': 0,
        'cash-out-flow-togrid': reportData[buildingID].ttl_investment,
        'cash-out-flow-selfuse': reportData[buildingID].ttl_investment,
        'net-cash-flow-togrid': -reportData[buildingID].ttl_investment,
        'net-cash-flow-selfuse': -reportData[buildingID].ttl_investment,
        'acc-net-cash-flow-togrid': -reportData[buildingID].ttl_investment,
        'acc-net-cash-flow-selfuse': -reportData[buildingID].ttl_investment,
      }
    ]
    reportData[buildingID].year25_AC_power.forEach((obj, index) => {
      const yearACInKwh = wh2kwh(other2wh(obj.value, obj.unit))
      const cashInFlowToGrid = Number(
        (yearACInKwh * reportData[buildingID]['final-export-credit']).toFixed(2)
      )
      const cashInFlowSelfUse = Number(
        (yearACInKwh * reportData[buildingID]['rate-of-electricity']).toFixed(2)
      )
      const cashOutFlowToGrid =
        reportData[buildingID].gain ?
        reportData[buildingID].gain[index + 1]['cash-out-flow-togrid'] : 0
      const cashOutFlowSelfUse =
        reportData[buildingID].gain ?
        reportData[buildingID].gain[index + 1]['cash-out-flow-selfuse'] : 0
      const netCashFlowToGrid = Number(
        (cashInFlowToGrid - cashOutFlowToGrid).toFixed(2)
      )
      const netCashFlowSelfUse = Number(
        (cashInFlowSelfUse - cashOutFlowSelfUse).toFixed(2)
      )
      const lastAccNetCashFlowToGrid =
        initDataSource.slice(-1)[0]['acc-net-cash-flow-togrid']
      const lastAccNetCashFlowSelfUse =
        initDataSource.slice(-1)[0]['acc-net-cash-flow-selfuse']
      const newAccNetCashFlowToGrid = Number(
        (lastAccNetCashFlowToGrid + netCashFlowToGrid).toFixed(2)
      )
      const newAccNetCashFlowSelfUse = Number(
        (lastAccNetCashFlowSelfUse + netCashFlowSelfUse).toFixed(2)
      )
      initDataSource.push({
        key: index + 1,
        series: index + 1,
        unit: t('gain.unit.price'),
        name: t('gain.year.prefix') + `${index + 1}` + t('gain.year.suffix'),
        'cash-in-flow-togrid': cashInFlowToGrid,
        'cash-in-flow-selfuse': cashInFlowSelfUse,
        'cash-out-flow-togrid': cashOutFlowToGrid,
        'cash-out-flow-selfuse': cashOutFlowSelfUse,
        'net-cash-flow-togrid': netCashFlowToGrid,
        'net-cash-flow-selfuse': netCashFlowSelfUse,
        'acc-net-cash-flow-togrid': newAccNetCashFlowToGrid,
        'acc-net-cash-flow-selfuse': newAccNetCashFlowSelfUse
      })
    })
    setdataSource(initDataSource)
  }, [buildingID, reportData, t])

  const columns = [
    {
      key: 0,
      title: t('gain.series.three'),
      dataIndex: 'series',
      align: 'center',
      width: '5%',
    }, {
      key: 1,
      title: t('gain.name.investment-gain'),
      dataIndex: 'name',
      align: 'center',
      width: '10%',
    }, {
      key: 2,
      title: t('gain.unit'),
      dataIndex: 'unit',
      align: 'center',
      width: '5%',
    }, {
      key: 3,
      title: t('gain.cash-in-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'cash-in-flow-togrid',
          width: '10%'
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'cash-in-flow-selfuse',
          width: '10%'
        }
      ]
    }, {
      key: 4,
      title: t('gain.cash-out-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'cash-out-flow-togrid',
          width: '10%'
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'cash-out-flow-selfuse',
          width: '10%'
        }
      ]
    }, {
      key: 5,
      title: t('gain.net-cash-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'net-cash-flow-togrid',
          width: '10%'
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'net-cash-flow-selfuse',
          width: '10%'
        }
      ]
    }, {
      key: 6,
      title: t('gain.acc-net-cash-flow'),
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'acc-net-cash-flow-togrid',
          width: '10%'
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'acc-net-cash-flow-selfuse',
          width: '10%'
        }
      ]
    }
  ];
  const formatedColumns = columns.flatMap(col => {
    if (col.children) {
      return {
        ...col,
        children: col.children.map(sub => ({
          ...sub,
          onCell: record => {
            return {
              record,
              editable: col.key === 4 && record.key !== 0,
              dataIndex: sub.dataIndex,
              title: sub.title,
              handleSave: handleSave,
            }
          }
        }))
      }
    } else {
      return col
    }
  });

  // 保存用户输入至表格，并更新其他相关格
  const handleSave = row => {
    const newData = [...dataSource];
    // 寻找更新的row index
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    // 相关值计算
    newData.slice(index,).forEach((record, recordIndex) => {
      const newCashInFlowToGrid = Number(
        (record['cash-in-flow-togrid'] - record['cash-out-flow-togrid']).toFixed(2)
      )
      const newCashInFlowSelfUse = Number(
        (record['cash-in-flow-selfuse'] - record['cash-out-flow-selfuse']).toFixed(2)
      )
      record['net-cash-flow-togrid'] = newCashInFlowToGrid
      record['net-cash-flow-selfuse'] = newCashInFlowSelfUse
      record['acc-net-cash-flow-togrid'] = Number((
        newData[index + recordIndex - 1]['acc-net-cash-flow-togrid'] +
        newCashInFlowToGrid
      ).toFixed(2))
      record['acc-net-cash-flow-selfuse'] = Number((
        newData[index + recordIndex - 1]['acc-net-cash-flow-selfuse'] +
        newCashInFlowSelfUse
      ).toFixed(2))
    })
    dispatch(updateReportAttributes({
      buildingID,
      gain: newData,
    }))
    setdataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // 生成表单头
  const genHeader = () => <HeaderTable buildingID={buildingID}/>

  // 计算回本周期
  const calculatePayback = (dataSource, type) => {
    let dataIndexAccNet = `acc-net-cash-flow-${type}`
    let dataIndexNet = `net-cash-flow-${type}`

    let paybackPeriod = 0
    let paybackAmount = dataSource[paybackPeriod][dataIndexAccNet]
    while(paybackAmount < 0) {
      paybackPeriod += 1
      paybackAmount = dataSource[paybackPeriod][dataIndexAccNet]
    }
    const offset = paybackAmount / dataSource[paybackPeriod][dataIndexNet]
    return Number((paybackPeriod - offset).toFixed(2))
  }

  // 生成表单统计数据
  const genSummary = dataSource => {
    //更新统计数值
    const ttlCashInFlowToGrid = Number(dataSource.reduce((sum, record) =>
      sum + record['cash-in-flow-togrid'], 0
    ).toFixed(2))
    const ttlCashInFlowSelfUse = Number(dataSource.reduce((sum, record) =>
      sum + record['cash-in-flow-selfuse'], 0
    ).toFixed(2))
    const netCashFlowToGrid = dataSource.map(record =>
      record['net-cash-flow-togrid']
    )
    const netCashFlowSelfUse = dataSource.map(record =>
      record['net-cash-flow-selfuse']
    )
    const paybackPeriodToGrid =
      dataSource.length > 0 ? calculatePayback(dataSource, 'togrid') : 0
    const paybackPeriodSelfUse =
      dataSource.length > 0 ? calculatePayback(dataSource, 'selfuse') : 0
    const paybackPeriodAvg = Number(
      ((paybackPeriodToGrid + paybackPeriodSelfUse)/2).toFixed(2)
    )
    return (
      <>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell rowSpan={2} colSpan={2}>
            <Text strong>{t('gain.cash-in-flow.25year')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell rowSpan={2}>
            <Text strong>{t('gain.unit.price')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.togrid')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{ttlCashInFlowToGrid}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.selfuse')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{ttlCashInFlowSelfUse}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell rowSpan={2} colSpan={2}>
            <Text strong>{t('gain.cash-in-flow.irr')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell rowSpan={2} />
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.togrid')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>
              {
                netCashFlowToGrid.length > 0 && netCashFlowToGrid.every(val => !isNaN(val)) ?
                finance.IRR(...netCashFlowToGrid) : 0
              }
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.selfuse')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>
              {
                netCashFlowSelfUse.length > 0 && netCashFlowSelfUse.every(val => !isNaN(val))?
                finance.IRR(...netCashFlowSelfUse) : 0
              }
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell rowSpan={3} colSpan={2}>
            <Text strong>{t('gain.payback-period')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell rowSpan={3} >
            <Text strong>{t('gain.unit.year')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.togrid')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{paybackPeriodToGrid}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.selfuse')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{paybackPeriodSelfUse}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{t('gain.average')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2}>
            <Text strong>{paybackPeriodAvg}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  }

  return (
    <Card
      title={
        <Title className='cardTitle' level={4}>
          {projectData.projectTitle + t('gain.title')}
        </Title>
      }
      headStyle={{textAlign: 'center'}}
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
