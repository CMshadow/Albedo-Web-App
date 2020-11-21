import {
  IProjectState,
  ProjectActionTypes,
  SetBuildingReGenReportAction,
  SetProjectDataAction,
  UpdateProjectAttributesAction,
  ReleaseProjectDataAction,
  AddBuildingAction,
  EditBuildingAction,
  DeleteBuildingAction,
  AddSubAryAction,
  EditSubAryAction,
  DeleteSubAryAction,
  AddInverterSpecAction,
  EditInverterSpecAction,
  DeleteInverterSpecAction,
  AddCombiboxAction,
  EditCombiboxAction,
  DeleteCombiboxAction,
  AddTransformerAction,
  EditTransformerAction,
  DeleteTransformerAction,
  AddPowercabinetAction,
  EditPowercabinetAction,
  DeletePowercabinetAction,
  Transformer,
  PowerCabinet,
} from '../../@types'
import * as actionTypes from '../action/actionTypes'

const initialState = null

interface IReducer<A> {
  (state: IProjectState, action: A): IProjectState
}

const _cleanupTransformers = (
  transformers: Transformer[],
  changedInvSerials: string[] = [],
  changedCombiboxSerials: string[] = []
): [Transformer[], string[]] => {
  const changedTransformerSerials: string[] = []
  const newTransformers = transformers.map(transformer => {
    if (
      transformer.linked_combibox_serial_num.some(serial =>
        changedCombiboxSerials.includes(serial)
      ) ||
      transformer.linked_inverter_serial_num.some(serial => changedInvSerials.includes(serial))
    ) {
      changedTransformerSerials.push(transformer.transformer_serial_num)
      return {
        ...transformer,
        transformer_vac: null,
        linked_combibox_serial_num: [],
        linked_inverter_serial_num: [],
        Ut: null,
        transformer_capacity: null,
        transformer_linked_capacity: null,
        transformer_no_load_loss: null,
        transformer_short_circuit_loss: null,
        transformer_wir_choice: null,
      }
    } else {
      return transformer
    }
  })
  return [newTransformers, changedTransformerSerials]
}

const _cleanupPowercabinets = (
  powercabinets: PowerCabinet[],
  changedInvSerials: string[] = [],
  changedCombiboxSerials: string[] = [],
  changedTransformerSerials: string[] = []
) => {
  return powercabinets.map(powercabinet => {
    if (
      powercabinet.linked_transformer_serial_num.some(serial =>
        changedTransformerSerials.includes(serial)
      ) ||
      powercabinet.linked_combibox_serial_num.some(serial =>
        changedCombiboxSerials.includes(serial)
      ) ||
      powercabinet.linked_inverter_serial_num.some(serial => changedInvSerials.includes(serial))
    ) {
      return {
        ...powercabinet,
        linked_transformer_serial_num: [],
        linked_combibox_serial_num: [],
        linked_inverter_serial_num: [],
        Ub: null,
        powercabinet_linked_capacity: null,
      }
    } else {
      return powercabinet
    }
  })
}

const setProjectData: IReducer<SetProjectDataAction> = (state, action) => {
  return {
    ...state,
    ...action.data,
  }
}

const updateProjectAttributes: IReducer<UpdateProjectAttributesAction> = (state, action) => {
  if (!state) return state
  const preStExUpdateAt = { ...state, updatedAt: '' }
  const newStExUpdateAt = { ...state, ...action.values, updatedAt: '' }
  if (JSON.stringify(preStExUpdateAt) === JSON.stringify(newStExUpdateAt)) {
    return { ...state, ...action.values }
  } else {
    const newState = { ...state, ...action.values }
    newState.reGenReport = true
    newState.buildings && newState.buildings.forEach(building => (building.reGenReport = true))
    return newState
  }
}

const releaseProjectData: IReducer<ReleaseProjectDataAction> = () => {
  return null
}

const addBuilding: IReducer<AddBuildingAction> = (state, action) => {
  if (!state) return state
  if ('buildings' in state && state.buildings) {
    return {
      ...state,
      reGenReport: true,
      buildings: [
        ...state.buildings,
        {
          buildingID: action.buildingID,
          buildingName: action.buildingName,
          combibox_cable_len: action.combibox_cable_len,
          reGenReport: true,
          data: [],
          combibox: [],
        },
      ],
    }
  } else {
    return {
      ...state,
      reGenReport: true,
      buildings: [
        {
          buildingID: action.buildingID,
          buildingName: action.buildingName,
          combibox_cable_len: action.combibox_cable_len,
          reGenReport: true,
          data: [],
          combibox: [],
        },
      ],
    }
  }
}

const editBuilding: IReducer<EditBuildingAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const spliceIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const buildingCopy = newBuildings[spliceIndex]
  buildingCopy.buildingName = action.buildingName
  buildingCopy.combibox_cable_len = action.combibox_cable_len
  buildingCopy.reGenReport = true
  if ('combibox' in buildingCopy) {
    buildingCopy.combibox.forEach(
      (combibox, combiboxIndex) =>
        (combibox.combibox_serial_num = `${buildingCopy.buildingName}-${combiboxIndex + 1}`)
    )
  }
  newBuildings.splice(spliceIndex, 1, buildingCopy)
  return {
    ...state,
    reGenReport: true,
    buildings: newBuildings,
  }
}

const deleteBuilding: IReducer<DeleteBuildingAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const spliceIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  // 如果项目有变压器，把变压器中所有与房屋有关的逆变器汇流箱都删掉
  let newTransformers = state.transformers || []
  if ('transformers' in state) {
    newTransformers = newTransformers.map(transformer => ({
      ...transformer,
      linked_inverter_serial_num: transformer.linked_inverter_serial_num.filter(val => {
        const buildingName = val.split('-')[0]
        const buildingID = newBuildings.find(building => building.buildingName === buildingName)
          ?.buildingID
        return !(buildingID === action.buildingID)
      }),
      linked_combibox_serial_num: transformer.linked_combibox_serial_num.filter(val => {
        const buildingName = val.split('-')[0]
        const buildingID = newBuildings.find(building => building.buildingName === buildingName)
          ?.buildingID
        return !(buildingID === action.buildingID)
      }),
    }))
  }
  // 如果项目有并网柜，把并网柜中所有与房屋有关的逆变器汇流箱都删掉
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = newPowercabinets.map(powercabinet => ({
      ...powercabinet,
      linked_inverter_serial_num: powercabinet.linked_inverter_serial_num.filter(val => {
        const buildingName = val.split('-')[0]
        const buildingID = newBuildings.find(building => building.buildingName === buildingName)
          ?.buildingID
        return !(buildingID === action.buildingID)
      }),
      linked_combibox_serial_num: powercabinet.linked_combibox_serial_num.filter(val => {
        const buildingName = val.split('-')[0]
        const buildingID = newBuildings.find(building => building.buildingName === buildingName)
          ?.buildingID
        return !(buildingID === action.buildingID)
      }),
    }))
  }
  // 删除房屋
  newBuildings.splice(spliceIndex, 1)
  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const setBuildingReGenReport: IReducer<SetBuildingReGenReportAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  if (action.buildingID !== 'overview') {
    const buildingIndex = state.buildings
      .map(building => building.buildingID)
      .indexOf(action.buildingID)
    const newBuildings = [...state.buildings]
    newBuildings[buildingIndex].reGenReport = action.reGenReport
    return {
      ...state,
      buildings: newBuildings,
    }
  } else {
    return { ...state, reGenReport: action.reGenReport }
  }
}

const addSubAry: IReducer<AddSubAryAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data.push({
    pv_panel_parameters: {
      tilt_angle: null,
      azimuth: null,
      mode: null,
      celltemp_model: null,
      celltemp_vars: [],
      pv_model: { pvID: null, userID: null },
    },
    inverter_wiring: [],
  })
  return {
    ...state,
    reGenReport: true,
    buildings: newBuildings,
  }
}

const editSubAry: IReducer<EditSubAryAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const editBuilding = newBuildings[buildingIndex]
  const editSpec = editBuilding.data[action.specIndex]
  editSpec.pv_panel_parameters = {
    celltemp_model: action.celltemp_model,
    celltemp_vars: action.celltemp_vars,
    tilt_angle: Number(action.tilt_angle),
    azimuth: Number(action.azimuth),
    mode: 'single',
    pv_model: { pvID: action.pvID, userID: action.pv_userID },
  }
  if ('ac_cable_avg_len' in action && 'dc_cable_avg_len' in action) {
    editSpec.pv_panel_parameters['ac_cable_avg_len'] = Number(action.ac_cable_avg_len)
    editSpec.pv_panel_parameters['dc_cable_avg_len'] = Number(action.dc_cable_avg_len)
  }
  editBuilding.reGenReport = true
  const changedInvSerials = editSpec.inverter_wiring.map(
    (inv, index) => `${editBuilding.buildingName}-${action.specIndex + 1}-${index + 1}`
  )
  // 如果带自动匹配逆变器结果，则直接给spec加入逆变器配置
  if (action.invPlan && action.invPlan.plan) {
    editSpec.inverter_wiring = action.invPlan.plan.map((plan, index) => ({
      inverter_serial_number: index + 1,
      panels_per_string: plan.pps,
      string_per_inverter: plan.spi,
      inverter_model: {
        inverterID: action.invPlan ? action.invPlan.inverterID : '',
        userID: action.invPlan ? action.invPlan.inverterUserID : '',
      },
      ac_cable_len: Number(action.ac_cable_avg_len) || 0,
      dc_cable_len: new Array(plan.spi).fill(Number(action.dc_cable_avg_len) || 0),
    }))
  }
  // 如果带自动匹配逆变器结果，并且spec已有combibox，把每个combibox中存在该spec的逆变器去除掉
  // （因为自动匹配逆变器结果会覆盖spec上现有逆变器）
  const changedCombiboxSerials: string[] = []
  if (action.invPlan && action.invPlan.plan && 'combibox' in editBuilding) {
    editBuilding.combibox = editBuilding.combibox.map(combibox => {
      const new_linked_inv_serial_num = combibox.linked_inverter_serial_num.filter(
        val => Number(val.split('-')[0]) - 1 !== action.specIndex
      )
      if (new_linked_inv_serial_num.length !== combibox.linked_inverter_serial_num.length) {
        changedCombiboxSerials.push(`${combibox.combibox_serial_num}`)
      }
      return {
        ...combibox,
        linked_inverter_serial_num: new_linked_inv_serial_num,
      }
    })
  }
  // 如果带自动匹配逆变器结果，并且项目中有变压器，清空跟该spec有关或和变动过的combibox有关的变压器
  let changedTransformerSerials: string[] = []
  let newTransformers = state.transformers || []
  if (action.invPlan && action.invPlan.plan && 'transformers' in state) {
    ;[newTransformers, changedTransformerSerials] = _cleanupTransformers(
      newTransformers,
      changedInvSerials,
      changedCombiboxSerials
    )
  }
  // 如果带自动匹配逆变器结果，并且项目中有并网柜，清空跟该spec有关或和变动过的combibox有关或和变动过的变压器有关的并网柜
  let newPowercabinets = state.powercabinets || []
  if (action.invPlan && action.invPlan.plan && 'powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(
      newPowercabinets,
      changedInvSerials,
      changedCombiboxSerials,
      changedTransformerSerials
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const deleteSubAry: IReducer<DeleteSubAryAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const editBuilding = newBuildings[buildingIndex]
  const editSpec = editBuilding.data[action.specIndex]
  const changedInvSerials = editSpec.inverter_wiring.map(
    (inv, index) => `${editBuilding.buildingName}-${action.specIndex + 1}-${index + 1}`
  )
  editBuilding.reGenReport = true
  editBuilding.data.splice(action.specIndex, 1)

  // 如果房屋有汇流箱，把汇流箱中所有与spec有关的逆变器都删掉，并把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
  const changedCombiboxSerials: string[] = []
  if ('combibox' in editBuilding) {
    editBuilding.combibox = editBuilding.combibox.map(combibox => {
      const new_linked_inv_serial_num = combibox.linked_inverter_serial_num.filter(
        val => Number(val.split('-')[0]) - 1 !== action.specIndex
      )
      if (new_linked_inv_serial_num.length !== combibox.linked_inverter_serial_num.length) {
        changedCombiboxSerials.push(combibox.combibox_serial_num)
      }
      return {
        ...combibox,
        linked_inverter_serial_num: new_linked_inv_serial_num.map(val => {
          const subAryIndex = Number(val.split('-')[0]) - 1
          return subAryIndex < action.specIndex ? val : `${subAryIndex}-${val.split('-')[1]}`
        }),
      }
    })
  }
  // 如果项目有变压器，清空跟该spec有关或和变动过的combibox有关的变压器，再把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
  let changedTransformerSerials: string[] = []
  let newTransformers = state.transformers || []
  if ('transformers' in state) {
    ;[newTransformers, changedTransformerSerials] = _cleanupTransformers(
      newTransformers,
      changedInvSerials,
      changedCombiboxSerials
    )
    // 把所有specIndex后面的汇流箱编号中的specIndex前移一个数字的操作
    newTransformers.forEach(
      trans =>
        (trans.linked_inverter_serial_num = trans.linked_inverter_serial_num.map(val => {
          const buildingName = val.split('-')[0]
          const specIndex = Number(val.split('-')[1]) - 1
          const buildingID = newBuildings.find(building => building.buildingName === buildingName)
            ?.buildingID
          if (buildingID === action.buildingID && specIndex > action.specIndex) {
            return `${buildingName}-${specIndex}-${val.split('-')[2]}`
          } else {
            return val
          }
        }))
    )
  }
  // 如果项目有并网柜，清空跟该spec有关或和变动过的combibox有关或和变动过的变压器有关的并网柜，
  // 并把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(
      newPowercabinets,
      changedInvSerials,
      changedCombiboxSerials,
      changedTransformerSerials
    )
    // 把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
    newPowercabinets.forEach(
      powercabinet =>
        (powercabinet.linked_inverter_serial_num = powercabinet.linked_inverter_serial_num.map(
          val => {
            const buildingName = val.split('-')[0]
            const specIndex = Number(val.split('-')[1]) - 1
            const buildingID = newBuildings.find(building => building.buildingName === buildingName)
              ?.buildingID
            if (buildingID === action.buildingID && specIndex > action.specIndex) {
              return `${buildingName}-${specIndex}-${val.split('-')[2]}`
            } else {
              return val
            }
          }
        ))
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const addInverterSpec: IReducer<AddInverterSpecAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true
  newBuildings[buildingIndex].data[action.specIndex].inverter_wiring.push({
    inverter_serial_number:
      newBuildings[buildingIndex].data[action.specIndex].inverter_wiring.length + 1,
    panels_per_string: null,
    string_per_inverter: null,
    ac_cable_len: null,
    dc_cable_len: [],
    inverter_model: { inverterID: null, userID: null },
  })
  return {
    ...state,
    reGenReport: true,
    buildings: newBuildings,
  }
}

const editInverterSpec: IReducer<EditInverterSpecAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const oldInverterID =
    state.buildings[buildingIndex].data[action.specIndex].inverter_wiring[action.invIndex]
      .inverter_model.inverterID
  const newBuildings = [...state.buildings]
  const editBuilding = newBuildings[buildingIndex]
  const editSpec = editBuilding.data[action.specIndex]
  editBuilding.reGenReport = true
  editSpec.inverter_wiring[action.invIndex] = {
    inverter_serial_number: editSpec.inverter_wiring[action.invIndex].inverter_serial_number,
    panels_per_string: action.panels_per_string,
    string_per_inverter: action.string_per_inverter,
    ac_cable_len: action.ac_cable_len,
    dc_cable_len: action.dc_cable_len,
    inverter_model: { inverterID: action.inverterID, userID: action.inverter_userID },
  }
  const changedInvSerials = [
    `${editBuilding.buildingName}-${action.specIndex + 1}-${action.invIndex + 1}`,
  ]
  // 如果更改了逆变器型号并且房屋有汇流箱，把汇流箱中关联的该逆变器去除
  const changedCombiboxSerials: string[] = []
  if (action.inverterID !== oldInverterID && 'combibox' in editBuilding) {
    editBuilding.combibox = editBuilding.combibox.map(combibox => {
      const new_linked_inv_serial_num = combibox.linked_inverter_serial_num.filter(
        val => val !== `${action.specIndex + 1}-${action.invIndex + 1}`
      )
      if (new_linked_inv_serial_num.length !== combibox.linked_inverter_serial_num.length) {
        changedCombiboxSerials.push(combibox.combibox_serial_num)
      }
      return {
        ...combibox,
        linked_inverter_serial_num: new_linked_inv_serial_num,
      }
    })
  }
  // 如果更改了逆变器型号并且项目有变压器，把连接逆变器的变压器清空
  let changedTransformerSerials: string[] = []
  let newTransformers = state.transformers || []
  if (action.inverterID !== oldInverterID && 'transformers' in state) {
    ;[newTransformers, changedTransformerSerials] = _cleanupTransformers(
      newTransformers,
      changedInvSerials,
      changedCombiboxSerials
    )
  }
  // 如果更改了逆变器型号并且项目有并网柜，把连接逆变器的并网柜清空
  let newPowercabinets = state.powercabinets || []
  if (action.inverterID !== oldInverterID && 'powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(
      newPowercabinets,
      changedInvSerials,
      changedCombiboxSerials,
      changedTransformerSerials
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const deleteInverterSpec: IReducer<DeleteInverterSpecAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const editBuilding = newBuildings[buildingIndex]
  const editSpec = editBuilding.data[action.specIndex]
  editBuilding.reGenReport = true
  editSpec.inverter_wiring.splice(action.invIndex, 1)
  editSpec.inverter_wiring.forEach((obj, ind) => (obj.inverter_serial_number = ind + 1))

  const changedInvSerials = [
    `${editBuilding.buildingName}-${action.specIndex + 1}-${action.invIndex + 1}`,
  ]
  // 如果房屋有汇流箱，剔除掉该逆变器并把后续逆变器编号往前减一位
  const changedCombiboxSerials: string[] = []
  if ('combibox' in editBuilding) {
    editBuilding.combibox = editBuilding.combibox.map(combibox => {
      const new_linked_inv_serial_num = combibox.linked_inverter_serial_num.filter(
        val => val !== `${action.specIndex + 1}-${action.invIndex + 1}`
      )
      if (new_linked_inv_serial_num.length !== combibox.linked_inverter_serial_num.length) {
        changedCombiboxSerials.push(combibox.combibox_serial_num)
      }

      return {
        ...combibox,
        linked_inverter_serial_num: new_linked_inv_serial_num.map(val => {
          const subAryIndex = Number(val.split('-')[0]) - 1
          const invIndex = Number(val.split('-')[1]) - 1
          if (subAryIndex === action.specIndex) {
            return invIndex >= action.invIndex ? `${subAryIndex + 1}-${invIndex}` : val
          } else {
            return val
          }
        }),
      }
    })
  }
  // 如果项目有变压器，清空跟该spec有关或和变动过的combibox有关的变压器
  let changedTransformerSerials: string[] = []
  let newTransformers = state.transformers || []
  if ('transformers' in state) {
    ;[newTransformers, changedTransformerSerials] = _cleanupTransformers(
      newTransformers,
      changedInvSerials,
      changedCombiboxSerials
    )
    // 把所有specIndex后面的汇流箱编号中的specIndex前移一个数字的操作
    newTransformers.forEach(
      trans =>
        (trans.linked_inverter_serial_num = trans.linked_inverter_serial_num.map(val => {
          const buildingName = val.split('-')[0]
          const specIndex = Number(val.split('-')[1]) - 1
          const invIndex = Number(val.split('-')[2]) - 1
          if (buildingName === editBuilding.buildingName && specIndex === action.specIndex) {
            return invIndex >= action.invIndex
              ? `${buildingName}-${specIndex + 1}-${invIndex}`
              : val
          } else {
            return val
          }
        }))
    )
  }
  // 如果项目有并网柜，清空跟该spec有关或和变动过的combibox有关或和变动过的变压器有关的并网柜
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(
      newPowercabinets,
      changedInvSerials,
      changedCombiboxSerials,
      changedTransformerSerials
    )
    // 把所有specIndex后面的汇流箱编号中的specIndex前移一个数字
    newPowercabinets.forEach(
      powercabinet =>
        (powercabinet.linked_inverter_serial_num = powercabinet.linked_inverter_serial_num.map(
          val => {
            const buildingName = val.split('-')[0]
            const specIndex = Number(val.split('-')[1]) - 1
            const invIndex = Number(val.split('-')[2]) - 1
            if (buildingName === editBuilding.buildingName && specIndex === action.specIndex) {
              return invIndex >= action.invIndex
                ? `${buildingName}-${specIndex + 1}-${invIndex}`
                : val
            } else {
              return val
            }
          }
        ))
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const addCombibox: IReducer<AddCombiboxAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true

  const newCombibox = {
    combibox_name: null,
    combibox_cable_len: newBuildings[buildingIndex].combibox_cable_len,
    combibox_serial_num:
      'combibox' in newBuildings[buildingIndex]
        ? `${newBuildings[buildingIndex].buildingName}-${
            newBuildings[buildingIndex].combibox.length + 1
          }`
        : `${newBuildings[buildingIndex].buildingName}-1`,
    combibox_vac: null,
    linked_inverter_serial_num: [],
  }
  if ('combibox' in newBuildings[buildingIndex]) {
    newBuildings[buildingIndex].combibox.push(newCombibox)
  } else {
    newBuildings[buildingIndex].combibox = [newCombibox]
  }
  return {
    ...state,
    reGenReport: true,
    buildings: newBuildings,
  }
}

const editCombibox: IReducer<EditCombiboxAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  newBuildings[buildingIndex].reGenReport = true

  const newCombibox = {
    combibox_name: action.combibox_name,
    combibox_cable_len: action.combibox_cable_len,
    combibox_serial_num:
      newBuildings[buildingIndex].combibox[action.combiboxIndex].combibox_serial_num,
    combibox_vac: action.combibox_vac,
    linked_inverter_serial_num: action.linked_inverter_serial_num,
  }
  newBuildings[buildingIndex].combibox[action.combiboxIndex] = newCombibox
  // 如果项目有变压器，把和combibox关联的变压器数值清零
  let changedTransformerSerials: string[] = []
  let newTransformers = state.transformers || []
  if ('transformers' in state) {
    ;[newTransformers, changedTransformerSerials] = _cleanupTransformers(
      newTransformers,
      [],
      [newCombibox.combibox_serial_num]
    )
  }
  // 如果项目有并网柜，把和combibox关联的或和有变动的变压器有关的并网柜数值清零
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(
      newPowercabinets,
      [],
      [newCombibox.combibox_serial_num],
      changedTransformerSerials
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const deleteCombibox: IReducer<DeleteCombiboxAction> = (state, action) => {
  if (!state || !('buildings' in state)) return state
  const buildingIndex = state.buildings
    .map(building => building.buildingID)
    .indexOf(action.buildingID)
  const newBuildings = [...state.buildings]
  const editBuilding = newBuildings[buildingIndex]
  editBuilding.reGenReport = true
  const changedCombiboxSerials = [editBuilding.combibox[action.combiboxIndex].combibox_serial_num]

  editBuilding.combibox.splice(action.combiboxIndex, 1)
  editBuilding.combibox.forEach(
    (combibox, index) =>
      (combibox.combibox_serial_num = `${editBuilding.buildingName}-${index + 1}`)
  )

  // 如果项目有变压器，把和combibox关联的变压器数值清零，并把同房屋上后续汇流箱编号往前减一位
  let changedTransformerSerials: string[] = []
  let newTransformers = state.transformers || []
  if ('transformers' in state) {
    ;[newTransformers, changedTransformerSerials] = _cleanupTransformers(
      newTransformers,
      [],
      changedCombiboxSerials
    )
    newTransformers.forEach(
      trans =>
        (trans.linked_combibox_serial_num = trans.linked_combibox_serial_num.map(val => {
          const buildingName = val.split('-')[0]
          const combiboxIndex = Number(val.split('-')[1]) - 1
          if (buildingName === editBuilding.buildingName) {
            return combiboxIndex >= action.combiboxIndex ? `${buildingName}-${combiboxIndex}` : val
          } else {
            return val
          }
        }))
    )
  }
  // 如果项目有并网柜，把和combibox关联的或和有变动的变压器有关的并网柜数值清零，并把同房屋上后续汇流箱编号往前减一位
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(
      newPowercabinets,
      [],
      changedCombiboxSerials,
      changedTransformerSerials
    )
    newPowercabinets.forEach(
      pwrcab =>
        (pwrcab.linked_combibox_serial_num = pwrcab.linked_combibox_serial_num.map(val => {
          const buildingName = val.split('-')[0]
          const combiboxIndex = Number(val.split('-')[1]) - 1
          if (buildingName === editBuilding.buildingName) {
            return combiboxIndex >= action.combiboxIndex ? `${buildingName}-${combiboxIndex}` : val
          } else {
            return val
          }
        }))
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
    buildings: newBuildings,
  }
}

const addTransformer: IReducer<AddTransformerAction> = state => {
  if (!state || !('transformers' in state)) return state
  const newTransformers = state.transformers ? [...state.transformers] : []
  const newTransformer = {
    transformer_name: null,
    transformer_cable_len: null,
    transformer_serial_num: `${newTransformers.length + 1}`,
    transformer_vac: null,
    linked_combibox_serial_num: [],
    linked_inverter_serial_num: [],
    Ut: null,
    transformer_capacity: null,
    transformer_linked_capacity: null,
    transformer_no_load_loss: null,
    transformer_power: 150,
    transformer_short_circuit_loss: null,
    transformer_type: null,
    transformer_ACVolDropFac: null,
    transformer_high_voltage_cable_Ib: 31.5,
    transformer_wir_choice: null,
  }
  newTransformers.push(newTransformer)

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
  }
}

const editTransformer: IReducer<EditTransformerAction> = (state, action) => {
  if (!state || !('transformers' in state)) return state
  const newTransformers = state.transformers ? [...state.transformers] : []
  const newTransformer = {
    transformer_name: action.transformer_name,
    transformer_cable_len: action.transformer_cable_len,
    transformer_serial_num: `${action.transformerIndex + 1}`,
    transformer_vac: action.transformer_vac,
    linked_combibox_serial_num: action.linked_combibox_serial_num,
    linked_inverter_serial_num: action.linked_inverter_serial_num,
    Ut: action.Ut,
    transformer_capacity: Number(action.transformer_capacity),
    transformer_linked_capacity: action.transformer_linked_capacity,
    transformer_no_load_loss: Number(action.transformer_no_load_loss),
    transformer_power: Number(action.transformer_power),
    transformer_short_circuit_loss: Number(action.transformer_short_circuit_loss),
    transformer_type: action.transformer_type,
    transformer_ACVolDropFac: action.transformer_ACVolDropFac,
    transformer_high_voltage_cable_Ib: action.transformer_high_voltage_cable_Ib,
    transformer_wir_choice: action.transformer_wir_choice,
  }
  newTransformers.splice(action.transformerIndex, 1, newTransformer)
  const changedTransformerSerials = [newTransformer.transformer_serial_num]
  // 如果项目有并网柜，把和变压器有关的并网柜数值清零
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(newPowercabinets, [], [], changedTransformerSerials)
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
  }
}

const deleteTransformer: IReducer<DeleteTransformerAction> = (state, action) => {
  if (!state || !('transformers' in state)) return state
  const newTransformers = state.transformers ? [...state.transformers] : []
  const changedTransformerSerials = [`${action.transformerIndex + 1}`]
  newTransformers.splice(action.transformerIndex, 1)
  newTransformers.forEach(
    (transformer, index) => (transformer.transformer_serial_num = `${index + 1}`)
  )
  // 如果项目有并网柜，把和变压器有关的并网柜数值清零，并把同房屋上后续变压器编号往前减一位
  let newPowercabinets = state.powercabinets || []
  if ('powercabinets' in state) {
    newPowercabinets = _cleanupPowercabinets(newPowercabinets, [], [], changedTransformerSerials)
    newPowercabinets.forEach(
      pwrcab =>
        (pwrcab.linked_transformer_serial_num = pwrcab.linked_transformer_serial_num.map(val =>
          Number(val) > action.transformerIndex ? `${Number(val) - 1}` : val
        ))
    )
  }

  return {
    ...state,
    reGenReport: true,
    transformers: newTransformers,
    powercabinets: newPowercabinets,
  }
}

const addPowercabinet: IReducer<AddPowercabinetAction> = state => {
  if (!state || !('powercabinets' in state)) return state
  const newPowercabinets = state.powercabinets ? [...state.powercabinets] : []
  const newPowercabinet = {
    powercabinet_name: null,
    powercabinet_serial_num: `${newPowercabinets.length + 1}`,
    linked_transformer_serial_num: [],
    linked_combibox_serial_num: [],
    linked_inverter_serial_num: [],
    Ub: null,
    powercabinet_linked_capacity: null,
  }
  newPowercabinets.push(newPowercabinet)

  return {
    ...state,
    reGenReport: true,
    powercabinets: newPowercabinets,
  }
}

const editPowercabinet: IReducer<EditPowercabinetAction> = (state, action) => {
  if (!state || !('powercabinets' in state)) return state
  const newPowercabinets = state.powercabinets ? [...state.powercabinets] : []
  const newPowercabinet = {
    powercabinet_name: action.powercabinet_name,
    powercabinet_serial_num: `${action.powercabinetIndex + 1}`,
    linked_transformer_serial_num: action.linked_transformer_serial_num || [],
    linked_combibox_serial_num: action.linked_combibox_serial_num || [],
    linked_inverter_serial_num: action.linked_inverter_serial_num || [],
    Ub: action.Ub,
    powercabinet_linked_capacity: action.powercabinet_linked_capacity,
  }
  newPowercabinets.splice(action.powercabinetIndex, 1, newPowercabinet)

  return {
    ...state,
    reGenReport: true,
    powercabinets: newPowercabinets,
  }
}

const deletePowercabinet: IReducer<DeletePowercabinetAction> = (state, action) => {
  if (!state || !('powercabinets' in state)) return state
  const newPowercabinets = state.powercabinets ? [...state.powercabinets] : []
  newPowercabinets.splice(action.powercabinetIndex, 1)

  return {
    ...state,
    reGenReport: true,
    powercabinets: newPowercabinets,
  }
}

const reducer = (state = initialState, action: ProjectActionTypes): IProjectState => {
  switch (action.type) {
    case actionTypes.SET_PROJECTDATA:
      return setProjectData(state, action)
    case actionTypes.UPDATE_PROJECTATTRIBUTES:
      return updateProjectAttributes(state, action)
    case actionTypes.RELEASE_PROJECTDATA:
      return releaseProjectData(state, action)
    case actionTypes.ADD_BUILDING:
      return addBuilding(state, action)
    case actionTypes.EDIT_BUILDING:
      return editBuilding(state, action)
    case actionTypes.DELETE_BUILDING:
      return deleteBuilding(state, action)
    case actionTypes.SET_BUILDING_REGENREPORT:
      return setBuildingReGenReport(state, action)
    case actionTypes.ADD_PV_SPEC:
      return addSubAry(state, action)
    case actionTypes.EDIT_PV_SPEC:
      return editSubAry(state, action)
    case actionTypes.DELETE_PV_SPEC:
      return deleteSubAry(state, action)
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
    default:
      return state
  }
}

export default reducer
