import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
// import { shallowEqual } from '@redux';
import { getBorderProps, buildBorderStyle } from './utils';
import { getTheme } from './theme';

export default class Button extends React.Component {
  state = {
    lastPress: 0,
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  // }

  _onPress = () => {
    const curTime = new Date().getTime();
    const delta = curTime - this.state.lastPress;
    if (delta < 300 && this.props.onDoublePress) {
      this.state.lastPress = 0;
      this.props.onDoublePress();
    } else if (this.props.fast || delta > 500) {
      this.state.lastPress = curTime;
      this.props.onPress && this.props.onPress();
    }
  }

  render() {
    const {
      theme, onPress, type, style, ...otherProps
    } = this.props;
    const { borderProps, borderOtherProps } = getBorderProps(otherProps);
    const styles = getTheme(theme);
    const borderStyle = style ? [style, { zIndex: 2 }] : buildBorderStyle(borderProps, styles.style('button'));

    if (type === 'highlight') {
      return (
        <TouchableHighlight
          onPress={this._onPress}
          style={borderStyle}
          {...borderOtherProps}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={borderStyle}
        {...borderOtherProps}
      />
    );
  }
}

Button.propTypes = {
  onDoublePress: PropTypes.func,
};
Button.defaultProps = {
  theme: 'std',
  activeOpacity: 0.7,
  onDoublePress: null,
};
