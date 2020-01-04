import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    ...bs.bg_black,
  },

  searchbar: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.center,
  },
  txt_search_mark: {
    ...bs.ml_xs,
    ...bs.font_stink,
    fontWeight: 'normal',
    fontSize: sizes.em(36, null, true),
    color: colors.text,
    paddingRight: sizes.em(10),
    marginTop: sizes.em(5),
  },
  btn_close: {
    ...bs.center,
    ...bs.mt_2x,
    ...bs.mr_1x,
    padding: sizes.em(8),
  },

  chat_button: {
    ...bs.absolute,
    ...bs.center,
    left: 0,
    bottom: sizes.pad1 + sizes.safeb1,
    width: sizes.em(50),
    height: sizes.em(50),
  },

  no_result: {
    ...bs.self_stretch,
    ...bs.center,
    height: sizes.em(200),
  },

  txt_no_contact: {
    ...bs.ph_2x,
    ...bs.font_stink,
    fontWeight: 'normal',
  },
});
