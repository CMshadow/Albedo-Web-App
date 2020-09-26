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
    console.log(newState)
    return newState
  }
}

const releaseProjectData = (state, action) => {
  return {}
}

const addBuilding = (state, action) => {
  if (state.buildings) {
    return {
      ...state,
      buildings: [
        ...state.buildings,
        {
          buildingID: uuidv1(),
          buildingName: action.buildingName,
          combibox_cable_len: action.combibox_cable_len,
          reGenReport: true,
          data:[],
          combibox: []
        }
      ]
    }
  } else {
    return {
      ...state,
      buildings: [
        {
          buildingID: uuidv1(),
          buildingName: action.buildingName,
          combibox_cable_len: action.combibox_cable_len,
          reGenReport: true,
          data:[],
          combibox: []
        }
      ]
    }
  }
}

const editBuilding = (state, action) => {
  const spliceIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const buildingCopy = newBuildings[spliceIndex]
  buildingCopy.buildingName = action.buildingName
  buildingCopy.combibox_cable_len = action.combibox_cable_len
  buildingCopy.reGenReport = true
  if ('combibox' in buildingCopy) {
    buildingCopy.combibox.forEach((combibox, combiboxIndex) => 
      combibox.combibox_serial_num = `${buildingCopy.buildingName}-${combiboxIndex + 1}`
    )
  }
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
  newBuildings[buildingIndex].data[action.specIndex].pv_panel_parameters = {
    celltemp_model: action.celltemp_model,
    celltemp_vars: action.celltemp_vars,
    tilt_angle: Number(action.tilt_angle),
    azimuth: Number(action.azimuth),
    mode: 'single',
    pv_model: {pvID: action.pvID, userID: action.pv_userID}
  }
  if ('ac_cable_avg_len' in action && 'dc_cable_avg_len' in action) {
    newBuildings[buildingIndex].data[action.specIndex].pv_panel_parameters['ac_cable_avg_len'] = 
      Number(action.ac_cable_avg_len)
    newBuildings[buildingIndex].data[action.specIndex].pv_panel_parameters['dc_cable_avg_len'] = 
      Number(action.dc_cable_avg_len)
  }
  newBuildings[buildingIndex].reGenReport = true
  // 如果带自动匹配逆变器结果，则直接给spec加入逆变器配置
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
      ac_cable_len: Number(action.ac_cable_avg_len) || 0,
      dc_cable_len: new Array(plan.spi).fill(Number(action.dc_cable_avg_len) || 0)
    }))
  }
  // 如果带自动匹配逆变器结果，并且spec已有combibox，则去除掉所有和这个spec上的逆变器（因为自动匹配逆变器结果会覆盖spec上现有逆变器）
  if (action.invPlan.plan && 'combibox' in newBuildings[buildingIndex]) {
    newBuildings[buildingIndex].combibox = newBuildings[buildingIndex].combibox
      .map(combibox => ({
        ...combibox,
        linked_inverter_serial_num: combibox.linked_inverter_serial_num
          .filter(val => val.split('-')[0] - 1 !== action.specIndex)
      }))
  }
  // 如果带自动匹配逆变器结果，并且项目中有变压器，则把变压器上所有和这个spec相关的逆变器去除（理由同上）
  let newTransformers = state.transformers || []
  if (action.invPlan.plan && 'transformers' in state) {
    newTransformers = newTransformers.map(transformer => ({
      ...transformer,
      linked_inverter_serial_num: transformer.linked_inverter_serial_num
        .filter(val => {
          const buildingName = val.split('-')[0]
          const specIndex = val.split('-')[1] - 1
          const buildingID = newBuildings.find(building => building.buildingName === buildingName).buildingID
          return !(buildingID === action.buildingID && specIndex === action.specIndex)
        })
    }))
  }

  return {
    ...state,
    transformers: newTransformers,
    buildings: newBuildings
  }
}

const deletePVSpec = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data.splice(action.specIndex, 1)
  // 如果房屋有汇流箱，把汇流箱中所有与spec有关的逆变器都删掉，并把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
  if ('combibox' in newBuildings[buildingIndex]) {
    newBuildings[buildingIndex].combibox = newBuildings[buildingIndex].combibox
      .map(combibox => ({
        ...combibox,
        linked_inverter_serial_num: combibox.linked_inverter_serial_num
          .filter(val => val.split('-')[0] - 1 !== action.specIndex)
          .map(val => {
            const subAryIndex = val.split('-')[0] - 1
            if (subAryIndex < action.specIndex) {
              return val
            } else {
              return `${subAryIndex}-${val.split('-')[1]}`
            }
          })
      }))
  }
  // 如果项目有变压器，把变压器中所有与spec有关的逆变器都删掉， 并把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
  let newTransformers = state.transformers || []
  if ('transformers' in state) {
    newTransformers = newTransformers.map(transformer => ({
      ...transformer,
      linked_inverter_serial_num: transformer.linked_inverter_serial_num
        .filter(val => {
          console.log(val)
          const buildingName = val.split('-')[0]
          const specIndex = val.split('-')[1] - 1
          const buildingID = newBuildings.find(building => building.buildingName === buildingName).buildingID
          return !(buildingID === action.buildingID && specIndex === action.specIndex)
        })
        .map(val => {
          console.log(val)
          const buildingName = val.split('-')[0]
          const specIndex = val.split('-')[1] - 1
          const buildingID = newBuildings.find(building => building.buildingName === buildingName).buildingID
          if (buildingID === action.buildingID && specIndex > action.specIndex) {
            return `${buildingName}-${specIndex}-${val.split('-')[2]}`
          } else {
            return val
          }
        })
    }))
  }

  return {
    ...state,
    transformers: newTransformers,
    buildings: newBuildings
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
  const oldInverterID = state.buildings[buildingIndex].data[action.specIndex]
  .inverter_wiring[action.invIndex].inverter_model.inverterID
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
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

  if (action.inverterID !== oldInverterID && 'combibox' in newBuildings[buildingIndex]) {
    newBuildings[buildingIndex].combibox = newBuildings[buildingIndex].combibox
      .map(combibox => ({
        ...combibox,
        linked_inverter_serial_num: combibox.linked_inverter_serial_num
          .filter(val => val !== `${action.specIndex + 1}-${action.invIndex + 1}`)
      }))
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
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring
  .splice(action.invIndex, 1)
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring
  .forEach((obj, ind) => {
    obj.inverter_serial_number = ind + 1
  })

  if ('combibox' in newBuildings[buildingIndex]) {
    newBuildings[buildingIndex].combibox = newBuildings[buildingIndex].combibox
      .map(combibox => ({
        ...combibox,
        linked_inverter_serial_num: combibox.linked_inverter_serial_num
          .filter(val => val !== `${action.specIndex + 1}-${action.invIndex + 1}`)
          .map(val => {
            const subAryIndex = val.split('-')[0] - 1
            const invIndex = val.split('-')[1] - 1
            if (subAryIndex === action.specIndex) {
              return invIndex >= action.invIndex ? 
                `${subAryIndex + 1}-${invIndex}`: 
                val
            } else {
              return val
            }
          })
      }))
  }

  return {
    ...state,
    buildings: newBuildings
  }
}

const addCombibox = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true

  const newCombibox = {
    combibox_name: null,
    combibox_cable_len: newBuildings[buildingIndex].combibox_cable_len,
    combibox_serial_num: 'combibox' in newBuildings[buildingIndex] ? 
      `${newBuildings[buildingIndex].buildingName}-${newBuildings[buildingIndex].combibox.length + 1}` :
      `${newBuildings[buildingIndex].buildingName}-1`,
    combibox_vac: null,
    linked_inverter_serial_num: []
  }
  if ('combibox' in newBuildings[buildingIndex]) {
    newBuildings[buildingIndex].combibox.push(newCombibox)
  } else {
    newBuildings[buildingIndex].combibox = [newCombibox]
  }
  return {
    ...state,
    buildings: newBuildings
  }
}

const editCombibox = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true

  const newCombibox = {
    combibox_name: action.combibox_name,
    combibox_cable_len: action.combibox_cable_len,
    combibox_serial_num: newBuildings[buildingIndex].combibox[action.combiboxIndex].combibox_serial_num,
    combibox_vac: action.combibox_vac,
    linked_inverter_serial_num: action.linked_inverter_serial_num
  }
  newBuildings[buildingIndex].combibox[action.combiboxIndex] = newCombibox
  return {
    ...state,
    buildings: newBuildings
  }
}

const deleteCombibox = (state, action) => {
  const buildingIndex = state.buildings.map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true

  newBuildings[buildingIndex].combibox.splice(action.combiboxIndex, 1)
  newBuildings[buildingIndex].combibox.forEach((combibox, index) => 
    combibox.combibox_serial_num = `${newBuildings[buildingIndex].buildingName}-${index + 1}`
  )
  return {
    ...state,
    buildings: newBuildings
  }
}

const addTransformer = (state, action) => {
  const newTransformers = state.transformers ? [...state.transformers] : []
  const newTransformer = {
    transformer_name: null,
    transformer_cable_len: null,
    transformer_serial_num: newTransformers.length + 1,
    transformer_vac: null,
    linked_combibox_serial_num: [],
    linked_inverter_serial_num: [],
    Ut: null,
    transformer_capacity: null,
    transformer_linked_capacity: null,
    transformer_no_load_loss: null,
    transformer_power: 150,
    transformer_short_circuit_loss: null,
    transformer_type: null
  }
  newTransformers.push(newTransformer)

  return {
    ...state,
    transformers: newTransformers
  }
}

const editTransformer = (state, action) => {
  const newTransformers = state.transformers ? [...state.transformers] : []
  const newTransformer = {
    transformer_name: action.transformer_name,
    transformer_cable_len: action.transformer_cable_len,
    transformer_serial_num: action.transformerIndex + 1,
    transformer_vac: action.transformer_vac,
    linked_combibox_serial_num: action.linked_combibox_serial_num,
    linked_inverter_serial_num: action.linked_inverter_serial_num,
    Ut: action.Ut,
    transformer_capacity: Number(action.transformer_capacity),
    transformer_linked_capacity: action.transformer_linked_capacity,
    transformer_no_load_loss: Number(action.transformer_no_load_loss),
    transformer_power: Number(action.transformer_power),
    transformer_short_circuit_loss: Number(action.transformer_short_circuit_loss),
    transformer_type: action.transformer_type
  }
  newTransformers.splice(action.transformerIndex, 1, newTransformer)

  return {
    ...state,
    transformers: newTransformers
  }
}

const deleteTransformer = (state, action) => {
  const newTransformers = state.transformers ? [...state.transformers] : []
  newTransformers.splice(action.transformerIndex, 1)
  newTransformers.forEach((transformer, index) => 
    transformer.transformer_serial_num = index + 1
  )

  return {
    ...state,
    transformers: newTransformers
  }
}

const addPowercabinet = (state, action) => {
  const newPowercabinets = state.powercabinets ? [...state.powercabinets] : []
  const newPowercabinet = {}
  newPowercabinets.push(newPowercabinet)

  return {
    ...state,
    powercabinets: newPowercabinets
  }
}

const editPowercabinet = (state, action) => {
  const newPowercabinets = state.powercabinets ? [...state.powercabinets] : []
  const newPowercabinet = {}
  newPowercabinets.splice(action.powercabinetIndex, 1, newPowercabinet)

  return {
    ...state,
    powercabinets: newPowercabinets
  }
}

const deletePowercabinet = (state, action) => {
  const newPowercabinets = state.powercabinets ? [...state.powercabinets] : []
  newPowercabinets.splice(action.powercabinetIndex, 1)

  return {
    ...state,
    powercabinets: newPowercabinets
  }
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
    case actionTypes.ADD_COMBIBOX:
      return addCombibox(state, action)
    case actionTypes.EDIT_COMBIBOX:
      return editCombibox(state, action)
    case actionTypes.DELETE_COMBIBOX:
      return deleteCombibox(state, action)
    case actionTypes.ADD_TRANSFORMER:
      return addTransformer(state, action)
    case actionTypes.EDIT_TRANSFORMER:
      return editTransformer(state, action)
    case actionTypes.DELETE_TRANSFORMER:
      return deleteTransformer(state, action)
    case actionTypes.ADD_POWERCABINET:
      return addPowercabinet(state, action)
    case actionTypes.EDIT_POWERCABINET:
      return editPowercabinet(state, action)
    case actionTypes.DELETE_POWERCABINET:
      return deletePowercabinet(state, action)
    default: return state;
  }
};

export default reducer;
