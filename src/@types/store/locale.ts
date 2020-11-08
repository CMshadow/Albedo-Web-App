import { Locale } from '../../@types'
import { SET_LOCALE } from '../../store/action/actionTypes'

export interface ILocalState {
  locale: Locale
}

interface SetLocalAction {
  type: typeof SET_LOCALE
  locale: Locale
}

export type LocalActionTypes = SetLocalAction