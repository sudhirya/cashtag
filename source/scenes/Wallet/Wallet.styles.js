import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

const SIZE = 250;
export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.black,
  },

  headerbar: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.center,
  },

  sidebar: {
    flex:1,
    ...bs.flex_row,
    ...bs.start_center
  },

  btn_cash: {
    ...bs.mt_2x,
    padding: sizes.em(8)
  },

  btn_logout: {
    ...bs.mt_2x,
    paddingLeft: sizes.em(100),
    ...bs.right
  },

  btn_close: {
    ...bs.center,
    ...bs.mt_2x,
    padding: sizes.em(8),
  },

  content: {
    ...bs.match_parent,
    ...bs.mt_3x,
  },

  open_card: {
    ...bs.between_center,
    height: sizes.em(SIZE),
    borderRadius: sizes.em(10),
  },
  open_card_head: {
    ...bs.self_stretch,
    ...bs.flex_row,
    ...bs.between_start,
    ...bs.p_7x,
    ...bs.pr_2x,
    backgroundColor: 'transparent',
  },
  open_card_foot: {
    ...bs.self_stretch,
    ...bs.flex_row,
    ...bs.between_start,
    ...bs.p_3x,
    backgroundColor: 'transparent',
  },


  add_wallet: {
    ...bs.mt_4x,
    // ...bs.pb_8x,
    height: sizes.em(20),
  },
  add_wallet_left: {
    ...bs.center_start,
    ...bs.p_2x,
  },
  add_wallet_right: {
    ...bs.end_end,
    ...bs.p_2x,
  },


  close_card_main: {
    ...bs.between_center,
    ...bs.mt_8x,
    height: sizes.em(SIZE),
  },
  close_card: {
    ...bs.center,
    width: '100%',
    height: sizes.em(SIZE),
    borderTopLeftRadius: sizes.em(10),
    borderTopRightRadius: sizes.em(10),
  },
  close_card2: {
    ...bs.center,
    marginTop: -sizes.em(SIZE - 50),
    width: '100%',
    height: sizes.em(SIZE),
    borderTopLeftRadius: sizes.em(10),
    borderTopRightRadius: sizes.em(10),
  },
  close_card_head: {
    ...bs.between_center,
    ...bs.flex_row,
    ...bs.pl_3x,
    ...bs.pr_3x,
    marginTop: -sizes.em(SIZE - 50),
    width: '100%',
    backgroundColor: 'transparent'
  },

  tabbar: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.around_center,
  },

  line_tab_active: {
    // ...bs.self_stretch,
    width: sizes.em(40),
    height: sizes.em(3),
    backgroundColor: '#0000ff',
  },

  btn_tab: {
    ...bs.between_center,
    ...bs.mh_1x,
    // height: sizes.em(32),
    // width: sizes.em(32),
  },
});
