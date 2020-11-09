import {
  SET_PROJECTDATA,
  UPDATE_PROJECTATTRIBUTES,
  RELEASE_PROJECTDATA,
  ADD_BUILDING,
  EDIT_BUILDING,
  DELETE_BUILDING,
  SET_BUILDING_REGENREPORT,
  ADD_PV_SPEC,
  EDIT_PV_SPEC,
  DELETE_PV_SPEC,
  ADD_INVERTER_SPEC,
  EDIT_INVERTER_SPEC,
  DELETE_INVERTER_SPEC,
  ADD_COMBIBOX,
  EDIT_COMBIBOX,
  DELETE_COMBIBOX,
  ADD_TRANSFORMER,
  EDIT_TRANSFORMER,
  DELETE_TRANSFORMER,
  ADD_POWERCABINET,
  EDIT_POWERCABINET,
  DELETE_POWERCABINET,
} from '../../store/action/actionTypes'
import { Project } from '../../@types'

export type IProjectState = Project | {}

export interface SetProjectDataAction {
  type: typeof SET_PROJECTDATA
  data: Project
}

export interface UpdateProjectAttributesAction {
  type: typeof UPDATE_PROJECTATTRIBUTES
  values: Partial<Project>
}

export interface ReleaseProjectDataAction {
  type: typeof RELEASE_PROJECTDATA
}

export type AddBuildingParams = {
  buildingID: string
  buildingName: string
  combibox_cable_len: number
}
export interface AddBuildingAction extends AddBuildingParams {
  type: typeof ADD_BUILDING
}

export type EditBuildingParams = AddBuildingParams & { buildingID: string }
export interface EditBuildingAction extends EditBuildingParams {
  type: typeof EDIT_BUILDING
}

export interface DeleteBuildingAction {
  type: typeof DELETE_BUILDING
  buildingID: string
}

export type SetBuildingReGenReportParams = {
  buildingID: string
  reGenReport: boolean
}
export interface SetBuildingReGenReportAction extends SetBuildingReGenReportParams {
  type: typeof SET_BUILDING_REGENREPORT
}

export interface AddSubAryAction {
  type: typeof ADD_PV_SPEC
  buildingID: string
}

export type EditSubAryParams = {
  buildingID: string
  specIndex: number
  tilt_angle: number
  azimuth: number
  pvID: string
  pv_userID: string
  celltemp_model: string
  celltemp_vars: number[]
  ac_cable_avg_len?: number
  dc_cable_avg_len?: number
  invPlan?: {
    inverterID: string
    inverterUserID: string
    plan?: Array<{ pps: number; spi: number }>
  }
}
export interface EditSubAryAction extends EditSubAryParams {
  type: typeof EDIT_PV_SPEC
}

export type DeleteSubAryParams = {
  buildingID: string
  specIndex: number
}
export interface DeleteSubAryAction extends DeleteSubAryParams {
  type: typeof DELETE_PV_SPEC
}

export type AddInverterSpecParams = DeleteSubAryParams
export interface AddInverterSpecAction extends AddInverterSpecParams {
  type: typeof ADD_INVERTER_SPEC
}

export type EditInverterSpecParams = {
  buildingID: string
  specIndex: number
  invIndex: number
  panels_per_string: number
  string_per_inverter: number
  ac_cable_len: number
  dc_cable_len: number[]
  inverterID: string
  inverter_userID: string
}
export interface EditInverterSpecAction extends EditInverterSpecParams {
  type: typeof EDIT_INVERTER_SPEC
}

export type DeleteInverterSpecParams = {
  buildingID: string
  specIndex: number
  invIndex: number
}
export interface DeleteInverterSpecAction extends DeleteInverterSpecParams {
  type: typeof DELETE_INVERTER_SPEC
}

export interface AddCombiboxAction {
  type: typeof ADD_COMBIBOX
  buildingID: string
}

export type EditCombiboxParams = {
  buildingID: string
  combiboxIndex: number
  combibox_name: string
  combibox_cable_len: number
  combibox_vac: number
  linked_inverter_serial_num: string[]
}
export interface EditCombiboxAction extends EditCombiboxParams {
  type: typeof EDIT_COMBIBOX
}

export type DeleteCombiboxParams = {
  buildingID: string
  combiboxIndex: number
}
export interface DeleteCombiboxAction extends DeleteCombiboxParams {
  type: typeof DELETE_COMBIBOX
}

export interface AddTransformerAction {
  type: typeof ADD_TRANSFORMER
}

export type EditTransformerParams = {
  transformerIndex: number
  transformer_name: string
  transformer_cable_len: number
  transformer_vac: number
  linked_combibox_serial_num: string[]
  linked_inverter_serial_num: string[]
  Ut: number
  transformer_capacity: number
  transformer_linked_capacity: number
  transformer_no_load_loss: number
  transformer_power: number
  transformer_short_circuit_loss: number
  transformer_type: string
  transformer_ACVolDropFac: number
  transformer_high_voltage_cable_Ib: number
  transformer_wir_choice: string
}
export interface EditTransformerAction extends EditTransformerParams {
  type: typeof EDIT_TRANSFORMER
}

export interface DeleteTransformerAction {
  type: typeof DELETE_TRANSFORMER
  transformerIndex: number
}

export interface AddPowercabinetAction {
  type: typeof ADD_POWERCABINET
}

export type EditPowercabinetParams = {
  powercabinetIndex: number
  powercabinet_name: string
  linked_transformer_serial_num: string[]
  linked_combibox_serial_num: string[]
  linked_inverter_serial_num: string[]
  Ub: number
  powercabinet_linked_capacity: number
}
export interface EditPowercabinetAction extends EditPowercabinetParams {
  type: typeof EDIT_POWERCABINET
}

export interface DeletePowercabinetAction {
  type: typeof DELETE_POWERCABINET
  powercabinetIndex: number
}

export type ProjectActionTypes =
  | SetProjectDataAction
  | UpdateProjectAttributesAction
  | ReleaseProjectDataAction
  | SetBuildingReGenReportAction
  | AddBuildingAction
  | EditBuildingAction
  | DeleteBuildingAction
  | AddSubAryAction
  | EditSubAryAction
  | DeleteSubAryAction
  | AddInverterSpecAction
  | EditInverterSpecAction
  | DeleteInverterSpecAction
  | AddCombiboxAction
  | EditCombiboxAction
  | DeleteCombiboxAction
  | AddTransformerAction
  | EditTransformerAction
  | DeleteTransformerAction
  | AddPowercabinetAction
  | EditPowercabinetAction
  | DeletePowercabinetAction
