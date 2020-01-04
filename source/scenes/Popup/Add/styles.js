import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  dialog: {
    ...bs.bg_black,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    transform: [{ translateY: -sizes.em(50) }],
  },

  content: {
    ...bs.self_stretch,
    ...bs.p_3x,
  },

  // input
  view_name: {
    ...bs.flex_row,
    ...bs.start_center,
    ...bs.self_stretch,
    ...bs.pl_2x,
    ...bs.bg_white,
    height: sizes.em(36),
    borderRadius: 3,
  },
  btn_add: {
    ...bs.self_stretch,
    ...bs.center,
    ...bs.ph_1x,
  },

  list: {
    ...bs.self_stretch,
    ...bs.mt_3x,
    height: sizes.em(36) * 3,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  row: {
    ...bs.flex_row,
    ...bs.start_center,
    ...bs.self_stretch,
    ...bs.ph_2x,
    height: sizes.em(36),
  },
  row_on: {
    backgroundColor: '#CDCDCD',
  },
});
