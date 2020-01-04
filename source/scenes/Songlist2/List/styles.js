import { StyleSheet } from 'react-native';
import { bs, sizes } from '@theme';

const songRowHeight = sizes.em(80);
const songThumbHeight = sizes.em(70);
const playSize = sizes.em(32);

export default StyleSheet.create({
  container: {
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
