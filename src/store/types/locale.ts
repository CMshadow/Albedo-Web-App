import { SET_LOCALE } from '../action/actionTypes'

export type Locale = 'zh-CN' | 'en-US'

export interface ILocalState {
  locale: Locale
}

interface SetLocalAction {
  type: typeof SET_LOCALE
  locale: Locale
}

export type LocalActionTypes = SetLocalAction