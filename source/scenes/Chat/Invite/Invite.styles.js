import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.center,
    ...bs.p_status,
    ...bs.bg_black,
  },

  btn_close: {
    ...bs.absolute,
    ...bs.p_1x,
    right: sizes.pad1 * 2,
    top: sizes.statusbar + sizes.pad1,
  },

  content: {
    ...bs.match_parent,
    ...bs.center,
  },

  avatar: {
    borderWidth: 0.5,
    borderColor: '#CDCDCD',
  },
});
