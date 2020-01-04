import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.background,
  },

  content: {
    ...bs.match_parent,
  },

  no_list: {
    ...bs.absolute_bottom,
    ...bs.start_center,
    top: sizes.em(30),
  },

  chat_button: {
    ...bs.absolute,
    ...bs.center,
    ...bs.p_1x,
    left: sizes.pad1 * 2,
    bottom: sizes.pad1 * 2 + sizes.safeb1,
  },

  wallet_button: {
    ...bs.absolute,
    ...bs.center,
    ...bs.p_1x,
    right: sizes.pad1 * 2,
    bottom: sizes.pad1 * 2 + sizes.safeb1,
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

  tabbar: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.around_center,
  },
  btn_tab: {
    ...bs.between_center,
    ...bs.mh_1x,
    // height: sizes.em(32),
    // width: sizes.em(32),
  },
  line_tab_active: {
    // ...bs.self_stretch,
    width: sizes.em(40),
    height: sizes.em(3),
    backgroundColor: '#0000ff',
  },

  tag_list_view: {
    ...bs.self_stretch,
    ...bs.center,
    height: sizes.em(200),
  },
  tag_list: {
    ...bs.flex_row,
    ...bs.center,
    ...bs.pt_5x
  },
  tag_list_circle: {
    ...bs.ml_xs,
    ...bs.center,
    backgroundColor: '#FFF',
    height: sizes.em(40),
    width: sizes.em(40),
    borderRadius: sizes.em(40) * 2
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
});
