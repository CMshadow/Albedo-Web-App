import { Report, GainEntry } from '../@types'
import { wh2kwh, other2wh } from './unitConverter'

interface ICreateGainData {
  (report: Report): Array<GainEntry>
}

export const createGainData: ICreateGainData = report => {
  const fnExportCredit = report['final-export-credit']
  if (!report.ttl_investment || fnExportCredit === undefined) {
    return []
  }
  const initDataSource = [
    {
      key: 0,
      series: 0,
      name: 'construction',
      unit: 'price',
      'cash-in-flow-togrid': 0,
      'cash-in-flow-selfuse': 0,
      'cash-out-flow-togrid': report.ttl_investment,
      'cash-out-flow-selfuse': report.ttl_investment,
      'net-cash-flow-togrid': -report.ttl_investment,
      'net-cash-flow-selfuse': -report.ttl_investment,
      'acc-net-cash-flow-togrid': -report.ttl_investment,
      'acc-net-cash-flow-selfuse': -report.ttl_investment,
    },
  ]
  report.year25_AC_power.forEach((obj, index) => {
    const yearACInKwh = wh2kwh(other2wh(obj.value, obj.unit)) as number
    const cashInFlowToGrid = Number((yearACInKwh * fnExportCredit).toFixed(2))
    const cashInFlowSelfUse = Number((yearACInKwh * fnExportCredit).toFixed(2))
    const cashOutFlowToGrid = report.gain ? report.gain[index + 1]['cash-out-flow-togrid'] : 0
    const cashOutFlowSelfUse = report.gain ? report.gain[index + 1]['cash-out-flow-selfuse'] : 0
    const netCashFlowToGrid = Number((cashInFlowToGrid - cashOutFlowToGrid).toFixed(2))
    const netCashFlowSelfUse = Number((cashInFlowSelfUse - cashOutFlowSelfUse).toFixed(2))
    const lastAccNetCashFlowToGrid = initDataSource.slice(-1)[0]['acc-net-cash-flow-togrid']
    const lastAccNetCashFlowSelfUse = initDataSource.slice(-1)[0]['acc-net-cash-flow-selfuse']
    const newAccNetCashFlowToGrid = Number((lastAccNetCashFlowToGrid + netCashFlowToGrid).toFixed(2))
    const newAccNetCashFlowSelfUse = Number((lastAccNetCashFlowSelfUse + netCashFlowSelfUse).toFixed(2))
    initDataSource.push({
      key: index + 1,
      series: index + 1,
      unit: 'price',
      name: `${index + 1}`,
      'cash-in-flow-togrid': cashInFlowToGrid,
      'cash-in-flow-selfuse': cashInFlowSelfUse,
      'cash-out-flow-togrid': cashOutFlowToGrid,
      'cash-out-flow-selfuse': cashOutFlowSelfUse,
      'net-cash-flow-togrid': netCashFlowToGrid,
      'net-cash-flow-selfuse': netCashFlowSelfUse,
      'acc-net-cash-flow-togrid': newAccNetCashFlowToGrid,
      'acc-net-cash-flow-selfuse': newAccNetCashFlowSelfUse,
    })
  })
  return initDataSource
}
