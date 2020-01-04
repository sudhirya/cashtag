import { StyleSheet } from 'react-native';
import { bs, colors, sizes } from '@theme';

const captureOuterSize = sizes.em(80);
const captureInnerSize = sizes.em(64);

export default StyleSheet.create({
  container: {
    ...bs.absolute_full,
    ...bs.end_center,
    backgroundColor: colors.background,
  },

  broadcast: {
    ...bs.absolute_full,
  },

  btn_golive: {
    ...bs.absolute,
    ...bs.center,
    ...bs.pv_2x,
    left: 0,
    right: 0,
    top: sizes.header.height1,
    // backgroundColor: colors.alternative,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  view_bottom: {
    ...bs.flex_row,
    ...bs.self_stretch,
    ...bs.between_center,
    ...bs.ph_1x,
    ...bs.bg_transparent,
    paddingBottom: 1
  },

  artist_bottom: {
    paddingBottom: sizes.safeb
  },

  btn_bottom: {
    ...bs.center,
    ...bs.m_3x,
  },
  btn_capture: {
    ...bs.center,
    ...bs.mb_4x,
    width: captureOuterSize,
    height: captureOuterSize,
    borderRadius: captureOuterSize / 2,
    backgroundColor: colors.alternative,
  },
  btn_capture_inner: {
    width: captureInnerSize,
    height: captureInnerSize,
    borderRadius: captureInnerSize / 2,
    backgroundColor: colors.background,
  },
  btn_capture_inner_rec: {
    width: captureInnerSize,
    height: captureInnerSize,
    borderRadius: captureInnerSize / 2,
    backgroundColor: '#f00',
  },
});
