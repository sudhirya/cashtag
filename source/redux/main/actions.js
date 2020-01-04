import types from './types';

function updateFlag(type) {
  return () => ({
    type,
    payload: {},
  });
}

const actions = {
  update: {
    size: updateFlag(types.FLAG_SIZE),
    user: updateFlag(types.FLAG_USER),
    list: updateFlag(types.FLAG_LIST),
    player: updateFlag(types.FLAG_PLAYER),
    button: updateFlag(types.FLAG_BUTTON),
    playlist: updateFlag(types.FLAG_PLAYLIST),
  },

  view: {
    change: type => ({
      type: types.VIEW_CHANGE,
      payload: { type },
    }),
    search: search => ({
      type: types.VIEW_SEARCH,
      payload: { search },
    }),
    songs: songs => ({
      type: types.VIEW_SONGS,
      payload: { songs },
    }),
    fsources: fsources => ({
      type: types.VIEW_FSOURCES,
      payload: { fsources },
    }),
    sources: sources => ({
      type: types.VIEW_SOURCES,
      payload: { sources },
    }),
    channellist: channellist => ({
      type: types.VIEW_CHANNELLIST,
      payload: { channellist },
    }),
    swiperslidenumber: swiperslidenumber => {
      return ({
        type: types.VIEW_SWIPERSLIDENUMBER,
        payload: { swiperslidenumber },
      })
    }
  },

  search: {
    change: type => ({
      type: types.SEARCH_CHANGE,
      payload: { type },
    }),
    keyword: keyword => ({
      type: types.SEARCH_KEYWORD,
      payload: { keyword },
    }),
  },
};

export default actions;