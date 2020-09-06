import React from 'react'
import { Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PVNameDescription } from '../Descriptions/PVNameDescription'

export const PVDetailTable = ({ pvID, count }) => {
  const { t } = useTranslation()
  const pvRedux = useSelector(state => state.pv)
  const pvData = pvRedux.data.concat(pvRedux.officialData)
  const pvSpec = pvData.find(pv => pv.pvID === pvID)

  const KeysAndUnits = [
    ['pmax', 'Wp'], ['voco', 'V'], ['isco', 'A'], ['vmpo', 'V'], ['impo', 'A'],
    ['betaVoco', '%/℃'], ['betaVmpo', '%/℃'], ['alphaIsc', '%/℃'],
    ['gammaPmax', '%/℃'], ['t', '℃'], ['tPrime', '℃'], ['tenYDecay', '%'],
    ['twentyfiveYDecay', '%'], ['size', 'mm'], ['panelWeight', 'kg'], ['moduleMaterial', '']
  ]

  const dataSource = KeysAndUnits.map(([key, unit], index) => {
    const data = {
      key: index + 1,
      series: index + 1,
      paramName: t(`PV.${key}`),
      unit: unit,
    }
    if (key === 'size') {
      data.param = `${pvSpec.panelLength} x ${pvSpec.panelWidth} x ${pvSpec.panelHeight}`
    } else if (key === 'moduleMaterial') {
      data.param = t(`PV.${pvSpec[key]}`)
    } else {
      data.param = pvSpec[key]
    }
    return data
  })

  const columns = [
    {
      key: 0,
      title: t('table.series'),
      dataIndex: 'series',
      align: 'center',
    }, {
      key: 1,
      title: t('table.paramName'),
      dataIndex: 'paramName',
      align: 'center',
    }, {
      key: 2,
      title: t('table.unit'),
      dataIndex: 'unit',
      align: 'center',
    }, {
      key: 3,
      title: t('table.param'),
      dataIndex: 'param',
      align: 'center',
    }
  ];

  const genHeader = () => <PVNameDescription pvID={pvID} count={count}/>

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      title={genHeader}
    />
  )
}
