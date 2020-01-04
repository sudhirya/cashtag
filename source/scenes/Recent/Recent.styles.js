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
    ...bs.between_center,
    ...bs.self_stretch,
    ...bs.ph_1x,
    height: sizes.em(50),
  },

  btn_live: {
    ...bs.flex_row,
    ...bs.center,
    ...bs.self_stretch,
    ...bs.ph_2x,
  },
  btn_close: {
    ...bs.center,
    ...bs.self_stretch,
    ...bs.ph_2x,
  },

  view_title_new: {
    ...bs.flex_row,
    ...bs.between_center,
    ...bs.self_stretch,
    ...bs.ph_1x,
    height: sizes.em(40),
  },

  wallet_button: {
    ...bs.absolute,
    ...bs.center,
    ...bs.p_1x,
    right: sizes.pad1 * 2,
    bottom: sizes.pad1 * 2 + sizes.safeb1,
  },
});
