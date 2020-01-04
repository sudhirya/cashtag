import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

const songRowHeight = sizes.em(80);
const songThumbHeight = sizes.em(70);
const playSize = sizes.em(32);

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.background,
  },

  view_title: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.start_center,
    ...bs.mh_1x,
    height: sizes.em(44),
  },

  btn_close: {
    ...bs.center,
    ...bs.self_stretch,
    ...bs.ph_3x,
  },
  button: {
    ...bs.center,
    ...bs.self_stretch,
    ...bs.ph_3x,
  },

  btn_delete: {
    ...bs.center_start,
    ...bs.flex,
    ...bs.pv_2x,
    backgroundColor: 'red',
  },

  img_live: {
    width: sizes.em(28),
    height: sizes.em(28),
    resizeMode: 'contain',
  },

  // play list
  list: {
    ...bs.match_parent,
  },
  list_row: {
    ...bs.flex_row,
    ...bs.start_center,
    height: songRowHeight,
  },

  view_song_thumb: {
    ...bs.center,
    width: songThumbHeight,
    height: songThumbHeight,
  },
  btn_play: {
    ...bs.center,
    width: playSize,
    height: playSize,
    borderRadius: sizes.em(20),
    backgroundColor: 'transparent',
  },
  view_play_circle: {
    ...bs.center,
    width: playSize,
    height: playSize,
    borderRadius: playSize / 2,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  view_song_info: {
    ...bs.match_parent,
    ...bs.center_start,
    ...bs.mh_2x,
  },
});
