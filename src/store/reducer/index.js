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
import drawingObjReducer from './drawing/drawingObjReducer'
import drawingPointReducer from './drawing/pointReducer'
import drawingPolygonReducer from './drawing/polygonReducer'
import drawingPolylineReducer from './drawing/polylineReducer'

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
    drawing: drawingObjReducer,
    point: drawingPointReducer,
    polygon: drawingPolygonReducer,
    polyline: drawingPolylineReducer
  }), {
    initTypes: ['@@redux/INIT'],
    filter: includeAction([

    ]),
  })
});

export default rootReducer;
