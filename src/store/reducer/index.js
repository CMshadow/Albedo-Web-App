import { combineReducers } from 'redux';
// import undoable, { includeAction } from 'redux-undo';
import authReducer from './authReducer';
import projectReducer from './projectReducer';
import pvTableReducer from './pvTableReducer'
import inverterTableReducer from './inverterTableReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  pv: pvTableReducer,
  inverter: inverterTableReducer
  // undoable: undoable(combineReducers({
  // }), {
  //   initTypes: ['@@redux/INIT'],
  //   filter: includeAction([
  //
  //   ]),
  // })
});

export default rootReducer;
