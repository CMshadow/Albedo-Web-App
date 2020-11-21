import React from 'react'
import { Table, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { TableHeadDescription } from '../../Descriptions/TableHeadDescription'
import { m2other } from '../../../utils/unitConverter'
import './CommercialEquipmentTable.scss'
const { Title } = Typography

const reduceUnique = data => {
  return data.reduce((acc, val) => {
    Object.keys(acc).includes(val.name) ? (acc[val.name] += val.count) : (acc[val.name] = val.count)
    return acc
  }, {})
}

export const CommercialEquipmentTable = () => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const unit = useSelector(state => state.unit.unit)
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const reportData = useSelector(state => state.report)

  const genPVCount = buildingData =>
    buildingData.data.map(spec => ({
      name: pvData.find(pv => pv.pvID === spec.pv_panel_parameters.pv_model.pvID).name,
      count: spec.inverter_wiring.reduce((acc, val) => {
        acc += val.string_per_inverter * val.panels_per_string
        return acc
      }, 0),
    }))

  const genInvCount = buildingData =>
    buildingData.data.flatMap(spec =>
      spec.inverter_wiring.map(inverterSpec => ({
        name: inverterData.find(
          inverter => inverter.inverterID === inverterSpec.inverter_model.inverterID
        ).name,
        count: 1,
      }))
    )

  // 统计每种用到的组件型号及数量
  const pvCount = projectData.buildings.flatMap(building => genPVCount(building))
  const uniquePVCount = reduceUnique(pvCount)

  // 统计每种用到的逆变器型号及数量
  const inverterCount = projectData.buildings.flatMap(building => genInvCount(building))
  const uniqueInverterCount = reduceUnique(inverterCount)

  // 统计每种用到的汇流箱名称及数量
  const combiboxCount = projectData.buildings.flatMap(building =>
    building.combibox.map(combibox => ({ name: combibox.combibox_name, count: 1 }))
  )
  const uniqueCombiboxCount = reduceUnique(combiboxCount)

  // 统计每种用到的变压器名称及数量
  const transformerCount = projectData.transformers.map(trans => ({
    name: `${trans.transformer_name} - ${trans.transformer_capacity} kVA`,
    count: 1,
  }))
  const uniqueTransformerCount = reduceUnique(transformerCount)

  // 统计每种用到的并网柜名称及数量
  const powercabinetCount = projectData.powercabinets.map(pc => ({
    name: pc.powercabinet_name,
    count: 1,
  }))
  const uniquePowercabinetCount = reduceUnique(powercabinetCount)

  // 统计每种用到的DC线型号及线长
  const DCLength = projectData.buildings.flatMap((building, buildingIndex) =>
    building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring.flatMap((inverterSpec, inverterSpecIndex) =>
        inverterSpec.dc_cable_len.map((len, lenIndex) => ({
          name: `${reportData.overview.setup_dc_wir_choice[buildingIndex][specIndex][inverterSpecIndex][lenIndex]} (DC)`,
          count: len,
        }))
      )
    )
  )
  const uniqueDCLength = reduceUnique(DCLength)

  // 统计每种用到的逆变器出口AC线型号及线长
  const InvACLength = projectData.buildings.flatMap((building, buildingIndex) =>
    building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring.flatMap((inverterSpec, inverterSpecIndex) => ({
        name: `${reportData.overview.setup_ac_wir_choice[buildingIndex][specIndex][inverterSpecIndex]} (AC)`,
        count: inverterSpec.ac_cable_len,
      }))
    )
  )
  const uniqueInvACLength = reduceUnique(InvACLength)

  const CombiboxACLength = projectData.buildings.flatMap((building, buildingIndex) =>
    building.combibox.map((combibox, combiboxIndex) => ({
      name: `${reportData.overview.combibox_wir_choice[buildingIndex][combiboxIndex]} (AC)`,
      count: combibox.combibox_cable_len,
    }))
  )
  const uniqueCombiboxACLength = reduceUnique(CombiboxACLength)

  const TransformerACLength = projectData.transformers.map(transformer => ({
    name: `${transformer.transformer_wir_choice} (AC)`,
    count: transformer.transformer_cable_len,
  }))
  const uniqueTransformerACLength = reduceUnique(TransformerACLength)

  const dataSource = [
    {
      key: 1,
      series: 1,
      name: t('investment.name.pv'),
    },
    ...Object.keys(uniquePVCount).map((pvName, index) => ({
      key: `1.${index + 1}`,
      description: pvName,
      unit: t('equipment.unit.kuai'),
      quantity: uniquePVCount[pvName],
    })),
    {
      key: 2,
      series: 2,
      name: t('investment.name.inverter'),
    },
    ...Object.keys(uniqueInverterCount).map((inverterName, index) => ({
      key: `2.${index + 1}`,
      description: inverterName,
      unit: t('equipment.unit.tai'),
      quantity: uniqueInverterCount[inverterName],
    })),
    {
      key: 3,
      series: 3,
      name: t('investment.name.combibox'),
    },
    ...Object.keys(uniqueCombiboxCount).map((combiboxName, index) => ({
      key: `3.${index + 1}`,
      description: combiboxName,
      unit: t('equipment.unit.tai'),
      quantity: uniqueCombiboxCount[combiboxName],
    })),
    {
      key: 4,
      series: 4,
      name: t('investment.name.transformer'),
    },
    ...Object.keys(uniqueTransformerCount).map((transformerName, index) => ({
      key: `4.${index + 1}`,
      description: transformerName,
      unit: t('equipment.unit.tai'),
      quantity: uniqueTransformerCount[transformerName],
    })),
    {
      key: 5,
      series: 5,
      name: t('investment.name.powercabinet'),
    },
    ...Object.keys(uniquePowercabinetCount).map((powercabinetName, index) => ({
      key: `5.${index + 1}`,
      description: powercabinetName,
      unit: t('equipment.unit.mian'),
      quantity: uniquePowercabinetCount[powercabinetName],
    })),
    {
      key: 6,
      series: 6,
      name: t('investment.name.dc_wiring'),
    },
    ...Object.keys(uniqueDCLength).map((DCwir, index) => ({
      key: `6.${index + 1}`,
      description: DCwir,
      unit: t(`equipment.unit.${unit}`),
      quantity: uniqueDCLength[DCwir],
    })),
    {
      key: 7,
      series: 7,
      name: t('investment.name.ac_wiring'),
    },
    ...Object.keys(uniqueInvACLength).map((ACwir, index) => ({
      key: `7.${index + 1}`,
      description: ACwir,
      unit: t(`equipment.unit.${unit}`),
      quantity: uniqueInvACLength[ACwir],
    })),
    {
      key: 8,
      series: 8,
      name: t('investment.name.combibox_wiring'),
    },
    ...Object.keys(uniqueCombiboxACLength).map((ACwir, index) => ({
      key: `8.${index + 1}`,
      description: ACwir,
      unit: t(`equipment.unit.${unit}`),
      quantity: uniqueCombiboxACLength[ACwir],
    })),
    {
      key: 9,
      series: 9,
      name: t('investment.name.transformer_wiring'),
    },
    ...Object.keys(uniqueTransformerACLength).map((ACwir, index) => ({
      key: `9.${index + 1}`,
      description: ACwir,
      unit: t(`equipment.unit.${unit}`),
      quantity: uniqueTransformerACLength[ACwir],
    })),
  ]

  // 需要整行合并单元格的row keys
  const disabledRowKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // 生成表格列格式
  const columns = [
    {
      title: t('investment.series'),
      dataIndex: 'series',
      align: 'center',
    },
    {
      title: t('investment.name'),
      dataIndex: 'name',
    },
    {
      title: t('equipment.description'),
      dataIndex: 'description',
      width: '20%',
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text,
            props: { colSpan: 6 },
          }
        }
        return text
      },
    },
    {
      title: t('investment.quantity'),
      dataIndex: 'quantity',
      render: (text, row, index) => {
        const dcReg = /6./
        const acReg = /7./
        const combiboxReg = /8./
        const transformerReg = /9./
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text,
            props: { colSpan: 0 },
          }
        }
        if (
          dcReg.test(row.key) ||
          acReg.test(row.key) ||
          combiboxReg.test(row.key) ||
          transformerReg.test(row.key)
        ) {
          return `${m2other(unit, text).toFixed(2)} ${unit}`
        }
        return text
      },
    },
    {
      title: t('investment.unit'),
      dataIndex: 'unit',
      render: (text, row, index) => {
        if (disabledRowKeys.includes(row.key)) {
          return {
            children: text,
            props: { colSpan: 0 },
          }
        }
        return text
      },
    },
  ]

  // 生成表单头
  const genHeader = () => <TableHeadDescription buildingID='overview' />

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('investment.title')}
        </Title>
      }
      hoverable
      className='card'
    >
      <Table
        rowClassName={() => 'editable-row'}
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
