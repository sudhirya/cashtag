import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.absolute,
    ...bs.start_center,
    left: 0,
    right: 0,
    top: sizes.header.height1,
    backgroundColor: colors.background,
  },
  content: {
    ...bs.match_parent,
    ...bs.bg_white,
  },

  bar_title: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.between_start,
    height: sizes.profile.titleHeight,
    backgroundColor: 'white',
  },
  btn_change_song: {
    ...bs.center,
    ...bs.p_2x,
  },
  view_title: {
    ...bs.start_center,
    ...bs.flex,
  },

  view_thumb: {
    ...bs.match_parent,
    ...bs.center,
    backgroundColor: 'white',
  },
  view_play: {
    ...bs.absolute_full,
    ...bs.center,
  },

  view_progress: {
    ...bs.end_center,
    ...bs.self_stretch,
    height: sizes.profile.sliderHeight,
    backgroundColor: 'white',
    paddingBottom: sizes.safeb,
  },
  button: {
    ...bs.center,
    ...bs.pv_1x,
    width: sizes.em(40),
  },

  view_menu: {
    ...bs.absolute,
    ...bs.center,
    bottom: sizes.pad1 + sizes.safeb,
    left: 0,
    right: 0,
  },
});
