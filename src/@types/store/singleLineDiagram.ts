import {
  SET_START_POSTION,
  SET_DIAGRAM_WIDTH,
  SET_INVERTER_ACCESSPORTS,
  SET_METER_ACCESS,
  SET_METER_ACCESS_ALL_IN,
  SET_DIAGRAM_HEIGHT,
  SET_PV_DIST,
  SET_INVERTER_WIDTH,
  SET_INVERTER_DATA_SLD,
  SET_INTERCONNECT_DATA,
  SET_SIZE,
  SET_SERVER_PANEL,
  SET_METER,
  SET_GRID,
  SET_WIDTH,
} from '../../store/action/actionTypes'

export interface ISLDState {
  pvDist: number
  width: number
  pvGap: number
  pvAccessPorts: [number, number][][]
  inverterAccessPorts: [number, number][]
  interConnectAccessPorts: [number, number]
  disconnecterPosition: [number, number]
  stageWidth: number
  stageHeight: number
  disconnecterAccess: [number, number]
  serverPanelPosition: [number, number]
  disconnectSize: number
  serverPanelAccess: [number, number]
  meterPosition: [number, number]
  gridPosition: [number, number]
  meterAccessPosition: [number, number]
  //CN
  diagramWidth: number
  diagramHeight: number
  diagramBoundaryPosition: [number, number]
  diagramMeterAccessPort: [number, number]
  diagramMeterAccessAllIn: [number, number]
}

export interface SetPVDist {
  type: typeof SET_PV_DIST
  pvDist: number
}

export interface SetInverterWidth {
  type: typeof SET_INVERTER_WIDTH
  width: number
  pvGap: number
  accessPoints: [number, number][][]
}

export interface InverterDataExport {
  type: typeof SET_INVERTER_DATA_SLD
  accessPoints: [number, number][]
}

export interface SetInterConnectData {
  type: typeof SET_INTERCONNECT_DATA
  startPosition: [number, number]
  accessPoints: [number, number]
  size: number
}

export interface SetResize {
  type: typeof SET_SIZE
  height: number
}

export interface SetServerPanel {
  type: typeof SET_SERVER_PANEL
  startPosition: [number, number]
  accessPoints: [number, number]
}

export interface SetMeter {
  type: typeof SET_METER
  startPosition: [number, number]
  accessPoints: [number, number]
}

export interface SetGrid {
  type: typeof SET_GRID
  startPosition: [number, number]
  accessPoints: [number, number]
}

export interface SetWidth {
  type: typeof SET_WIDTH
  width: number
}

export interface SetStartPosition {
  type: typeof SET_START_POSTION
  position: [number, number]
}

export interface SetDiagramWidth {
  type: typeof SET_DIAGRAM_WIDTH
  width: number
}

export interface SetDiagramHeight {
  type: typeof SET_DIAGRAM_HEIGHT
  height: number
}

export interface SetInverterAccessPorts {
  type: typeof SET_INVERTER_ACCESSPORTS
  accessPoints: [number, number][]
}

export interface SetMeterAccess {
  type: typeof SET_METER_ACCESS
  meterAccess: [number, number]
}

export interface SetMeterAccessAllIn {
  type: typeof SET_METER_ACCESS_ALL_IN
  meterAllInAccess: [number, number]
}

export type SingleLineDiagramActionType =
  | SetPVDist
  | SetInverterWidth
  | InverterDataExport
  | SetInterConnectData
  | SetResize
  | SetServerPanel
  | SetMeter
  | SetGrid
  | SetWidth
  | SetStartPosition
  | SetDiagramWidth
  | SetDiagramHeight
  | SetInverterAccessPorts
  | SetMeterAccess
  | SetMeterAccessAllIn
