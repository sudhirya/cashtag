import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.bg_white,
  },

  navbar: {
    ...bs.self_stretch,
    ...bs.center,
    ...bs.p_status,
    height: sizes.em(44) + sizes.statusbar,
    borderBottomWidth: 1,
    borderColor: 'rgba(151,151,151,0.17)',
  },

  btn_back: {
    ...bs.absolute,
    ...bs.center,
    top: sizes.statusbar,
    left: sizes.pad1,
    height: sizes.em(44),
    width: sizes.em(44),
  },

  content: {
    ...bs.match_parent,
    ...bs.p_safeb1,
    ...bs.bg_white,
  },
  chat: {
    ...bs.match_parent,
    backgroundColor: '#EfEfEf',
  },
});
