import { StyleSheet } from 'react-native';
import { sizes, bs } from '@theme';

const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';

export default StyleSheet.create({

  container: {
    ...bs.center,
  },

  modal: {
    ...bs.match_parent,
    ...bs.bg_transparent,
    ...bs.end_center,
  },

  optionContainer: {
    borderRadius: sizes.pad1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  optionList: {
    ...bs.self_stretch,
  },

  cancelStyle: {
    ...bs.p_3x,
    ...bs.mt_2x,
    borderRadius: sizes.pad1,
    backgroundColor: '#fff',
  },
  cancelTextStyle: {
    ...bs.text_center,
    ...bs.text_medium,
    fontSize: sizes.em(17),
    color: HIGHLIGHT_COLOR,
  },

  optionStyle: {
    ...bs.self_stretch,
    ...bs.ph_4x,
    ...bs.pv_2x,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionTextStyle: {
    ...bs.text_center,
    fontSize: sizes.em(16),
    color: HIGHLIGHT_COLOR,
  },

  titleStyle: {
    ...bs.p_2x,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleTextStyle: {
    ...bs.text_center,
    ...bs.text_medium,
    fontSize: sizes.em(20),
    color: '#000',
  },
});
