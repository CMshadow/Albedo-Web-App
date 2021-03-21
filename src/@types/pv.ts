export type PVPreUpload = {
  name: string
  note: string
  panelLength: number
  panelWidth: number
  panelHeight: number
  panelWeight: number
  siliconMaterial: 'mc-Si' | 'c-Si'
  moduleMaterial: 'glass/cell/glass' | 'glass/cell/polymer-sheet' | 'polymer/thin-film/steel'
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
  t: number
  tPrime: number
  tenYDecay: number
  twentyfiveYDecay: number
  year1Decay: number
  year2To25Decay: number
  singlediodeIVData?: { [key: string]: [number, number][] }
}

export type PV = PVPreUpload & {
  pvID: string
  userID: string
  createdAt: number
  updatedAt: number
  a: number
  b: number
  dtc: number
  c0: number
  c1: number
  c2: number
  c3: number
  c4: number
  c5: number
  c6: number
  c7: number
  n: number
  a0: number
  a1: number
  a2: number
  a3: number
  a4: number
  b0: number
  b1: number
  b2: number
  b3: number
  b4: number
  b5: number
  fd: number
  area: number
  betaVoco_sandia: number
  alphaIsc_sandia: number
  alphaImp_sandia: number
  betaVmpo_sandia: number
  mbvoc: number
  mbvmp: number
  companyName?: string
  theme?: string
}
