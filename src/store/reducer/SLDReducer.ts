import * as actionTypes from '../action/actionTypes'
import {
  ISLDState,
  SetPVDist,
  SetInverterWidth,
  InverterDataExport,
  SetInterConnectData,
  SetResize,
  SetServerPanel,
  SetMeter,
  SetGrid,
  SetWidth,
  SetStartPosition,
  SetDiagramWidth,
  SetDiagramHeight,
  SetInverterAccessPorts,
  SetMeterAccess,
  SetMeterAccessAllIn,
  SingleLineDiagramActionType,
} from '../../@types'

const initialState: ISLDState = {
  pvDist: 0,
  width: 1,
  pvGap: 0,
  pvAccessPorts: [],
  inverterAccessPorts: [],
  interConnectAccessPorts: [0, 0],
  disconnecterPosition: [0, 0],
  stageWidth: window.innerWidth - 250,
  stageHeight: window.innerHeight - 64,
  disconnecterAccess: [0, 0],
  serverPanelPosition: [0, 0],
  disconnectSize: 0,
  serverPanelAccess: [0, 0],
  meterPosition: [0, 0],
  gridPosition: [0, 0],
  meterAccessPosition: [0, 0],
  //CN
  diagramWidth: window.innerWidth - 250,
  diagramHeight: window.innerHeight - 64,
  diagramBoundaryPosition: [0, 0],
  diagramMeterAccessPort: [0, 0],
  diagramMeterAccessAllIn: [0, 0],
}

interface ISLDReducer<A> {
  (state: ISLDState, action: A): ISLDState
}

const setPVDist: ISLDReducer<SetPVDist> = (state, action) => {
  return {
    ...state,
    pvDist: action.pvDist,
  }
}

const setInverterWidth: ISLDReducer<SetInverterWidth> = (state, action) => {
  return {
    ...state,
    width: action.width,
    pvGap: action.pvGap,
    pvAccessPorts: action.accessPoints,
  }
}

const inverterDataExport: ISLDReducer<InverterDataExport> = (state, action) => {
  return {
    ...state,
    inverterAccessPorts: action.accessPoints,
  }
}

const setInterConnectData: ISLDReducer<SetInterConnectData> = (state, action) => {
  return {
    ...state,
    disconnecterPosition: action.startPosition,
    interConnectAccessPorts: action.accessPoints,
    disconnectSize: action.size,
  }
}

const setSize: ISLDReducer<SetResize> = (state, action) => {
  return {
    ...state,
    stageHeight: action.height,
  }
}

const setServerPanel: ISLDReducer<SetServerPanel> = (state, action) => {
  return {
    ...state,
    disconnecterAccess: action.accessPoints,
    serverPanelPosition: action.startPosition,
  }
}

const setMeter: ISLDReducer<SetMeter> = (state, action) => {
  return {
    ...state,
    serverPanelAccess: action.accessPoints,
    meterPosition: action.startPosition,
  }
}

const setGrid: ISLDReducer<SetGrid> = (state, action) => {
  return {
    ...state,
    gridPosition: action.startPosition,
    meterAccessPosition: action.accessPoints,
  }
}

const setWidth: ISLDReducer<SetWidth> = (state, action) => {
  return {
    ...state,
    stageWidth: action.width,
  }
}

const setStartPosition: ISLDReducer<SetStartPosition> = (state, action) => {
  return {
    ...state,
    diagramBoundaryPosition: action.position,
  }
}

const setDiagramWidth: ISLDReducer<SetDiagramWidth> = (state, action) => {
  return {
    ...state,
    diagramWidth: action.width,
  }
}

export const setInverterAccessPorts: ISLDReducer<SetInverterAccessPorts> = (state, action) => {
  return {
    ...state,
    diagramInverterPorts: action.accessPoints,
  }
}

export const setMeterAccessPort: ISLDReducer<SetMeterAccess> = (state, action) => {
  return {
    ...state,
    diagramMeterAccessPort: action.meterAccess,
  }
}

export const diagramMeterAccessAllIn: ISLDReducer<SetMeterAccessAllIn> = (state, action) => {
  return {
    ...state,
    diagramMeterAccessAllIn: action.meterAllInAccess,
  }
}

export const setDiagramHeight: ISLDReducer<SetDiagramHeight> = (state, action) => {
  return {
    ...state,
    diagramHeight: action.height,
  }
}

const reducer = (state = initialState, action: SingleLineDiagramActionType) => {
  switch (action.type) {
    case actionTypes.SET_PV_DIST:
      return setPVDist(state, action)

    case actionTypes.SET_INVERTER_WIDTH:
      return setInverterWidth(state, action)

    case actionTypes.SET_INVERTER_DATA_SLD:
      return inverterDataExport(state, action)

    case actionTypes.SET_INTERCONNECT_DATA:
      return setInterConnectData(state, action)

    case actionTypes.SET_SIZE:
      return setSize(state, action)

    case actionTypes.SET_SERVER_PANEL:
      return setServerPanel(state, action)

    case actionTypes.SET_METER:
      return setMeter(state, action)

    case actionTypes.SET_GRID:
      return setGrid(state, action)

    case actionTypes.SET_WIDTH:
      return setWidth(state, action)

    case actionTypes.SET_DIAGRAM_WIDTH:
      return setDiagramWidth(state, action)

    case actionTypes.SET_START_POSTION:
      return setStartPosition(state, action)

    case actionTypes.SET_INVERTER_ACCESSPORTS:
      return setInverterAccessPorts(state, action)

    case actionTypes.SET_METER_ACCESS:
      return setMeterAccessPort(state, action)

    case actionTypes.SET_METER_ACCESS_ALL_IN:
      return diagramMeterAccessAllIn(state, action)

    case actionTypes.SET_DIAGRAM_HEIGHT:
      return setDiagramHeight(state, action)

    default:
      return state
  }
}

export default reducer
