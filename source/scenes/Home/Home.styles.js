import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    backgroundColor: colors.background,
  },

  view_player: {
    ...bs.absolute_full,
    ...bs.start_center,
    zIndex: 100,
    backgroundColor: colors.background,
  },

  grid_song: {
    ...bs.self_stretch,
    overflow: 'hidden',
  },
});
