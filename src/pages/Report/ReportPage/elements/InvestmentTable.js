import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import './InvestmentTable.module.scss'
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
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
    form.setFieldsValue({[dataIndex]: record[dataIndex]});
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

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export const InvestmentTable = ({ buildingIndex }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const pvData = useSelector(state => state.pv).data
  const inverterData = useSelector(state => state.inverter).data

  const buildingData = projectData.buildings[buildingIndex]
  const allPVID = buildingData.data.map(spec =>
    pvData.find(pv => pv.pvID === spec.pv_panel_parameters.pv_model.pvID).name
  )
  console.log(allPVID)

  const [dataSource, setdataSource] = useState(
    [
      {
        key: 0,
        series: t('investment.series.one'),
        name: t('investment.name.costList'),
      },{
        key: 1,
        series: 1,
        name: t('investment.name.pv'),
        unit: t('investment.unit.kuai'),
        unitPriceEditable: true
      },{
        key: 2,
        series: 2,
        name: t('investment.name.rack'),
        description: t('investment.description.rack'),
        unit: t('investment.unit.price/W'),
        unitPriceEditable: true
      },{
        key: 3,
        series: 3,
        name: t('investment.name.inverter'),
        unit: t('investment.unit.tai'),
        unitPriceEditable: true
      },{
        key: 4,
        series: 4,
        name: t('investment.name.combibox'),
        unit: t('investment.unit.tai'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 5,
        series: 5,
        name: t('investment.name.meter'),
        unit: t('investment.unit.kuai'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 6,
        series: 6,
        name: t('investment.name.router'),
        unit: t('investment.unit.tao'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 7,
        series: 7,
        name: t('investment.name.comm'),
        unit: t('investment.unit.tai'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 8,
        series: 8,
        name: t('investment.name.dc_wiring'),
        unit: 'm',
        unitPriceEditable: true
      },{
        key: 9,
        series: 9,
        name: t('investment.name.ac_wiring'),
        unit: 'm',
        unitPriceEditable: true
      },{
        key: 10,
        series: 10,
        name: t('investment.name.combibox_wiring'),
        unit: 'm',
        unitPriceEditable: true
      },{
        key: 11,
        series: 11,
        name: t('investment.name.rooftop'),
        unit: t('investment.unit.xiang'),
        quantity: 1,
        totalPriceEditable: true
      },{
        key: 12,
        series: 12,
        name: t('investment.name.other'),
        unit: t('investment.unit.xiang'),
        quantity: 1,
        totalPriceEditable: true
      }
    ]
  )

  const handleSave = row => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setdataSource(newData);
  };

  const columns = [
    {
      title: t('investment.series'),
      dataIndex: 'series',
    },{
      title: t('investment.name'),
      dataIndex: 'name',
    },{
      title: t('investment.description'),
      dataIndex: 'description',
    },{
      title: t('investment.unit'),
      dataIndex: 'unit',
    },{
      title: t('investment.quantity'),
      dataIndex: 'quantity',
    },{
      title: t('investment.unitPrice'),
      dataIndex: 'unitPrice',
    },{
      title: t('investment.totalPrice'),
      dataIndex: 'totalPrice',
    },{
      title: t('investment.investmentWeight'),
      dataIndex: 'investmentWeight',
    },
  ]

  const formatedColumns = columns.map(col => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={formatedColumns}
      pagination={false}
      size='middle'
    />
  )
}
