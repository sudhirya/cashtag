import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

export default StyleSheet.create({
  container: {
    ...bs.match_parent,
    ...bs.start_center,
    ...bs.p_status,
    backgroundColor: colors.background,
  },

  discover_header: {
    ...bs.pt_9x,
    fontSize: 20
  },

  btn_tag: {
    ...bs.ph_2x,
    ...bs.pv_1x,
    backgroundColor: '#10d298',
    borderRadius: sizes.em(5),
    height: 150,
    ...bs.ml_2x
  },

  btn_all_channels: {
    ...bs.pl_2x,
    ...bs.mb_2x
  },

  btn_tag_selected: {
    ...bs.ph_2x,
    ...bs.pv_1x,
    //borderRadius: sizes.em(5),
    backgroundColor: 'yellow',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    height: 150,
    ...bs.ml_2x
  },

  tags_view: {
    ...bs.self_stretch,
  },

  tags_scrollview: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },

  tags_scrollview_item: {
    width: '50%', // is 50% of container width
    ...bs.mb_2x
  }
});
