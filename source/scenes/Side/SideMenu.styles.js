import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: '#212121',
  },
});
