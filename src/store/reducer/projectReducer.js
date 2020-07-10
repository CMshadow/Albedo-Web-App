import * as actionTypes from '../action/actionTypes';
import { v1 as uuidv1 } from 'uuid';

const initialState = {};

const setProjectData = (state, action) => {
  return {
    ...state,
    ...action.data
  }
}

const updateProjectAttributes = (state, action) => {
  const prevStateExceptUpdatedAt = {...state, updatedAt: ''}
  const newStateExceptUpdatedAt = {...state, ...action.values, updatedAt: ''}
  if (
    JSON.stringify(prevStateExceptUpdatedAt) ===
    JSON.stringify(newStateExceptUpdatedAt)
  ) {
    return {...state, ...action.values}
  }
  else {
    const newState = {...state, ...action.values}
    newState.buildings.forEach(building => building.reGenReport = true)
    return newState
  }
}

const releaseProjectData = (state, action) => {
  return {}
}

const addBuilding = (state, action) => {
  const newState = {...state}
  if (!newState.buildings) newState.buildings = []

  newState.buildings.splice(0, 0, {
    buildingID: uuidv1(),
    buildingName: action.buildingName,
    combibox_cable_len: action.combibox_cable_len,
    reGenReport: true,
    data:[]
  })

  if (newState.buildings.length >= 2) {
    const aggrBuilding = newState.buildings.find(building => building.buildingID === 'aggr')
    if (!aggrBuilding) {
      newState.buildings.push({
        buildingID: 'aggr',
        buildingName: action.t('project.add.building.aggr'),
        combibox_cable_len: 50,
        reGenReport: true,
        data: newState.buildings[newState.buildings.length - 1].data
      })
    }
  }
  return newState
}

const editBuilding = (state, action) => {
  const spliceIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const buildingCopy = newBuildings[spliceIndex]
  buildingCopy.buildingName = action.buildingName
  buildingCopy.combibox_cable_len = action.combibox_cable_len
  buildingCopy.reGenReport = true
  newBuildings.splice(spliceIndex, 1, buildingCopy)
  return {
    ...state,
    buildings: newBuildings
  }
}

const deleteBuilding = (state, action) => {
  const spliceIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings.splice(spliceIndex, 1)
  if (newBuildings.length <= 2) {
    const aggrBuilding = newBuildings.find(building => building.buildingID === 'aggr')
    if (aggrBuilding) newBuildings.splice(newBuildings.length - 1, 1)
  }
  return {
    ...state,
    buildings: newBuildings
  }
}

const setBuildingReGenReport = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = action.reGenReport
  return {
    ...state,
    buildings: newBuildings
  }
}

const addPVSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data.push({
    pv_panel_parameters: {
      tilt_angle: null,
      azimuth: null,
      mode: null,
      pv_model: {pvID: null, userID: null},
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
  const newPVSpec = {
    tilt_angle: Number(action.tilt_angle),
    azimuth: Number(action.azimuth),
    mode: 'single',
    pv_model: {pvID: action.pvID, userID: action.pv_userID}
  }
  newBuildings[buildingIndex].data[action.specIndex].pv_panel_parameters = newPVSpec
  newBuildings[buildingIndex].reGenReport = true
  if (action.invPlan.plan) {
    newBuildings[buildingIndex].data[action.specIndex].inverter_wiring =
    action.invPlan.plan.map((plan, index) => ({
      inverter_serial_number: index + 1,
      panels_per_string: plan.pps,
      string_per_inverter: plan.spi,
      inverter_model: {
        inverterID: action.invPlan.inverterID,
        userID: action.invPlan.inverterUserID
      },
      ac_cable_len: 0,
      dc_cable_len: new Array(plan.spi).fill(0)
    }))
  }

  return {
    ...state,
    buildings: updateAggrBuilding(newBuildings)
  }
}

const deletePVSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data.splice(action.specIndex, 1)

  const aggrBuilding = newBuildings.find(building => building.buildingID === 'aggr')
  if (aggrBuilding) {
    aggrBuilding.reGenReport = true
    aggrBuilding.data = []
    newBuildings.slice(0, -1).forEach(building => building.data.forEach(data => {
      aggrBuilding.data.push(data)
    }))
  }
  return {
    ...state,
    buildings: updateAggrBuilding(newBuildings)
  }
}

const addInverterSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring.push({
    inverter_serial_number: newBuildings[buildingIndex].data[action.specIndex]
      .inverter_wiring.length + 1,
    panels_per_string: null,
    string_per_inverter: null,
    inverter_model: {inverterID: null, userID: null}
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
    ac_cable_len: action.ac_cable_len,
    dc_cable_len: action.dc_cable_len,
    inverter_model: {inverterID: action.inverterID, userID: action.inverter_userID}
  }
  newBuildings[buildingIndex].reGenReport = true
  return {
    ...state,
    buildings: updateAggrBuilding(newBuildings)
  }
}

const deleteInverterSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring
  .splice(action.invIndex, 1)
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring
  .forEach((obj, ind) => {
    obj.inverter_serial_number = ind + 1
  })
  return {
    ...state,
    buildings: updateAggrBuilding(newBuildings)
  }
}

const updateAggrBuilding = (newBuildings) => {
  const aggrBuilding = newBuildings.find(building => building.buildingID === 'aggr')
  if (aggrBuilding) {
    aggrBuilding.reGenReport = true
    aggrBuilding.data = []
    const existSpecIndexMap = {}
    newBuildings.slice(0, -1).forEach(building => building.data.forEach(spec => {
      const searchKey = JSON.stringify(spec.pv_panel_parameters)
      if (searchKey in existSpecIndexMap) {
        aggrBuilding.data[existSpecIndexMap[searchKey]].inverter_wiring =
        [
          ...aggrBuilding.data[existSpecIndexMap[searchKey]].inverter_wiring,
          ...spec.inverter_wiring
        ]
      } else {
        existSpecIndexMap[searchKey] = aggrBuilding.data.length
        aggrBuilding.data.push({
          pv_panel_parameters: {...spec.pv_panel_parameters},
          inverter_wiring: [...spec.inverter_wiring]
        })
      }
    }))
  }
  return newBuildings
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PROJECTDATA:
      return setProjectData(state, action);
    case actionTypes.UPDATE_PROJECTATTRIBUTES:
      return updateProjectAttributes(state, action)
    case actionTypes.RELEASE_PROJECTDATA:
      return releaseProjectData(state, action)
    case actionTypes.ADD_BUILDING:
      return addBuilding(state, action);
    case actionTypes.EDIT_BUILDING:
      return editBuilding(state, action)
    case actionTypes.DELETE_BUILDING:
      return deleteBuilding(state, action)
    case actionTypes.SET_BUILDING_REGENREPORT:
      return setBuildingReGenReport(state, action)
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
