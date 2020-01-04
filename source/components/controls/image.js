import React from 'react';
import { Image, Animated, StyleSheet, View } from 'react-native';
import { CustomCachedImage } from 'react-native-img-cache';
import { shallowEqual } from '@redux';
import { extendStyle } from './utils';
// import styles from './image.styles.js';

export default class ImageEx extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.width || 0,
      height: props.height || 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  onLayout = ({ nativeEvent: ev }) => {
    if (ev.layout.width !== this.state.width || ev.layout.height !== this.state.height) {
      this.setState({
        width: ev.layout.width, height: ev.layout.height,
      });
    }
  }

  render() {
    const {
      width, height, stretch, contain, cover, tint, style, animated, source, nocache, ...otherProps
    } = this.props;
    const newStyle = [];
    let isCaching = !nocache;

    if (width) newStyle.push({ width });
    if (height) newStyle.push({ height });
    if (stretch) newStyle.push({ resizeMode: 'stretch' });
    if (contain) newStyle.push({ resizeMode: 'contain' });
    if (cover) newStyle.push({ resizeMode: 'cover' });
    if (tint) newStyle.push({ tintColor: tint });

    extendStyle(newStyle, style);

    const styleflat = StyleSheet.flatten(newStyle);
    const needLayout = !styleflat.height || !styleflat.width;
    const onLayout = needLayout ? this.onLayout : null;
    const Comp = animated ? Animated.Image : Image;

    let newSource = source;
    if (typeof source === 'string') {
      newSource = source.trim().length ? { uri: source } : null;
    }
    if (typeof source === 'number') {
      isCaching = false;
    }

    if (needLayout) {
      const { resizeMode: t1, tintColor: t2, ...viewStyle } = styleflat;
      const imgStyle = {
        resizeMode: styleflat.resizeMode,
        width: styleflat.width,
        height: styleflat.height,
        tintColor: styleflat.tintColor,
      };

      if (!width && this.state.width) {
        viewStyle.width = this.state.width;
        imgStyle.width = this.state.width;
      }
      if (!height && this.state.height) {
        viewStyle.height = this.state.height;
        imgStyle.height = this.state.height;
      }

      return (
        <View style={viewStyle} onLayout={onLayout} {...otherProps} >
          <Comp style={imgStyle} source={newSource} />
        </View>
      );
    }


    if (!isCaching) {
      return (<Comp style={newStyle} onLayout={onLayout} source={newSource} {...otherProps} />);
    }
    return (<CustomCachedImage style={newStyle} onLayout={onLayout} source={newSource} component={Comp} {...otherProps} />);
  }
}
