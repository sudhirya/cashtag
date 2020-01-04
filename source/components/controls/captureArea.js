import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { sizes, bs } from '@theme';

const CaptureArea = ({
  style, borderSize, borderLength, borderColor, width, height, ratio,
}) => {
  var rectWidth, rectHeight;
  if (width) {
    rectWidth = width;
    rectHeight = width * ratio;
  } else {
    rectHeight = height;
    rectWidth = height / ratio;
  }

  return (
    <View style={[style, bs.center, bs.bg_transparent, { width: rectWidth, height: rectHeight }]} >
      <View style={{ position: 'absolute', left: 0, top: 0, width: borderLength, height: borderSize, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', left: 0, top: 0, width: borderSize, height: borderLength, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', right: 0, top: 0, width: borderLength, height: borderSize, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', right: 0, top: 0, width: borderSize, height: borderLength, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', left: 0, bottom: 0, width: borderLength, height: borderSize, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', left: 0, bottom: 0, width: borderSize, height: borderLength, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', right: 0, bottom: 0, width: borderLength, height: borderSize, backgroundColor: borderColor }} />
      <View style={{ position: 'absolute', right: 0, bottom: 0, width: borderSize, height: borderLength, backgroundColor: borderColor }} />
    </View>
  );
};

CaptureArea.propTypes = {
  borderSize: PropTypes.number,
  borderLength: PropTypes.number,
  borderColor: PropTypes.string,
  ratio: PropTypes.number,
};

CaptureArea.defaultProps = {
  borderSize: sizes.em(6),
  borderLength: sizes.em(42),
  borderColor: '#63FE4C',
  ratio: 0.6667,
};

export default CaptureArea;
