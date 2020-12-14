import * as actionTypes from '../action/actionTypes'
import { ILocalState, LocalActionTypes } from '../../@types'
import { getLanguage } from '../../utils/getLanguage'

const initialState: ILocalState = {
  locale: getLanguage(),
}

const setLocale = (state: ILocalState, action: LocalActionTypes) => {
  return {
    locale: action.locale,
  }
}

const reducer = (state = initialState, action: LocalActionTypes): ILocalState => {
  switch (action.type) {
    case actionTypes.SET_LOCALE:
      return setLocale(state, action)
    default:
      return state
  }
}

export default reducer
