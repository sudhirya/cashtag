import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.background,
  },

  btn_tag: {
    ...bs.ph_2x,
    ...bs.pv_1x,
    backgroundColor: '#4c6eeb',
    borderRadius: sizes.em(5),
    ...bs.ml_2x
  },

  btn_tag_selected: {
    ...bs.ph_2x,
    ...bs.pv_1x,
    // borderRadius: sizes.em(5),
    backgroundColor: 'yellow',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    ...bs.ml_2x
  },

  tags_view: {
    ...bs.self_stretch,
  },

  tags_scrollview: {
    ...bs.flex_row
  },

  row: {
    flexDirection: 'row'
  },

  circle_btn: {
    padding: 5,
    height: 40,
    width: 40,  //The Width must be the same as the height
    borderRadius: 80, //Then Make the Border Radius twice the size of width or Height
    backgroundColor:'#000000',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },

  circle_plus_btn: {
    paddingLeft: 5,
    marginTop: -8
  }
});
