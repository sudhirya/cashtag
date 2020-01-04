// import { combineReducers } from 'redux';
import navigation from './navigation/reducer';
import alert from './alert/reducer';
import meteor from './meteor/reducer';
import main from './main/reducer';

export default {
  ...navigation,
  alert,
  meteor,
  main,
};
