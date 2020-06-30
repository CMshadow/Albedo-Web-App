import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import authReducer from './authReducer';
import localReducer from './locale'
import projectReducer from './projectReducer';
import pvTableReducer from './pvTableReducer'
import inverterTableReducer from './inverterTableReducer'
import reportReducer from './reportReducer'
import SLDReducer from './SLDReducer'
import cesiumReducer from './cesiumReducer'
import drawingStatusReducer from './drawing/statusReducer'
import drawingObjReducer from './drawing/drawingObjReducer'
import drawingPointReducer from './drawing/pointReducer'
import drawingPolygonReducer from './drawing/polygonReducer'
import drawingPolylineReducer from './drawing/polylineReducer'
import drawingCircleReducer from './drawing/circleReducer'
import drawingSectorReducer from './drawing/sectorReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  locale: localReducer,
  project: projectReducer,
  pv: pvTableReducer,
  inverter: inverterTableReducer,
  report: reportReducer,
  SLD: SLDReducer,
  cesium: cesiumReducer,
  undoable: undoable(combineReducers({
    drwStat: drawingStatusReducer,
    drawing: drawingObjReducer,
    point: drawingPointReducer,
    polygon: drawingPolygonReducer,
    polyline: drawingPolylineReducer,
    circle: drawingCircleReducer,
    sector: drawingSectorReducer
  }), {
    initTypes: ['@@redux/INIT'],
    filter: includeAction([

    ]),
  })
});

export default rootReducer;
