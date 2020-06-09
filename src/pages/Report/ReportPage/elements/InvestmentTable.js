import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, Input, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import './InvestmentTable.scss'
const EditableContext = React.createContext();

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

  let childNode = children;

  if (editable) {
    let inputField
    switch (dataIndex) {
      case 'unitPrice':
        inputField = <InputNumber style={{width: '100%'}} ref={inputRef} onPressEnter={save} onBlur={save} />
        break
      default:
        inputField = <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    }
    childNode = editing ? (
      <Form.Item
        style={{margin: 0}}
        name={dataIndex}
        rules={[{required: true}]}
      >
        {inputField}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const reduceUnique = data => {
  return data.reduce((acc, val) => {
    Object.keys(acc).includes(val.name) ?
    acc[val.name] += val.count :
    acc[val.name] = val.count
    return acc
  }, {})
}

export const InvestmentTable = ({ buildingIndex }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const pvData = useSelector(state => state.pv).data
  const inverterData = useSelector(state => state.inverter).data

  const buildingData = projectData.buildings[buildingIndex]
  // 统计每种用到的组件型号及数量
  const pvCount = buildingData.data.map(spec => ({
    name: pvData.find(pv =>
      pv.pvID === spec.pv_panel_parameters.pv_model.pvID
    ).name,
    count: spec.inverter_wiring.reduce((acc, val) => {
      acc += val.string_per_inverter * val.panels_per_string
      return acc
    }, 0)
  }))
  const uniquePVCount = reduceUnique(pvCount)
  // 统计每种用到的逆变器型号及数量
  const inverterCount = buildingData.data.flatMap(spec =>
    spec.inverter_wiring.map(inverterSpec => ({
      name: inverterData.find(inverter =>
        inverter.inverterID === inverterSpec.inverter_model.inverterID
      ).name,
      count: 1
    }))
  )
  const uniqueInverterCount = reduceUnique(inverterCount)
  // 统计DC线长
  const DCWiringLen = buildingData.data.reduce((acc1, spec) =>
    acc1 += spec.inverter_wiring.reduce((acc2, inverterSpec) =>
      acc2 += inverterSpec.dc_cable_len.reduce((acc3, len) => acc3 += len, 0)
    , 0)
  , 0)
  // 统计AC线长
  const ACWiringLen = buildingData.data.reduce((acc1, spec) =>
    acc1 += spec.inverter_wiring.reduce((acc2, inverterSpec) =>
      acc2 += inverterSpec.ac_cable_len
    , 0)
  , 0)

  // 生成表格数据
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
      },
      ...Object.keys(uniquePVCount).map((pvName, index) => ({
        key: `1.1.${index + 1}`,
        description: pvName,
        unit: t('investment.unit.kuai'),
        quantity: uniquePVCount[pvName],
        unitPriceEditable: true
      })),{
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
      },
      ...Object.keys(uniqueInverterCount).map((inverterName, index) => ({
        key: `1.2.${index + 1}`,
        description: inverterName,
        unit: t('investment.unit.tai'),
        quantity: uniqueInverterCount[inverterName],
        unitPriceEditable: true
      })),{
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
        quantity: DCWiringLen,
        unitPriceEditable: true
      },{
        key: 9,
        series: 9,
        name: t('investment.name.ac_wiring'),
        unit: 'm',
        quantity: ACWiringLen,
        unitPriceEditable: true
      },{
        key: 10,
        series: 10,
        name: t('investment.name.combibox_wiring'),
        unit: 'm',
        quantity: buildingData.combibox_cable_len,
        unitPriceEditable: true
      },{
        key: 11,
        series: 11,
        name: t('investment.name.rooftop'),
        description: t('investment.description.rooftop'),
        unit: t('investment.unit.xiang'),
        quantity: 1,
        totalPriceEditable: true
      },{
        key: 12,
        series: 12,
        name: t('investment.name.other'),
        description: t('investment.description.other'),
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
    if (row.unitPrice && row.quantity) {
      row.totalPrice = row.unitPrice * row.quantity
    }
    newData.splice(index, 1, { ...item, ...row });
    setdataSource(newData);
  };

  const disabledRowSeries = [t('investment.series.one'), 1, 3]
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
      editable: true,
      render: (text, row, index) => {
        if (disabledRowSeries.includes(row.series)) {
          return {
            children: text,
            props: {colSpan: 6}
          };
        }
        return text
      },
    },{
      title: t('investment.unit'),
      dataIndex: 'unit',
      editable: true,
      render: (text, row, index) => {
        if (disabledRowSeries.includes(row.series)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        return text
      },
    },{
      title: t('investment.quantity'),
      dataIndex: 'quantity',
      editable: true,
      render: (text, row, index) => {
        if (disabledRowSeries.includes(row.series)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        return text
      },
    },{
      title: t('investment.unitPrice'),
      dataIndex: 'unitPrice',
      editable: true,
      width: '70px',
      render: (text, row, index) => {
        if (disabledRowSeries.includes(row.series)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        return text
      },
    },{
      title: t('investment.totalPrice'),
      dataIndex: 'totalPrice',
      render: (text, row, index) => {
        if (disabledRowSeries.includes(row.series)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        return text
      },
    },{
      title: t('investment.investmentWeight'),
      dataIndex: 'investmentWeight',
      render: (text, row, index) => {
        if (disabledRowSeries.includes(row.series)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        return text
      },
    },
  ]

  const formatedColumns = columns.map(col => {
    if (!col.editable) return col
    return {
      ...col,
      onCell: record => {
        let editable
        switch (col.dataIndex) {
          case 'description':
            editable = record.descriptionEditable
            break
          case 'unitPrice':
            editable = record.unitPriceEditable
            break
          case 'totalPrice':
            editable = record.totalPriceEditable
            break
          default:
            editable = false
            break
        }
        return ({
          record,
          editable: editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        })
      }
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
