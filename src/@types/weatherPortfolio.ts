export type WeatherPortfolio = {
  portfolioID: string
  userID: string
  name: string
  address: string
  createdAt: number
  longitude: number
  latitude: number
  altitude: number
  mode: 'tmy' | 'processed'
  meteonorm_src: string | null
  meteonorm_visible?: boolean
  nasa_src: string | null
  nasa_visible?: boolean
  custom_src: string | null
  custom_visible?: boolean
}

export type ParsedCSV = {
  GHI: number[]
  DNI: number[]
  DHI: number[]
  DryBulb: number[]
  Pressure: number[]
  Wspd: number[]
}

export type MonthRatioIntermedia = { ratio: number[] }

export type FormulaIntermedia = {
  userGHI: number[]
  refGHI: number[]
  coeff: [number, number]
  r: number
}
