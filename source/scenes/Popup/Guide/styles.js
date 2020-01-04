import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  dialog: {
    ...bs.match_parent,
    ...bs.bg_transparent,
    overflow: 'hidden',
  },
  container: {
    ...bs.match_parent,
    ...bs.center,
    ...bs.bg_transparent,
  },

  txt_search_mark: {
    ...bs.font_stink,
    fontWeight: 'normal',
    fontSize: sizes.em(30, null, true),
    paddingRight: sizes.em(10),
    marginTop: sizes.em(5),
  },
});
