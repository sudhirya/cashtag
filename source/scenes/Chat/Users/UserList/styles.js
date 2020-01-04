import { StyleSheet } from 'react-native';
import { bs } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
  },

  row: {
    ...bs.self_stretch,
    ...bs.flex_row,
    ...bs.ph_2x,
    ...bs.pv_3x,
    ...bs.center,
    borderColor: '#2C2C2C',
    borderBottomWidth: 0.5,
  },

  section: {
    ...bs.self_stretch,
    ...bs.center,
    // ...bs.mv_2x,
    // backgroundColor: '#272727',
    backgroundColor: '#FFFFFF',
  },

  picker: {
    ...bs.self_stretch,
    backgroundColor: '#fff'
  },

  dropdown_section: {
    ...bs.self_stretch,
    ...bs.pl_2x,
    ...bs.pr_2x,
    marginTop: -20
  }
});
