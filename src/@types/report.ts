export type GainEntry = {
  key: string
  name: string
  unit: string
  series: string
  description: string
  total?: number
  'acc-net-cash-flow-selfuse'?: number
  'acc-net-cash-flow-togrid'?: number
  'cash-in-flow-selfuse'?: number
  'cash-in-flow-togrid'?: number
  'cash-out-flow-selfuse'?: number
  'cash-out-flow-togrid'?: number
  'net-cash-flow-selfuse'?: number
  'net-cash-flow-togrid'?: number
}

export type InvestmentEntry = {
  key: string
  series?: string | number
  name?: string
  description?: string
  unit?: string
  quantity?: number
  unitPriceEditable?: boolean
  descriptionEditable?: boolean
  totalPriceEditable?: boolean
  unitPrice?: number
  totalPrice?: number
  investmentWeight?: number | undefined
}

export type Report = {
  coal_reduction: number
  c_reduction: number
  co2_reduction: number
  so2_reduction: number
  nox_reduction: number

  ttl_dc_power_capacity: { value: number; unit: string }
  ac_output_distribution: { value: number[]; unit: string }
  year_AC_power: { value: number; unit: string }

  p_loss_combibox_wiring: number
  p_loss_soiling: number
  p_loss_connection: number
  p_loss_availability: number
  p_loss_temperature: number
  p_loss_mismatch_betweenstrings: number
  p_loss_conversion: number
  p_loss_tilt_azimuth: number
  p_loss_dc_wiring: number
  p_loss_degradation: number
  p_loss_transformer: number
  p_loss_degradation_rest: number
  p_loss_mismatch_withinstring: number
  p_loss_system: number
  p_loss_far_side_shading: number
  p_loss_ac_wiring: number
  p_loss_eff_irradiance: number
  p_loss_transformer_wiring: number

  GHI: number[]

  setup_month_irr: number[][]
  year25_kWh_over_kWp: number[]
  setup_behindPV: number[][]

  month_AC_power: { value: number[]; unit: string }
  year25_AC_power: { unit: string; value: number }[]
  year25_DC_power: { unit: string; value: number }[]
  combibox_Ie: number
  daily_AC_power: { value: number[]; unit: string }
  setup_month_irr_avg_pk_hr: number[][]
  p_loss_system_monthly: number[]
  sunPosition: number[][][]
  system_efficiency: number
  weatherAnalysis: { GHI: number; Wspd: number; DHI: number; DryBulb: number; DNI: number }[]
  kWh_over_kWp: number

  'feed-in-tariff'?: number
  'export-credit'?: number
  'rate-of-electricity'?: number
  'final-export-credit'?: number
  ttl_investment?: number
  investment: InvestmentEntry[]
  gain?: GainEntry[]
  investmentPerKw?: string
}

export type DomesticReport = Report & {
  setup_dc_wir_choice: string[][][]
  setup_ac_wir_choice: string[][]
  setup_ac_Ie: number[][]
  combibox_wir_choice: string
  combibox_Ie: number
}

export type CommercialReport = Report & {
  setup_dc_wir_choice: string[][][][]
  setup_ac_wir_choice: string[][][]
  combibox_wir_choice: string[][]
  transformer_wir_choice: string[]
}
