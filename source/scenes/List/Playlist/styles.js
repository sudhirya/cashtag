import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  list: {
    ...bs.match_parent,
  },
  no_list: {
    ...bs.self_stretch,
    ...bs.center,
    ...bs.mt_6x,
    // height: sizes.em(100),
  },

  row: {
    ...bs.match_parent,
    ...bs.flex_row,
    ...bs.start_center,
    ...bs.p_1x,
  },

  btn_row_play: {
    ...bs.center,
    ...bs.p_3x,
  },
  row_info: {
    ...bs.match_parent,
    ...bs.center_start,
  },
  view_row_btns: {
    ...bs.flex_row,
    ...bs.start_center,
    ...bs.mt_1x,
  },
  btn_row_func: {
    ...bs.center,
    ...bs.pv_1x,
  },
});
