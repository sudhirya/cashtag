import { createTypes } from '../utils';

const flags = createTypes('FLAG', 'main.flags', ['SIZE', 'USER', 'LIST', 'PLAYER', 'BUTTON', 'PLAYLIST']);
const view = createTypes('VIEW', 'main.view', ['CHANGE', 'SEARCH', 'SONGS', 'FSOURCES', 'SOURCES', 'CHANNELLIST', 'SWIPERSLIDENUMBER']);
const search = createTypes('SEARCH', 'main.search', ['CHANGE', 'KEYWORD']);

export default {
  ...flags,
  ...view,
  ...search,
};