import React from 'react'
import { Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PVNameDescription } from '../../Descriptions/PVNameDescription'
import { RootState, PV } from '../../../@types'
import styles from './index.module.scss'

type PVDetailTableProps = {
  pvID: string
  count: number
}

export const PVDetailTable: React.FC<PVDetailTableProps> = ({ pvID, count }) => {
  const { t } = useTranslation()
  const pvRedux = useSelector((state: RootState) => state.pv)
  const pvData = pvRedux.data.concat(pvRedux.officialData)
  const pvSpec = pvData.find(pv => pv.pvID === pvID)

  const KeysAndUnits: [keyof PV | 'size', string][] = [
    ['pmax', 'Wp'],
    ['voco', 'V'],
    ['isco', 'A'],
    ['vmpo', 'V'],
    ['impo', 'A'],
    ['betaVoco', '%/℃'],
    ['betaVmpo', '%/℃'],
    ['alphaIsc', '%/℃'],
    ['gammaPmax', '%/℃'],
    ['t', '℃'],
    ['tPrime', '℃'],
    ['tenYDecay', '%'],
    ['twentyfiveYDecay', '%'],
    ['size', 'mm'],
    ['panelWeight', 'kg'],
    ['moduleMaterial', ''],
  ]

  const dataSource = KeysAndUnits.map(([key, unit], index) => {
    const data: {
      key: number
      series: number
      paramName: string
      unit: string
      param: unknown
    } = {
      key: index + 1,
      series: index + 1,
      paramName: t(`PV.${key.toString()}`),
      unit: unit,
      param: '',
    }
    if (key === 'size') {
      data.param = `${pvSpec?.panelLength} x ${pvSpec?.panelWidth} x ${pvSpec?.panelHeight}`
    } else if (key === 'moduleMaterial') {
      data.param = t(`PV.${pvSpec?.moduleMaterial}`)
    } else {
      data.param = pvSpec ? pvSpec[key] : ''
    }
    return data
  })

  const columns = [
    {
      key: 0,
      title: t('table.series'),
      dataIndex: 'series',
      align: 'center' as const,
    },
    {
      key: 1,
      title: t('table.paramName'),
      dataIndex: 'paramName',
      align: 'center' as const,
    },
    {
      key: 2,
      title: t('table.unit'),
      dataIndex: 'unit',
      align: 'center' as const,
    },
    {
      key: 3,
      title: t('table.param'),
      dataIndex: 'param',
      align: 'center' as const,
    },
  ]

  const genHeader = () => <PVNameDescription pvID={pvID} count={count} />

  return (
    <Table
      className={styles.pvTable}
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      title={genHeader}
    />
  )
}
