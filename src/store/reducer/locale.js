import * as actionTypes from '../action/actionTypes';
import { getLanguage } from '../../utils/getLanguage'

const initialState = {
  locale: getLanguage()
};

const setLocale = (state, action) => {
  return {
    locale: action.locale
  }
}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_LOCALE:
      return setLocale(state, action);
    default: return state;
  }
};

export default reducer;
