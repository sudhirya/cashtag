import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.absolute,
    left: 0,
    right: 0,
    bottom: 0,
    top: sizes.header.height1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
