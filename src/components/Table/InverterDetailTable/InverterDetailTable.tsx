import React from 'react'
import { Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { InverterNameDescription } from '../../Descriptions/InverterNameDescription'
import { getLanguage } from '../../../utils/getLanguage'
import { RootState, Inverter } from '../../../@types'
import styles from './index.module.scss'

type InverterDetailTableProps = { inverterID: string; count: number }

export const InverterDetailTable: React.FC<InverterDetailTableProps> = ({ inverterID, count }) => {
  const { t } = useTranslation()
  const inverterRedux = useSelector((state: RootState) => state.inverter)
  const inverterData = inverterRedux.data.concat(inverterRedux.officialData)
  const inverterSpec = inverterData.find(inverter => inverter.inverterID === inverterID)

  const KeysAndUnits: [keyof Inverter | 'size' | 'mpptStrNum', string][] = [
    ['vdcMax', 'V'],
    ['vdco', 'V'],
    ['vdcMin', 'V'],
    ['vac', 'V'],
    ['vmpptMin', 'V'],
    ['vmpptMax', 'V'],
    ['pdcMax', 'kWp'],
    ['pacMax', 'kVA'],
    ['paco', 'kWp'],
    ['inverterEffcy', '%'],
    ['nationEffcy', '%'],
    ['mpptNum', '/'],
    ['mpptStrNum', '/'],
    ['acFreqMin', 'Hz'],
    ['acFreqMax', 'Hz'],
    ['idcMax', 'A'],
    ['iacMax', 'A'],
    ['nominalPwrFac', 'cosφ'],
    ['pnt', 'W'],
    ['THDi', '%'],
    ['grdTrblDetect', 'check'],
    ['overloadProtect', 'check'],
    ['revPolarityProtect', 'check'],
    ['overvoltageProtect', 'check'],
    ['shortCircuitProtect', 'check'],
    ['antiIslandProtect', 'check'],
    ['overheatProtect', 'check'],
    ['workingTempMin', '℃'],
    ['workingTempMax', '℃'],
    ['workingAltMax', 'm'],
    ['protectLvl', '/'],
    ['commProtocal', '/'],
    ['radiator', '/'],
    ['size', 'mm'],
    ['inverterWeight', 'kg'],
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
      paramName: t(`Inverter.${key}`),
      unit: unit === 'check' ? t('table.yes/no') : unit,
      param: '',
    }
    if (key === 'size') {
      data.param = `${inverterSpec?.inverterLength} x ${inverterSpec?.inverterWidth} x ${inverterSpec?.inverterHeight}`
    } else if (key === 'mpptStrNum') {
      data.param = inverterSpec ? inverterSpec.strNum / inverterSpec?.mpptNum : 0
    } else if (key === 'nationEffcy') {
      data.paramName = t(`${getLanguage()}`) + t(`Inverter.${key}`)
      data.param = inverterSpec && inverterSpec[key]
    } else if (key === 'radiator') {
      data.param = t(`Inverter.${inverterSpec && inverterSpec[key]}`)
    } else {
      if (inverterSpec) {
        data.param = inverterSpec[key]
        if (inverterSpec[key] === true) data.param = t('table.true')
        if (inverterSpec[key] === false) data.param = t('table.false')
      }
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

  const genHeader = () => <InverterNameDescription inverterID={inverterID} count={count} />

  return (
    <Table
      className={styles.invTable}
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      title={genHeader}
    />
  )
}
