export type InverterPreUpload = {
  name: string
  note: string
  inverterLength: number
  inverterWidth: number
  inverterHeight: number
  inverterWeight: number

  vdcMin: number
  vdcMax: number
  vdco: number
  vac: number
  vmpptMin: number
  vmpptMax: number
  paco: number
  pdco: number
  vso: number
  pso: number
  pdcMax: number
  pacMax: number
  idcMax: number
  iacMax: number
  pnt: number
  mpptNum: number
  mpptIdcMax: number
  strNum: number
  strIdcMax: number
  inverterEffcy: number
  nationEffcy: number
  acFreqMin: number
  acFreqMax: number
  nominalPwrFac: number
  THDi: number
  workingTempMin: number
  workingTempMax: number
  protectLvl: string
  commProtocal: string
  workingAltMax: number
  radiator: string

  grdTrblDetect: boolean
  overloadProtect: boolean
  revPolarityProtect: boolean
  overvoltageProtect: boolean
  shortCircuitProtect: boolean
  antiIslandProtect: boolean
  overheatProtect: boolean

  c0: number
  c1: number
  c2: number
  c3: number
}

export type Inverter = InverterPreUpload & {
  inverterID: string
  userID: string
  createdAt: number
  updatedAt: number
  area: number
  paco_sandia: number
  pdco_sandia: number
  pso_sandia: number
  pdcMax_sandia: number
}
