export type PAN = {
  note: string
  name: string
  panelLength: number
  panelWidth: number
  panelHeight: number
  panelWeight: number
  siliconMaterial: string
  seriesCell: number
  parallelCell: number
  pmax: number
  gammaPmax: number
  impo: number
  vmpo: number
  voco: number
  betaVoco: number
  isco: number
  alphaIsc: number
  alphaImp: number
  betaVmpo: number
  ixo: number
  ixxo: number
}

export type OND = {
  note: string
  name: string
  inverterLength: number
  inverterWidth: number
  inverterHeight: number
  inverterWeight: number
  vdcMax: number
  vdco: number
  vac: number
  vmpptMin: number
  vmpptMax: number
  paco: number
  pacMax: number
  pnt: number
  idcMax: number
  iacMax: number
  nominalPwrFac: number
  mpptNum: number
  mpptIdcMax: number
  strNum: number
  inverterEffcy: number
  THDi: number
  c0: number
  c1: number
  c2: number
  c3: number
  pdco: number
  pso: number
}
