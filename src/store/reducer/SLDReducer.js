import * as actionTypes from '../action/actionTypes';

const initialState = {
  pvDist: [],
  width: 1,
  pvGap: 0,
  pvAccessPorts: [],
  inverterAccessPorts: [],
  interConnectAccessPorts: [],
  disconnecterPosition: [],
  stageWidth: window.innerWidth - 250,
  stageHeight: window.innerHeight - 64,
  disconnecterAccess: [],
  serverPanelPosition: [],
  disconnectSize: [],
  serverPanelAccess: [],
  meterPosition:[],
  gridPosition:[],
  meterAccessPosition: []
};

const setPVDist = (state, action) => {
  return {
    ...state,
    pvDist: action.pvDist
  }
}

const setInverterWidth = (state, action) => {
  return {
    ...state,
    width: action.width,
    pvGap: action.pvGap,
    pvAccessPorts: action.accessPoints
  }
}

const InverterDataExport = (state, action) => {
  return {
    ...state,
    inverterAccessPorts: action.accessPoints
  }
}

const setInterConnectData = (state, action) => {
  return{
    ...state,
    disconnecterPosition: action.startPosition,
    interConnectAccessPorts : action.accessPoints,
    disconnectSize: action.size
  }
}

const setSize = (state, action) => {
  return {
    ...state,
    stageHeight: action.height
  }
}

const setServerPanel = (state, action) => {
  return {
    ...state,
    disconnecterAccess: action.accessPoints,
    serverPanelPosition: action.startPosition
  }
}

const setMeter = (state, action) => {
  return {
    ...state,
    serverPanelAccess: action.accessPoints,
    meterPosition: action.startPosition
  }
}

const setGrid = (state, action) => {
  return {
    ...state,
    gridPosition: action.startPosition,
    meterAccessPosition: action.accessPoints
  }
}

const setWidth = (state, action) => {
  return {
    ...state,
    stageWidth: action.width
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PV_DIST:
      return setPVDist(state, action);

    case actionTypes.SET_INVERTER_WIDTH:
      return setInverterWidth(state, action);
    
    case actionTypes.SET_INVERTER_DATA_SLD:
      return InverterDataExport(state, action);

    case actionTypes.SET_INTERCONNECT_DATA:
      return setInterConnectData(state, action);

    case actionTypes.SET_SIZE:
      return setSize(state, action);

    case actionTypes.SET_SERVER_PANEL:
      return setServerPanel(state, action);

    case actionTypes.SET_METER:
      return setMeter(state, action);
    
    case actionTypes.SET_GRID:
      return setGrid(state, action);
    
    case actionTypes.SET_WIDTH:
      return setWidth(state, action);

    default: return state;
  }
};

export default reducer;
