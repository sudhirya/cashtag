import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.absolute_full,
    ...bs.item_stretch,
    ...bs.p_status,
    bottom: null,
    backgroundColor: colors.background,
  },

  overlay1: {
    ...bs.absolute_full,
    backgroundColor: 'white',
  },

  content: {
    ...bs.match_parent,
    ...bs.flex_row,
    ...bs.between_center,
    ...bs.ph_1x,
  },
  button: {
    ...bs.center,
    ...bs.pv_2x,
    ...bs.bg_transparent,
    width: sizes.em(40),
  },

  txt_chill: {
    ...bs.ph_2x,
    ...bs.font_stink,
    fontWeight: 'normal',
    paddingTop: -sizes.em(6),
  },

  view_mid: {
    ...bs.match_parent,
    ...bs.center,
    ...bs.bg_transparent,
  },
});
