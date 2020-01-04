import { bindActionCreators } from 'redux';
import { dispatch } from '../utils';
import actions from './actions';

const handlers = bindActionCreators(actions, dispatch);

handlers.resetTo = (routeName, key, ...args) => {
  dispatch(actions.reset([{ key, routeName }], 0, ...args));
};

export default handlers;
