import * as actionTypes from '../action/actionTypes';

const initialState = {

};

const setMetaInfo = (state, action) => {
  return {
    ...state,
    ...action.metaInfo
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PROJECT_METAINFO:
      return setMetaInfo(state, action);
    default: return state;
  }
};

export default reducer;
