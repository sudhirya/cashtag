import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.flex_row,
    ...bs.center,
	},

	codeInput: {
    ...bs.text_center,
    ...bs.p_none,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: sizes.em(40, null, false),
	},
});
