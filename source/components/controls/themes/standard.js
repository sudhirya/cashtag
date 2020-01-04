import { bs } from '@theme';

export default {
  // border styles
  border: {
    ...bs.center,
  },
  button: {
    ...bs.center,
    zIndex: 2,
  },
  'border.underline': {
    borderBottomWidth: 0.5,
    borderColor: '#fff',
  },

  'border.border': {
    borderColor: '#fff',
    borderWidth: 0.5,
  },

  'border.background': {
    backgroundColor: '#fff',
  },

  // edit styles
  edit: {
    ...bs.font_normal,
    ...bs.text_normal,
    ...bs.match_parent,
    ...bs.p_none,
    color: '#fff',
  },
  'edit.border': {
    ...bs.center,
  },
  'edit.placeholder': '#A6A599',

  // indicator
  indicator: {
    flex: 0,
  },

  // avatar
  avatar: {},

  // icon
  icon: {},
  'icon.color': '#fff',
  'icon.size': 20,

  // text
  text: {
    ...bs.font_normal,
    ...bs.text_normal,
    color: '#fff',
  },

  // scroll styles
  scroll: {
    ...bs.match_parent,
  },
  'scroll.container': {
    flexGrow: 1,
  },
  'scroll.content': {
    ...bs.match_parent,
    ...bs.start_center,
  },
};
