import React from 'react';
import { View, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { bs } from '@theme';
import { extendStyle } from './utils';
import { getTheme } from './theme';

const Scroll = (props) => {
  const {
    theme, center, end, style, contentStyle,
    useKeyboardAware, children, ...otherProps
  } = props;

  const styles = getTheme(theme);

  const newStyle = [styles.style('scroll')];
  extendStyle(newStyle, style);

  const newContentStyle = [styles.style('scroll.content')];
  if (center) newContentStyle.push(bs.center);
  if (end) newContentStyle.push(bs.end_center);
  extendStyle(newContentStyle, contentStyle);

  const Comp = useKeyboardAware ? KeyboardAwareScrollView : ScrollView;

  return (
    <Comp
      style={newStyle}
      contentContainerStyle={styles.style('scroll.container')}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      enableResetScrollToCoords={false}
      enableAutomaticScroll
      {...otherProps}
    >
      <View style={newContentStyle} >
        {children}
      </View>
    </Comp>
  );
};

Scroll.defaultProps = {
};

export default Scroll;
