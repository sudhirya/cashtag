import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.p_status,
    ...bs.p_safeb,
    ...bs.center,
    ...bs.bg_black,
  },
});
