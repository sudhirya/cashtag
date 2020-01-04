import { ViewType, SearchType } from '@common/types';
import types from './types';

const initialState = {
  sizeFlag: 0,
  userFlag: 0,
  listFlag: 0,
  playerFlag: 0,
  buttonFlag: 0,
  playlistFlag: 0,

  view: {
    type: ViewType.profile,
  },
  search: {
    type: SearchType.none,
    keyword: '',
  },
};

function updateFlagState(state, flag) {
  var newState = { ...state };
  newState[flag] = (newState[flag] + 1) % 1000;
  return newState;
}

export default function(state = initialState, action) {
  const flags = [
    [types.FLAG_SIZE, 'sizeFlag'],
    [types.FLAG_USER, 'userFlag'],
    [types.FLAG_LIST, 'listFlag'],
    [types.FLAG_PLAYER, 'playerFlag'],
    [types.FLAG_BUTTON, 'buttonFlag'],
    [types.FLAG_PLAYLIST, 'playlistFlag'],
  ];

  for (let i = 0; i < flags.length; i += 1) {
    if (action.type === flags[i][0]) {
      return updateFlagState(state, flags[i][1]);
    }
  }

  const { view, search } = state;
  switch (action.type) {
    case types.VIEW_CHANGE:
    case types.VIEW_SEARCH:
      return {
        ...state,
        view: {
          ...view,
          ...action.payload,
        },
      };

    case types.VIEW_SONGS:
      return {
        ...state,
        view: {
          ...view,
          ...action.payload,
        }
      };

    case types.VIEW_FSOURCES:
      return {
        ...state,
        view: {
          ...view,
          ...action.payload,
        }
      };

    case types.VIEW_SOURCES:
      return {
        ...state,
        view: {
          ...view,
          ...action.payload,
        }
      };

    case types.VIEW_CHANNELLIST:
      return {
        ...state,
        view: {
          ...view,
          ...action.payload,
        }
      };

    case types.VIEW_SWIPERSLIDENUMBER:
      return {
        ...state,
        view: {
          ...view,
          ...action.payload,
        }
      };

    case types.SEARCH_CHANGE:
      {
        // const keyword = action.payload.type === SearchType.none ? '' : search.keyword;
        return {
          ...state,
          search: {
            ...search,
            ...action.payload,
            // keyword,
          },
        };
      }
    case types.SEARCH_KEYWORD:
      return {
        ...state,
        search: {
          ...search,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}