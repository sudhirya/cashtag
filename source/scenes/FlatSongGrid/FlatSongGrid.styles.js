import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    overflow: 'hidden',
  },
  no_list: {
    ...bs.self_stretch,
    ...bs.center,
    // height: sizes.em(100),
  },

  overlay_top: {
    ...bs.absolute,
    left: -1,
    top: 0, // -sizes.em(40),
    // opacity: 0.8,
  },
  overlay_bottom: {
    ...bs.absolute,
    left: -1,
    bottom: 0, // -sizes.em(40),
    // opacity: 0.8,
  },

  view_ic_top: {
    ...bs.absolute,
    ...bs.center,
    left: 0,
    right: 0,
    top: 0,
  },
});
