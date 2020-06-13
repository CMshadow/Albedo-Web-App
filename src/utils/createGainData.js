import { wh2kwh, other2wh } from './unitConverter'

export const createDateSource = (buildingReportData) => {
  const initDataSource = [
    {
      key: 0,
      series: 0,
      name: 'construction',
      unit: 'price',
      'cash-in-flow-togrid': 0,
      'cash-in-flow-selfuse': 0,
      'cash-out-flow-togrid': buildingReportData.ttl_investment,
      'cash-out-flow-selfuse': buildingReportData.ttl_investment,
      'net-cash-flow-togrid': -buildingReportData.ttl_investment,
      'net-cash-flow-selfuse': -buildingReportData.ttl_investment,
      'acc-net-cash-flow-togrid': -buildingReportData.ttl_investment,
      'acc-net-cash-flow-selfuse': -buildingReportData.ttl_investment,
    }
  ]
  buildingReportData.year25_AC_power.forEach((obj, index) => {
    const yearACInKwh = wh2kwh(other2wh(obj.value, obj.unit))
    const cashInFlowToGrid = Number(
      (yearACInKwh * buildingReportData['final-export-credit']).toFixed(2)
    )
    const cashInFlowSelfUse = Number(
      (yearACInKwh * buildingReportData['rate-of-electricity']).toFixed(2)
    )
    const cashOutFlowToGrid =
      buildingReportData.gain ?
      buildingReportData.gain[index + 1]['cash-out-flow-togrid'] : 0
    const cashOutFlowSelfUse =
      buildingReportData.gain ?
      buildingReportData.gain[index + 1]['cash-out-flow-selfuse'] : 0
    const netCashFlowToGrid = Number(
      (cashInFlowToGrid - cashOutFlowToGrid).toFixed(2)
    )
    const netCashFlowSelfUse = Number(
      (cashInFlowSelfUse - cashOutFlowSelfUse).toFixed(2)
    )
    const lastAccNetCashFlowToGrid =
      initDataSource.slice(-1)[0]['acc-net-cash-flow-togrid']
    const lastAccNetCashFlowSelfUse =
      initDataSource.slice(-1)[0]['acc-net-cash-flow-selfuse']
    const newAccNetCashFlowToGrid = Number(
      (lastAccNetCashFlowToGrid + netCashFlowToGrid).toFixed(2)
    )
    const newAccNetCashFlowSelfUse = Number(
      (lastAccNetCashFlowSelfUse + netCashFlowSelfUse).toFixed(2)
    )
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
      'acc-net-cash-flow-selfuse': newAccNetCashFlowSelfUse
    })
  })
  return initDataSource
}
