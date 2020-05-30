import * as actionTypes from '../action/actionTypes';
import { v1 as uuidv1 } from 'uuid';
const initialState = {

};

const setProjectData = (state, action) => {
  return {
    ...state,
    ...action.data
  }
}

const addBuilding = (state, action) => {
  if (state.buildings) {
    return {
      ...state,
      buildings: [
        ...state.buildings,
        {buildingID: uuidv1(), buildingName: action.buildingName, data:[]}
      ]
    }
  } else {
    return {
      ...state,
      buildings: [
        {buildingID: uuidv1(), buildingName: action.buildingName, data:[]}
      ]
    }
  }
}

const deleteBuilding = (state, action) => {
  const spliceIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings.splice(spliceIndex, 1)
  return {
    ...state,
    buildings: newBuildings
  }
}

const addPVSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].data.push({
    pv_panel_parameters: {
      tilt_angle: null,
      azimuth: null,
      mode: null,
      pvID: null
    },
    inverter_wiring: []
  })
  return {
    ...state,
    buildings: newBuildings
  }
}

const editPVSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].data[action.specIndex].pv_panel_parameters = {
    tilt_angle: action.tilt_angle,
    azimuth: action.azimuth,
    mode: 'single',
    pvID: action.pvID
  }
  return {
    ...state,
    buildings: newBuildings
  }
}

const deletePVSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].data.splice(action.specIndex, 1)
  return {
    ...state,
    buildings: newBuildings
  }
}

const addInverterSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring.push({
    inverter_serial_number: newBuildings[buildingIndex].data[action.specIndex]
      .inverter_wiring.length + 1,
    panels_per_string: null,
    string_per_inverter: null,
    inverterID: null
  })
  return {
    ...state,
    buildings: newBuildings
  }
}

const editInverterSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].data[action.specIndex]
  .inverter_wiring[action.invIndex] = {
    inverter_serial_number: newBuildings[buildingIndex].data[action.specIndex]
      .inverter_wiring[action.invIndex].inverter_serial_number,
    panels_per_string: action.panels_per_string,
    string_per_inverter: action.string_per_inverter,
    inverterID: action.inverterID
  }
  return {
    ...state,
    buildings: newBuildings
  }
}

const deleteInverterSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring
  .splice(action.invIndex, 1)
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring
  .forEach((obj, ind) => {
    if (ind >= action.specIndex) obj.inverter_serial_number -= 1
  })
  return {
    ...state,
    buildings: newBuildings
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PROJECTDATA:
      return setProjectData(state, action);
    case actionTypes.ADD_BUILDING:
      return addBuilding(state, action);
    case actionTypes.DELETE_BUILDING:
      return deleteBuilding(state, action)
    case actionTypes.ADD_PV_SPEC:
      return addPVSpec(state, action)
    case actionTypes.EDIT_PV_SPEC:
      return editPVSpec(state, action)
    case actionTypes.DELETE_PV_SPEC:
      return deletePVSpec(state, action)
    case actionTypes.ADD_INVERTER_SPEC:
      return addInverterSpec(state, action)
    case actionTypes.EDIT_INVERTER_SPEC:
      return editInverterSpec(state, action)
    case actionTypes.DELETE_INVERTER_SPEC:
      return deleteInverterSpec(state, action)
    default: return state;
  }
};

export default reducer;
