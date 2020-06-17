import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Form, Input, InputNumber, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { TableHeadDescription } from '../Descriptions/TableHeadDescription'
import { other2w, w2other } from '../../utils/unitConverter'
import { updateReportAttributes } from '../../store/action/index'
import './InvestmentTable.scss'
const EditableContext = React.createContext();
const Title = Typography.Title
const Text = Typography.Text

const EditableRow = ({ index, ...props }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm();
  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required'),
    min: t('form.min.0')
  };

  return (
    <Form form={form} component={false} validateMessages={validateMessages} >
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
      if (values.unitPrice < 0) values.unitPrice = 0
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
        inputField =
          <InputNumber
            style={{width: '100%'}}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            min={0}
          />
        break
      default:
        inputField = <Input style={{width: '100%'}} ref={inputRef} onPressEnter={save} onBlur={save} />
    }
    childNode = editing ? (
      <Form.Item
        style={{margin: 0, width: '100%'}}
        name={dataIndex}
        rules={[{required: true}]}
      >
        {inputField}
      </Form.Item>
    ) : (
      <div
        className={record[dataIndex] !== undefined ? "editable-cell-wrap" : "editable-cell-wrap-empty"}
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

export const InvestmentTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)
  const pvData = useSelector(state => state.pv).data
  const inverterData = useSelector(state => state.inverter).data
  const reportData = useSelector(state => state.report)

  const buildingData = projectData.buildings.find(building =>
    building.buildingID === buildingID
  )
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
  // 统计每种用到的DC线型号及线长
  const DCLength = buildingData.data.flatMap((spec, specIndex) =>
    spec.inverter_wiring.flatMap((inverterSpec, inverterSpecIndex) =>
      inverterSpec.dc_cable_len.map((len, lenIndex) => ({
        name: `${reportData[buildingID].setup_dc_wir_choice[specIndex][inverterSpecIndex][lenIndex]} (DC)`,
        count: len
      }))
    )
  )
  const uniqueDCLength = reduceUnique(DCLength)
  // 统计每种用到的AC线型号及线长
  const ACLength = buildingData.data.flatMap((spec, specIndex) =>
    spec.inverter_wiring.flatMap((inverterSpec, inverterSpecIndex) => ({
      name: `${reportData[buildingID].setup_ac_wir_choice[specIndex][inverterSpecIndex]} (AC)`,
      count: inverterSpec.ac_cable_len
    }))
  )
  const uniqueACLength = reduceUnique(ACLength)
  // 项目DC装机量单位W
  const DCCapacityInW = other2w(
    reportData[buildingID].ttl_dc_power_capacity.value,
    reportData[buildingID].ttl_dc_power_capacity.unit
  )
  const initDataSource = reportData[buildingID].investment.length > 0 ?
    reportData[buildingID].investment :
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
        unit: t('investment.unit.price/kuai'),
        quantity: uniquePVCount[pvName],
        unitPriceEditable: true
      })),{
        key: 2,
        series: 2,
        name: t('investment.name.rack'),
        description: t('investment.description.rack'),
        unit: t('investment.unit.price/W'),
        quantity: reportData[buildingID] ? DCCapacityInW : null,
        unitPriceEditable: true
      },{
        key: 3,
        series: 3,
        name: t('investment.name.inverter'),
      },
      ...Object.keys(uniqueInverterCount).map((inverterName, index) => ({
        key: `1.2.${index + 1}`,
        description: inverterName,
        unit: t('investment.unit.price/tai'),
        quantity: uniqueInverterCount[inverterName],
        unitPriceEditable: true
      })),{
        key: 4,
        series: 4,
        name: t('investment.name.combibox'),
        unit: t('investment.unit.price/tai'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 5,
        series: 5,
        name: t('investment.name.meter'),
        unit: t('investment.unit.price/kuai'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 6,
        series: 6,
        name: t('investment.name.router'),
        unit: t('investment.unit.price/tao'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 7,
        series: 7,
        name: t('investment.name.comm'),
        unit: t('investment.unit.price/tai'),
        quantity: 1,
        descriptionEditable: true,
        unitPriceEditable: true
      },{
        key: 8,
        series: 8,
        name: t('investment.name.dc_wiring'),
      },
      ...Object.keys(uniqueDCLength).map((DCwir, index) => ({
        key: `1.3.${index + 1}`,
        description: DCwir,
        unit: t('investment.unit.price/m'),
        quantity: uniqueDCLength[DCwir],
        unitPriceEditable: true
      })),{
        key: 9,
        series: 9,
        name: t('investment.name.ac_wiring'),
      },
      ...Object.keys(uniqueACLength).map((ACwir, index) => ({
        key: `1.4.${index + 1}`,
        description: ACwir,
        unit: t('investment.unit.price/m'),
        quantity: uniqueACLength[ACwir],
        unitPriceEditable: true
      })),{
        key: 10,
        series: 10,
        name: t('investment.name.combibox_wiring'),
        description: reportData[buildingID] ?
          `${reportData[buildingID].combibox_wir_choice} (AC)` :
          null,
        unit: t('investment.unit.price/m'),
        quantity: buildingData.combibox_cable_len,
        unitPriceEditable: true
      },{
        key: 11,
        series: 11,
        name: t('investment.name.rooftop'),
        description: t('investment.description.rooftop'),
        unit: t('investment.unit.price/xiang'),
        quantity: 1,
        unitPriceEditable: true
      },{
        key: 12,
        series: 12,
        name: t('investment.name.other'),
        description: t('investment.description.other'),
        unit: t('investment.unit.price/xiang'),
        quantity: 1,
        unitPriceEditable: true
      }
    ]

  // 生成表格数据
  const [dataSource, setdataSource] = useState(initDataSource)

  // 需要整行合并单元格的row keys
  const disabledRowKeys = [0, 1, 3, 8, 9]
  // 需要字体加粗的row keys
  const strongRowKeys = [0]
  // 生成表格列格式
  const columns = [
    {
      title: t('investment.series'),
      dataIndex: 'series',
      align: 'center',
      render: (text, row, index) => {
        if (strongRowKeys.includes(row.key)) {
          return <strong>{text}</strong>
        }
        return text
      }
    },{
      title: t('investment.name'),
      dataIndex: 'name',
      render: (text, row, index) => {
        if (strongRowKeys.includes(row.key)) {
          return <strong>{text}</strong>
        }
        return text
      }
    },{
      title: t('investment.description'),
      dataIndex: 'description',
      editable: true,
      width: '20%',
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text,
            props: {colSpan: 6}
          };
        }
        return text
      },
    },{
      title: t('investment.quantity'),
      dataIndex: 'quantity',
      editable: true,
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        if (row.key === 2) {
          const newText = w2other(text)
          return `${newText.value} ${newText.unit}`
        }
        return text
      },
    },{
      title: t('investment.unitPrice'),
      dataIndex: 'unitPrice',
      editable: true,
      width: '125px',
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text,
            props: {colSpan: 0}
          };
        }
        return text
      },
    },{
      title: t('investment.unit'),
      dataIndex: 'unit',
      editable: true,
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
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
      width: '125px',
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text >= 0 ? text.toFixed(2) : null,
            props: {colSpan: 0}
          };
        }
        return text >= 0 ? text.toFixed(2) : null
      },
    },{
      title: t('investment.investmentWeight'),
      dataIndex: 'investmentWeight',
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text ? `${text} %` : text,
            props: {colSpan: 0}
          };
        }
        return text ? `${text} %` : text
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

  // 保存用户输入至表格，并更新其他相关格
  const handleSave = row => {
    const newData = [...dataSource];
    // 寻找更新的row index
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    // 更新这一行的总价
    if (row.unitPrice >= 0 && row.quantity) {
      row.totalPrice = row.unitPrice * row.quantity
    }
    newData.splice(index, 1, { ...item, ...row });
    // 所有的总价之和
    let ttlInvestment = 0
    newData.forEach(row => {
      ttlInvestment += row.totalPrice ? row.totalPrice : 0
    })
    // 单位千瓦投资
    const avgInvestmentPerKw = (ttlInvestment / (DCCapacityInW / 1000)).toFixed(2)
    // 更新每一行的投资占比
    newData.forEach(row => {
      row.investmentWeight = row.totalPrice ?
        (row.totalPrice / ttlInvestment * 100).toFixed(2) : null
    });
    setdataSource(newData);
    dispatch(updateReportAttributes({
      buildingID,
      investment: newData,
      ttl_investment: ttlInvestment,
      investmentPerKw: avgInvestmentPerKw
    }))
  };

  // 生成表单头
  const genHeader = () => <TableHeadDescription buildingID={buildingID}/>

  const genSummary = () => {
    return (
      <>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell>
            <Text strong>{t('investment.series.two')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{t('investment.name.totalInvestment')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={4} />
          <Table.Summary.Cell>
            <Text strong>{reportData[buildingID].ttl_investment}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{t('investment.unit.price')}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row className='summaryRow'>
          <Table.Summary.Cell>
            <Text strong>{t('investment.series.three')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{t('investment.name.unitInvestment')}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={4} />
          <Table.Summary.Cell>
            <Text strong>{reportData[buildingID].investmentPerKw}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell>
            <Text strong>{t('investment.unit.price/KW')}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('investment.title')}
        </Title>
      }
      hoverable
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
