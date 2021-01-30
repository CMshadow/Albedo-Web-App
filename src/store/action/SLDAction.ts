import * as ActionTypes from './actionTypes'
import { ThunkAction } from 'redux-thunk'
import { RootState, SingleLineDiagramActionType } from '../../@types'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, SingleLineDiagramActionType>

interface IAction<P, R> {
  (param: P): ThunkResult<R>
}

interface IInverterSet {
  width: number
  accessPorts: [number, number][][]
  pvGap: number
}

interface IInterConnectSet {
  accessPorts: [number, number]
  startPosition: [number, number]
  size: number
}

interface IComponentAccess {
  accessPorts: [number, number]
  startPosition: [number, number]
}

export const setPVDist: IAction<number, void> = newPVDist => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_PV_DIST,
    pvDist: newPVDist,
  })
}

export const setInverterWidth: IAction<IInverterSet, void> = ({ width, accessPorts, pvGap }) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_INVERTER_WIDTH,
    width: width,
    pvGap: pvGap,
    accessPoints: accessPorts,
  })
}

export const inverterDataExport: IAction<[number, number][], void> = accessPoints => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_INVERTER_DATA_SLD,
    accessPoints: accessPoints,
  })
}

export const setInterConnectData: IAction<IInterConnectSet, void> = ({
  accessPorts,
  startPosition,
  size,
}) => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_INTERCONNECT_DATA,
    startPosition: startPosition,
    accessPoints: accessPorts,
    size: size,
  })
}

export const setResize: IAction<number, void> = height => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_SIZE,
    height: height,
  })
}

export const setServerPanel: IAction<IComponentAccess, void> = ({ accessPorts, startPosition }) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_SERVER_PANEL,
    startPosition: startPosition,
    accessPoints: accessPorts,
  })
}

export const setMeter: IAction<IComponentAccess, void> = ({ accessPorts, startPosition }) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_METER,
    startPosition: startPosition,
    accessPoints: accessPorts,
  })
}

export const setGrid: IAction<IComponentAccess, void> = ({ accessPorts, startPosition }) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_GRID,
    startPosition: startPosition,
    accessPoints: accessPorts,
  })
}

export const setWidth: IAction<number, void> = width => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_WIDTH,
    width: width,
  })
}

export const setStartPosition: IAction<[number, number], void> = position => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_START_POSTION,
    position: position,
  })
}

export const setDiagramWidth: IAction<number, void> = width => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_DIAGRAM_WIDTH,
    width: width,
  })
}

export const setDiagramHeight: IAction<number, void> = height => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_DIAGRAM_HEIGHT,
    height: height,
  })
}

export const setInverterAccessPorts: IAction<[number, number][], void> = accessPortsList => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_INVERTER_ACCESSPORTS,
    accessPoints: accessPortsList,
  })
}

export const setMeterAccess: IAction<[number, number], void> = position => (dispatch, getState) => {
  return dispatch({
    type: ActionTypes.SET_METER_ACCESS,
    meterAccess: position,
  })
}

export const setMeterAccessAllIn: IAction<[number, number], void> = position => (
  dispatch,
  getState
) => {
  return dispatch({
    type: ActionTypes.SET_METER_ACCESS_ALL_IN,
    meterAllInAccess: position,
  })
}
