import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  dialog: {
    ...bs.match_parent,
    ...bs.self_center,
    ...bs.bg_transparent,
    ...bs.m_none,
  },
  container: {
    ...bs.match_parent,
    ...bs.m_safeb,
    ...bs.bg_transparent,
    ...bs.center,
  },

  view_buttons: {
    ...bs.flex_row,
    ...bs.center,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: sizes.em(60),
  },

  button: {
    ...bs.center,
    ...bs.mh_2x,
    width: sizes.em(40),
    height: sizes.em(40),
  },
});
