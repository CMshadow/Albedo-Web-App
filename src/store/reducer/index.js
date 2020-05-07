import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import authReducer from '../../pages/user/reducer';

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
