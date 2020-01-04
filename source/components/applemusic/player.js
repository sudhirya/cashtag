import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, requireNativeComponent, View } from 'react-native';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export default class AppleMusicPlayer extends React.Component {
  state = {};

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  seek = (time) => {
    this.setNativeProps({ seek: time });
  };

  _assignRoot = (component) => {
    this._root = component;
  };

  _onLoad = (event) => {
    if (this.props.onLoad) {
      this.props.onLoad(event.nativeEvent);
    }
  };

  _onProgress = (event) => {
    if (this.props.onProgress) {
      this.props.onProgress(event.nativeEvent);
    }
  };

  _onEnd = (event) => {
    if (this.props.onEnd) {
      this.props.onEnd(event.nativeEvent);
    }
  };

  render() {
    const nativeProps = Object.assign({}, this.props);
    Object.assign(nativeProps, {
      style: [styles.base, nativeProps.style],
      storeId: this.props.storeId,
      onAudioLoad: this._onLoad,
      onAudioProgress: this._onProgress,
      onAudioEnd: this._onEnd,
    });

    return (
      <RNAppleMusicPlayer
        ref={this._assignRoot}
        {...nativeProps}
      />
    );
  }
}

AppleMusicPlayer.propTypes = {
  /* Native only */
  storeId: PropTypes.string.isRequired,
  seek: PropTypes.number,
  paused: PropTypes.bool,
  onAudioLoad: PropTypes.func,
  onAudioProgress: PropTypes.func,
  onAudioEnd: PropTypes.func,

  onLoad: PropTypes.func,
  onProgress: PropTypes.func,
  onEnd: PropTypes.func,
  ...View.propTypes,
};
AppleMusicPlayer.defaultProps = {
  seek: null,
  paused: true,
  onLoad: null,
  onProgress: null,
  onEnd: null,
};

const RNAppleMusicPlayer = requireNativeComponent('RNAppleMusicPlayer', AppleMusicPlayer, {
  nativeOnly: {
    storeId: true,
    seek: true,
  },
});
