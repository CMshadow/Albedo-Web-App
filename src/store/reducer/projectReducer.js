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
        {buildingID: uuidv1(), buildingName: action.buildingName}
      ]
    }
  } else {
    return {
      ...state,
      buildings: [
        {buildingID: uuidv1(), buildingName: action.buildingName}
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

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PROJECTDATA:
      return setProjectData(state, action);
    case actionTypes.ADD_BUILDING:
      return addBuilding(state, action);
    case actionTypes.DELETE_BUILDING:
      return deleteBuilding(state, action)
    default: return state;
  }
};

export default reducer;
