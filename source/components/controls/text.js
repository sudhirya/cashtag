import React from 'react';
import { Text, Animated } from 'react-native';
import { extendStyle, getTextProps, buildTextStyle } from './utils';
import { getTheme } from './theme';

export default (props) => {
  const {
    theme, style, children, animated, ...otherProps
  } = props;
  const { textProps, textOtherProps } = getTextProps(otherProps);

  const Comp = animated ? Animated.Text : Text;
  const styles = getTheme(theme);
  const newStyle = buildTextStyle(textProps, styles.style('text'));
  extendStyle(newStyle, style);

  return (
    <Comp style={newStyle} {...textOtherProps} >{children}</Comp>
  );
};
