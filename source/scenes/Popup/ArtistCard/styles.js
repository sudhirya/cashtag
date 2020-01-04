import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  dialog: {
    ...bs.self_center,
    ...bs.bg_transparent,
    overflow: 'hidden',
  },
  container: {
    ...bs.match_parent,
    ...bs.bg_transparent,
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

  webview: {
    ...bs.absolute_full,
    ...bs.bg_white,
    ...bs.start_center,
    borderTopLeftRadius: sizes.em(20),
    borderTopRightRadius: sizes.em(20),
  },
});
