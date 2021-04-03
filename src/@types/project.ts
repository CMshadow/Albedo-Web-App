export type PVSpec = {
  tilt_angle: number | null
  azimuth: number | null
  mode: string | null
  celltemp_model: string | null
  celltemp_vars: number[]
  ac_cable_avg_len?: number
  dc_cable_avg_len?: number
  pv_model: {
    pvID: string | null
    userID: string | null
  }
}

export type INVSpec = {
  inverter_serial_number: number
  panels_per_string: number | null
  string_per_inverter: number | null
  ac_cable_len: number | null
  dc_cable_len: number[] | null
  inverter_model: {
    inverterID: string | null
    userID: string | null
  }
}

export type SubAry = {
  pv_panel_parameters: PVSpec
  inverter_wiring: Array<INVSpec>
}

export type Combibox = {
  combibox_name: string | null
  combibox_cable_len: number | null
  combibox_serial_num: string
  combibox_vac: number | null
  linked_inverter_serial_num: Array<string>
}

export type Building = {
  buildingID: string
  buildingName: string
  combibox_cable_len: number
  reGenReport: boolean
  data: Array<SubAry>
  combibox: Array<Combibox>
}

export type Transformer = {
  transformer_name: string | null
  transformer_cable_len: number | null
  transformer_serial_num: string
  transformer_vac: number | null
  linked_combibox_serial_num: Array<string>
  linked_inverter_serial_num: Array<string>
  Ut: number | null
  transformer_capacity: number | null
  transformer_linked_capacity: number | null
  transformer_no_load_loss: number | null
  transformer_power: number
  transformer_short_circuit_loss: number | null
  transformer_type: string | null
  transformer_ACVolDropFac: number | null
  transformer_high_voltage_cable_Ib: number
  transformer_wir_choice: string | null
}

export type PowerCabinet = {
  powercabinet_name: string | null
  powercabinet_serial_num: string
  linked_transformer_serial_num: Array<string>
  linked_combibox_serial_num: Array<string>
  linked_inverter_serial_num: Array<string>
  Ub: number | null
  powercabinet_linked_capacity: number | null
}

export type ProjectPreUpload = {
  projectTitle: string
  projectAddress: string
  projectAltitude: number
  projectCreator: string
  projectType: 'domestic' | 'commercial'
  longitude: number
  latitude: number
  weatherSrc: string
  albedo: number
  ACVolDropFac: number
  DCVolDropFac: number
  skyDiffModel: 'isotropic' | 'anisotropic'
}

export type Project = Omit<ProjectPreUpload, 'longitude' | 'latitude' | 'weatherSrc'> & {
  projectID: string
  userID: string
  createdAt: number
  updatedAt: number
  E0: number
  projectNote: string
  projectLon: number
  projectLat: number
  projectGMT?: number
  buildings: Array<Building>
  transformers?: Array<Transformer>
  powercabinets?: Array<PowerCabinet>
  reGenReport?: boolean
  weatherFile?: boolean
  tiltAzimuthPOA?: [number, number, number][]
  horizonData?: [number, number][]
  monthly_albedo?: number[]
  optAzimuth?: number
  optPOA?: number
  optTilt?: number
  p_loss_availability?: number
  p_loss_connection?: number
  p_loss_mismatch_betweenstrings?: number
  p_loss_mismatch_withinstring?: number
  p_loss_soiling?: number
  GHI?: number
  DNI?: number
  DHI?: number
  sunriseH?: number
  sunsetH?: number
}
