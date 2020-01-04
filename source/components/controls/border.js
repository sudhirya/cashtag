import React from 'react';
import { View, Animated } from 'react-native';
import { getBorderProps, buildBorderStyle } from './utils';
import { getTheme } from './theme';

const Border = (props) => {
  const { theme, animated, ...otherProps } = props;
  const { borderProps, borderOtherProps } = getBorderProps(otherProps);
  const Comp = animated ? Animated.View : View;
  const styles = getTheme(theme);
  const borderStyle = buildBorderStyle(borderProps, styles.style('border'));

  return (
    <Comp style={borderStyle} {...borderOtherProps} />
  );
};

Border.defaultProps = {
  theme: 'std',
};

export default Border;
