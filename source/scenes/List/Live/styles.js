import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  list: {
    ...bs.match_parent,
    ...bs.mt_1x,
  },

  item: {
    ...bs.self_stretch,
    ...bs.flex_row,
    ...bs.start_center,
    ...bs.p_1x,
  },
  btn_play: {
    ...bs.center,
    ...bs.p_3x,
  },
  view_title: {
    ...bs.match_parent,
    ...bs.center_start,
  },
});
