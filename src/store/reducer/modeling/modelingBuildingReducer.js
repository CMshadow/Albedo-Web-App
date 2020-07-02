import * as uiTypes from '../../action/modeling/modelingUITypes'
import * as actionTypes from '../../action/actionTypes';

const FOUNDATION = 'FOUNDATION'

const initialState = {
  buildingName: '1',
  buildingType: '1',
  bulidingHeight: 5,
  parapetHeight: 5,
  eaveSetback: 5,
  buildingPolygonId: [],
  keepoutId: [],
  passageId: [],
  ventId: [],
  treeId: [],
  envId: []
}

const setBuildingParams = (state, action) => {
  return {
    buildingName: action.buildingName,
    buildingType: action.buildingType,
    bulidingHeight: action.buildingHeight,
    parapetHeight: action.parapetHeight,
    eaveSetback: action.eaveSetback,
    buildingPolygonId: [],
    keepoutId: [],
    passageId: [],
    ventId: [],
    treeId: [],
    envId: []
  }
}

const bindDrawingObj = (state, action) => {
  const newState = {...state}
  switch (action.objType) {
    case FOUNDATION:
      newState.buildingPolygonId = [action.objId]
      break
    default:
      break
  }
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.MODELING_CREATE_BUILDING:
      return setBuildingParams(state, action)
    case actionTypes.BIND_DRAWING_OBJECT:
      return bindDrawingObj(state, action)
    default: return state;
  }
};

export default reducer;
