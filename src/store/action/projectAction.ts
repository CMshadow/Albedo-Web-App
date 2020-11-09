import * as actionTypes from './actionTypes'
import { ThunkAction } from 'redux-thunk'
import {
  RootState,
  ProjectActionTypes,
  Project,
  AddBuildingParams,
  EditBuildingParams,
  SetBuildingReGenReportParams,
  EditSubAryParams,
  DeleteSubAryParams,
  AddInverterSpecParams,
  EditInverterSpecParams,
  DeleteInverterSpecParams,
  EditCombiboxParams,
  DeleteCombiboxParams,
  EditTransformerParams,
  EditPowercabinetParams,
} from '../../@types'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, ProjectActionTypes>

interface IAction<P, T> {
  (param: P): ThunkResult<T>
}

export const setProjectData: IAction<Project, void> = data => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_PROJECTDATA,
    data: data,
  })
}

export const updateProjectAttributes: IAction<Partial<Project>, void> = values => (dispatch, getState) => {
  dispatch({
    type: actionTypes.UPDATE_PROJECTATTRIBUTES,
    values: values,
  })
}

export const releaseProjectData: IAction<void, void> = () => (dispatch, getState) => {
  dispatch({
    type: actionTypes.RELEASE_PROJECTDATA,
  })
}

export const addBuilding: IAction<AddBuildingParams, void> = values => (dispatch, getState) => {
  dispatch({
    type: actionTypes.ADD_BUILDING,
    ...values,
  })
}

export const editBuilding: IAction<EditBuildingParams, void> = ({ buildingID, ...values }) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.EDIT_BUILDING,
    buildingID: buildingID,
    ...values,
  })
}

export const deleteBuilding: IAction<string, void> = buildingID => (dispatch, getState) => {
  dispatch({
    type: actionTypes.DELETE_BUILDING,
    buildingID: buildingID,
  })
}

export const setBuildingReGenReport: IAction<SetBuildingReGenReportParams, void> = ({ buildingID, reGenReport }) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: actionTypes.SET_BUILDING_REGENREPORT,
    buildingID: buildingID,
    reGenReport: reGenReport,
  })
}

export const addSubAry: IAction<string, void> = buildingID => (dispatch, getState) => {
  dispatch({
    type: actionTypes.ADD_PV_SPEC,
    buildingID: buildingID,
  })
}

export const editSubAry: IAction<EditSubAryParams, void> = ({ buildingID, specIndex, ...values }) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.EDIT_PV_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
    ...values,
  })
}

export const deleteSubAry: IAction<DeleteSubAryParams, void> = ({ buildingID, specIndex }) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.DELETE_PV_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
  })
}

export const addInverterSpec: IAction<AddInverterSpecParams, void> = ({ buildingID, specIndex }) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.ADD_INVERTER_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
  })
}

export const editInverterSpec: IAction<EditInverterSpecParams, void> = ({
  buildingID,
  specIndex,
  invIndex,
  ...values
}) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.EDIT_INVERTER_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
    invIndex: invIndex,
    ...values,
  })
}

export const deleteInverterSpec: IAction<DeleteInverterSpecParams, void> = ({ buildingID, specIndex, invIndex }) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.DELETE_INVERTER_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
    invIndex: invIndex,
  })
}

export const addCombibox: IAction<string, void> = buildingID => (dispatch, getState) => {
  dispatch({
    type: actionTypes.ADD_COMBIBOX,
    buildingID: buildingID,
  })
}

export const editCombibox: IAction<EditCombiboxParams, void> = ({ buildingID, combiboxIndex, ...values }) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.EDIT_COMBIBOX,
    buildingID: buildingID,
    combiboxIndex: combiboxIndex,
    ...values,
  })
}

export const deleteCombibox: IAction<DeleteCombiboxParams, void> = ({ buildingID, combiboxIndex }) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.DELETE_COMBIBOX,
    buildingID: buildingID,
    combiboxIndex: combiboxIndex,
  })
}

export const addTransformer: IAction<void, void> = () => (dispatch, getState) => {
  dispatch({
    type: actionTypes.ADD_TRANSFORMER,
  })
}

export const editTransformer: IAction<EditTransformerParams, void> = ({ transformerIndex, ...values }) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.EDIT_TRANSFORMER,
    transformerIndex: transformerIndex,
    ...values,
  })
}

export const deleteTransformer: IAction<number, void> = transformerIndex => (dispatch, getState) => {
  dispatch({
    type: actionTypes.DELETE_TRANSFORMER,
    transformerIndex: transformerIndex,
  })
}

export const addPowercabinet: IAction<void, void> = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.ADD_POWERCABINET,
  })
}

export const editPowercabinet: IAction<EditPowercabinetParams, void> = ({ powercabinetIndex, ...values }) => (
  dispatch,
  getState
) => {
  return dispatch({
    type: actionTypes.EDIT_POWERCABINET,
    powercabinetIndex: powercabinetIndex,
    ...values,
  })
}

export const deletePowercabinet: IAction<number, void> = powercabinetIndex => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DELETE_POWERCABINET,
    powercabinetIndex: powercabinetIndex,
  })
}
