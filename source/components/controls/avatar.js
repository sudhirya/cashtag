import React from 'react';
import { View, Image } from 'react-native';
import { bs, sizes } from '@theme';
import { extendStyle } from './utils';
import { getTheme } from './theme';

export default ({
  theme, size, sizeem, avatar, placeholder, background, tint,
  border, borderWidth,
  style, children, ...otherProps
}) => {
  const styles = getTheme(theme);
  const newstyle = [styles.style('avatar')];
  const newSize = sizeem || sizes.em(size);

  if (background) newstyle.push({ backgroundColor: background });
  newstyle.push({ overflow: 'hidden' });
  newstyle.push({ width: newSize });
  newstyle.push({ height: newSize });
  newstyle.push({ borderRadius: newSize / 2 });
  if (border) newstyle.push({ borderColor: border, borderWidth });
  extendStyle(newstyle, style);

  const imageStyle = [bs.absolute_full, { width: newSize, height: newSize, resizeMode: 'cover' }];
  const placeholderStyle = [bs.absolute_full, { width: newSize, height: newSize, resizeMode: 'cover' }];
  if (tint) placeholderStyle.push({ tintColor: tint });
  let newPlaceholder = placeholder, newSource = avatar;

  if (typeof placeholder === 'string') {
    newPlaceholder = placeholder.trim().length ? { uri: placeholder } : null;
  }
  if (typeof avatar === 'string') {
    newSource = avatar.trim().length ? { uri: avatar } : null;
  }

  return (
    <View style={newstyle} {...otherProps} >
      { placeholder && (<Image style={placeholderStyle} source={newPlaceholder} />) }
      <Image style={imageStyle} source={newSource} />
      { children }
    </View>
  );
};
