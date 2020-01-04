import ActionTypes from './types';

const initialState = {
  drop: {
    title: '',
    message: '',
    type: '',
    visible: false,
  },
  hud: {
    message: '',
    visible: false,
  },
  drawer: {
    visible: false,
  },
  mainThumb: {
    visible: false,
  },
};

export default function (state = initialState, action) {
  const { drop, hud, drawer, mainThumb } = state;

  switch (action.type) {
    case ActionTypes.ALERT:
      return {
        ...state,
        drop: {
          ...drop,
          ...action.payload,
        },
      };
    case ActionTypes.HUD:
      return {
        ...state,
        hud: {
          ...hud,
          ...action.payload,
        },
      };
    case ActionTypes.DRAWER:
      return {
        ...state,
        drawer: {
          ...drawer,
          ...action.payload,
        },
      };
    case ActionTypes.MAINTHUMB:
      return {
        ...state,
        mainThumb: {
          ...mainThumb,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}
