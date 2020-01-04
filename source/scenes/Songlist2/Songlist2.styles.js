import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.background,
  },

  view_title: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.start_center,
    ...bs.mh_1x,
    height: sizes.em(44),
  },

  btn_close: {
    ...bs.center,
    ...bs.self_stretch,
    ...bs.ph_3x,
  },
  button: {
    ...bs.center,
    ...bs.self_stretch,
    ...bs.ph_3x,
  },

  btn_delete: {
    ...bs.center_start,
    ...bs.flex,
    ...bs.pv_2x,
    backgroundColor: 'red',
  },

  img_live: {
    width: sizes.em(28),
    height: sizes.em(28),
    resizeMode: 'contain',
  },
});
