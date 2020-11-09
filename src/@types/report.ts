export type GainEntry = {
  key: number
  name: string
  unit: string
  series: number
  'acc-net-cash-flow-selfuse': number
  'acc-net-cash-flow-togrid': number
  'cash-in-flow-selfuse': number
  'cash-in-flow-togrid': number
  'cash-out-flow-selfuse': number
  'cash-out-flow-togrid': number
  'net-cash-flow-selfuse': number
  'net-cash-flow-togrid': number
}

export type Report = {
  ttl_investment?: number
  gain?: Array<GainEntry>
  year25_AC_power: Array<{ unit: string; value: number }>
  'final-export-credit'?: number
}
