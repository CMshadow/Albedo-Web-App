import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, Input, InputNumber, Card, Descriptions, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderTable } from './HeaderTable'
import { other2wh, wh2kwh } from '../../utils/unitConverter'
import './GainTable.scss'
const EditableContext = React.createContext();
const Title = Typography.Title

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
  console.log(editable)

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
        className={record[dataIndex] ? "editable-cell-wrap" : "editable-cell-wrap-empty"}
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
    const lastAccNetCashFlowToGrid =
      initDataSource.slice(-1)[0]['acc-net-cash-flow-togrid']
    const lastAccNetCashFlowSelfUse =
      initDataSource.slice(-1)[0]['acc-net-cash-flow-selfuse']
    const newAccNetCashFlowToGrid = Number(
      (lastAccNetCashFlowToGrid + cashInFlowToGrid).toFixed(2)
    )
    const newAccNetCashFlowSelfUse = Number(
      (lastAccNetCashFlowSelfUse + cashInFlowSelfUse).toFixed(2)
    )
    initDataSource.push({
      key: index + 1,
      series: index + 1,
      unit: t('gain.unit.price'),
      name: t('gain.year.prefix') + `${index + 1}` + t('gain.year.suffix'),
      'cash-in-flow-togrid': cashInFlowToGrid,
      'cash-in-flow-selfuse': cashInFlowSelfUse,
      'cash-out-flow-togrid': 0,
      'cash-out-flow-selfuse': 0,
      'net-cash-flow-togrid': cashInFlowToGrid,
      'net-cash-flow-selfuse': cashInFlowSelfUse,
      'acc-net-cash-flow-togrid': newAccNetCashFlowToGrid,
      'acc-net-cash-flow-selfuse': newAccNetCashFlowSelfUse
    })
  })

  const [dataSource, setdataSource] = useState(initDataSource)

  const columns = [
    {
      key: 0,
      title: t('gain.series.three'),
      dataIndex: 'series',
      width: '5%',
    }, {
      key: 1,
      title: t('gain.name.investment-gain'),
      dataIndex: 'name',
      width: '10%',
    }, {
      key: 2,
      title: t('gain.unit'),
      dataIndex: 'unit',
      width: '5%',
    }, {
      key: 3,
      title: t('gain.cash-in-flow'),
      width: '20%',
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'cash-in-flow-togrid',
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'cash-in-flow-selfuse',
        }
      ]
    }, {
      key: 4,
      title: t('gain.cash-out-flow'),
      width: '20%',
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'cash-out-flow-togrid',
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'cash-out-flow-selfuse',
        }
      ]
    }, {
      key: 5,
      title: t('gain.net-cash-flow'),
      width: '20%',
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'net-cash-flow-togrid',
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'net-cash-flow-selfuse',
        }
      ]
    }, {
      key: 6,
      title: t('gain.acc-net-cash-flow'),
      width: '20%',
      children: [
        {
          title: t('gain.togrid'),
          dataIndex: 'acc-net-cash-flow-togrid',
        }, {
          title: t('gain.selfuse'),
          dataIndex: 'acc-net-cash-flow-selfuse',
        }
      ]
    }
  ];
  const formatedColumns = columns.map(col => {
    console.log(col.key === 4)
    return({
    ...col,
    onCell: record => ({
      record,
      editable: col.key === 4,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave: handleSave,
    })
  })});

  // 保存用户输入至表格，并更新其他相关格
  const handleSave = row => {
    console.log(row)
    const newData = [...dataSource];
    // 寻找更新的row index
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setdataSource(newData);
    // dispatch(updateReportAttributes({
    //   buildingID,
    //   [updateAttribute]: row.total,
    //   'final-export-credit': newData[2].total
    // }))
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

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
        components={components}
        bordered
        dataSource={dataSource}
        columns={formatedColumns}
        pagination={false}
        size='middle'
        title={genHeader}
      />
    </Card>
  )
}
