import { combineReducers } from 'redux';
import authReducer from './authReducer';
import localReducer from './locale'
import unitReducer from './unitReducer'
import projectReducer from './projectReducer';
import pvTableReducer from './pvTableReducer'
import inverterTableReducer from './inverterTableReducer'
import reportReducer from './reportReducer'
import SLDReducer from './SLDReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  locale: localReducer,
  unit: unitReducer,
  project: projectReducer,
  pv: pvTableReducer,
  inverter: inverterTableReducer,
  report: reportReducer,
  SLD: SLDReducer
});

export default rootReducer;
