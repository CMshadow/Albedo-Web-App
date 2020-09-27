import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { TableHeadDescription } from '../../Descriptions/TableHeadDescription'
import { updateReportAttributes } from '../../../store/action/index'
import './GainTable.scss'
const EditableContext = React.createContext();


const EditableRow = ({ index, ...props }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
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
        className={record[dataIndex] >= 0 ? "editable-cell-wrap" : "editable-cell-wrap-empty"}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


export const HeaderTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const reportData = useSelector(state => state.report)

  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    console.log('useEffect')
    setdataSource([
      {
        key: 1,
        series: t('gain.series.one'),
        name: t('gain.name.feed-in-tariff'),
        unit: t('gain.unit.price/kwh'),
        description: t('gain.description.feed-in-tariff'),
        total: reportData[buildingID]['feed-in-tariff']
      },{
        key: 2,
        series: t('gain.series.two'),
        name: t('gain.name.rate-of-electricity'),
        unit: t('gain.unit.price/kwh'),
        description: t('gain.description.export-credit'),
        total: reportData[buildingID]['export-credit']
      },{
        key: 3,
        series: t('gain.series.two'),
        name: t('gain.name.rate-of-electricity'),
        unit: t('gain.unit.price/kwh'),
        description: t('gain.description.final-export-credit'),
        total: reportData[buildingID]['final-export-credit']
      },{
        key: 4,
        series: t('gain.series.two'),
        name: t('gain.name.rate-of-electricity'),
        unit: t('gain.unit.price/kwh'),
        description: t('gain.description.rate-of-electricity'),
        total: reportData[buildingID]['rate-of-electricity']
      }
    ])
  }, [buildingID, reportData, t])

  const columns = [
    {
      title: t('gain.series'),
      dataIndex: 'series',
      align: 'center',
      width: '5%',
      render: (value, row, index) => {
        const obj = { children: value, props: {} };
        if (index === 1) obj.props.rowSpan = 3
        if (index > 1) obj.props.rowSpan = 0
        return obj
      },
    }, {
      title: t('gain.name'),
      dataIndex: 'name',
      align: 'center',
      width: '10%',
      render: (value, row, index) => {
        const obj = { children: value, props: {} };
        if (index === 1) obj.props.rowSpan = 3
        if (index > 1) obj.props.rowSpan = 0
        return obj
      },
    }, {
      title: t('gain.unit'),
      dataIndex: 'unit',
      align: 'center',
      width: '5%',
      render: (value, row, index) => {
        const obj = { children: value, props: {} };
        if (index === 0) obj.props.rowSpan = 4
        if (index > 0) obj.props.rowSpan = 0
        return obj
      },
    }, {
      title: t('gain.description'),
      dataIndex: 'description',
      align: 'center',
      width: '20%'
    }, {
      title: t('gain.total'),
      dataIndex: 'total',
      align: 'center',
      width: '10%'
    }, {
      width: '50%'
    }
  ];
  const formatedColumns = columns.map(col => ({
    ...col,
    onCell: record => ({
      record,
      editable: col.dataIndex === 'total' && record.key !== 3, // 除最终上网电价都可以修改
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave: handleSave,
    })
  }));

  // 保存用户输入至表格，并更新其他相关格
  const handleSave = row => {
    const newData = [...dataSource];
    // 寻找更新的row index
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    let updateAttribute
    switch (row.key) {
      case 1:
        updateAttribute = 'feed-in-tariff'
        break
      case 2:
        updateAttribute = 'export-credit'
        break
      case 4:
      default:
        updateAttribute = 'rate-of-electricity'
    }
    newData[2].total = Number((newData[0].total + newData[1].total).toFixed(2))
    setdataSource(newData);
    dispatch(updateReportAttributes({
      buildingID,
      [updateAttribute]: row.total,
      'final-export-credit': newData[2].total
    }))
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // 生成表单头
  const genHeader = () => <TableHeadDescription buildingID={buildingID}/>

  return (
    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={formatedColumns}
      pagination={false}
      size='middle'
      title={genHeader}
    />
  )
}
