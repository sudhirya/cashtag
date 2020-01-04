import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  border: {
    borderColor: 'rgba(80,80,80,0.8)',
    opacity: 0.7,
  },

  row: {
    ...bs.flex,
    overflow: 'hidden',
  },

  btn_row: {
    ...bs.absolute_full,
    ...bs.center,
  },
  overlay: {
    ...bs.absolute_full,
    backgroundColor: 'black',
  },
  img_thumb: {
    ...bs.absolute,
    left: -1,
    top: -sizes.pad1 * 4,
  },

  view_title: {
    ...bs.center,
    marginTop: -sizes.em(18),
  },

  txt_artist: {
    ...bs.mh_1x,
    marginBottom: sizes.em(2),
    flexWrap: 'wrap',
  },
});
