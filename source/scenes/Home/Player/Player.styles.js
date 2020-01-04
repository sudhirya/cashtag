import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.self_stretch,
    ...bs.start_center,
    zIndex: 100,
    backgroundColor: colors.background,
  },

  view_info: {
    ...bs.absolute,
    ...bs.start_center,
    right: 0,
    top: 0,
    backgroundColor: colors.background,
  },

  view_title1: {
    ...bs.match_parent,
    ...bs.center,
    zIndex: 100,
  },
  view_title2: {
    ...bs.flex_row,
    ...bs.start_start,
    ...bs.self_stretch,
  },

  view_ctrl_full: {
    ...bs.absolute_full,
    bottom: undefined,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  view_ctrl_sm: {
    ...bs.flex_row,
    ...bs.center,
    // ...bs.pr_3x,
    overflow: 'hidden',
  },
  view_ctrl_lg: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.between_center,
    overflow: 'hidden',
  },

  full_player: {
    ...bs.match_parent,
  },
  video_player: {
    ...bs.absolute_full,
  },
  audio_player: {
    ...bs.absolute_full,
    opacity: 0,
  },
  view_player: {
    ...bs.absolute,
    left: 0,
  },

  img_thumb: {
    ...bs.absolute,
    left: 0,
    top: 0,
    resizeMode: 'contain',
  },
});
