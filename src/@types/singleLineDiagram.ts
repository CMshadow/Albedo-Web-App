export interface IAllPVArray {
  siliconMaterial: string
  inverter_serial_number: string
  pvName: string
  pmax: number
  voc: number
  vpm: number
  isc: number
  ipm: number
  string_per_inverter: number
  panels_per_string: number
  inverterName: string
  paco: number
  acCableChoice: string
  dcCableChoice: string[]
}
