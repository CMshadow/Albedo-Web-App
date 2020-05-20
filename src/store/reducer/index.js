import { combineReducers } from 'redux';
// import undoable, { includeAction } from 'redux-undo';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // undoable: undoable(combineReducers({
  // }), {
  //   initTypes: ['@@redux/INIT'],
  //   filter: includeAction([
  //
  //   ]),
  // })
});

export default rootReducer;
