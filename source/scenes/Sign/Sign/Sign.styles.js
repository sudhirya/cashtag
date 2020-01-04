import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.bg_black,
  },

  pagination: {
    bottom: sizes.safeb + sizes.em(15),
  },
});
