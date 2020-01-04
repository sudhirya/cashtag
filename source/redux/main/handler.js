import { dispatch, createActions } from '../utils';
import actions from './actions';

const flagActions = createActions(actions.update, dispatch);
const viewActions = createActions(actions.view, dispatch);
const searchActions = createActions(actions.search, dispatch);

const handler = {
  update: {
    ...flagActions,
  },

  view: {
    ...viewActions,
  },

  search: {
    ...searchActions,
  },
};

export default handler;
