import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.background,
  },

  btn_tag: {
    ...bs.ph_2x,
    ...bs.pv_1x,
    borderRadius: sizes.em(3),
    borderColor: '#ffffff',
    borderWidth: 1,
    ...bs.ml_2x
  },

  btn_tag_selected: {
    ...bs.ph_2x,
    ...bs.pv_1x,
    borderRadius: sizes.em(3),
    backgroundColor: "#FFFFFF",
    borderColor: '#000000',
    borderWidth: 2,
    ...bs.ml_2x
  },

  tags_view: {
    ...bs.self_stretch,
  },

  tags_scrollview: {
    ...bs.flex_row
  }
});
