import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  border: {
    borderColor: 'rgba(80,80,80,0.8)',
    opacity: 0.7,
  },

  row: {
    ...bs.flex,
    ...bs.end_start,
    overflow: 'hidden',
  },

  btn_row: {
    ...bs.absolute_full,
    ...bs.center,
    ...bs.p_3x,
  },
  overlay: {
    ...bs.absolute_full,
    // backgroundColor: 'rgba(80,80,80,0.8)',
  },
  img_thumb: {
    ...bs.absolute,
    top: -sizes.pad1 * 7,
  },

  view_title: {
    ...bs.center_start,
    top: -sizes.pad1 * 6,
  },
  view_title2: {
    ...bs.absolute_bottom,
    ...bs.center_start,
    ...bs.p_3x,
    height: sizes.em(70),
    backgroundColor: '#000',
  },
  txt_artist: {
    ...bs.mh_1x,
    flexWrap: 'wrap',
  },
});
