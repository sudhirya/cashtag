import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    //...bs.center,
    ...bs.p_safeb,
    ...bs.bg_black,
    ...bs.pt_9x
  },
});
