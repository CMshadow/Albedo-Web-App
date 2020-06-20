import { combineReducers } from 'redux';
// import undoable, { includeAction } from 'redux-undo';
import authReducer from './authReducer';
import localReducer from './locale'
import projectReducer from './projectReducer';
import pvTableReducer from './pvTableReducer'
import inverterTableReducer from './inverterTableReducer'
import reportReducer from './reportReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  locale: localReducer,
  project: projectReducer,
  pv: pvTableReducer,
  inverter: inverterTableReducer,
  report: reportReducer
  // undoable: undoable(combineReducers({
  // }), {
  //   initTypes: ['@@redux/INIT'],
  //   filter: includeAction([
  //
  //   ]),
  // })
});

export default rootReducer;
