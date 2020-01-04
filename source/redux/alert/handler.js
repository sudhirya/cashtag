import { dispatch, createActions } from '../utils';
import actions from './actions';

const handler = {
  drop: {
    ...createActions(actions.drop, dispatch),
  },

  hud: {
    ...createActions(actions.hud, dispatch),
  },

  drawer: {
    ...createActions(actions.drawer, dispatch),
  },

  mainThumb: {
    ...createActions(actions.mainThumb, dispatch),
  },
};

export default handler;
