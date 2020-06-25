import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import authReducer from './authReducer';
import localReducer from './locale'
import projectReducer from './projectReducer';
import pvTableReducer from './pvTableReducer'
import inverterTableReducer from './inverterTableReducer'
import reportReducer from './reportReducer'
import cesiumReducer from './cesiumReducer'
import drawingStatusReducer from './drawing/statusReducer'
import pickedReducer from './drawing/pickedReducer'
import drawingPointReducer from './drawing/pointReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  locale: localReducer,
  project: projectReducer,
  pv: pvTableReducer,
  inverter: inverterTableReducer,
  report: reportReducer,
  cesium: cesiumReducer,
  undoable: undoable(combineReducers({
    drwStat: drawingStatusReducer,
    point: drawingPointReducer,
    picked: pickedReducer
  }), {
    initTypes: ['@@redux/INIT'],
    filter: includeAction([

    ]),
  })
});

export default rootReducer;
