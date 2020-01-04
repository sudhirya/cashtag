
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, requireNativeComponent, View } from 'react-native';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export default class SpotifyPlayer extends React.Component {
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
      playableUri: this.props.playableUri,
      onAudioLoad: this._onLoad,
      onAudioProgress: this._onProgress,
      onAudioEnd: this._onEnd,
    });

    return (
      <RNSpotifyPlayer
        ref={this._assignRoot}
        {...nativeProps}
      />
    );
  }
}

SpotifyPlayer.propTypes = {
  /* Native only */
  playableUri: PropTypes.string.isRequired,
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
SpotifyPlayer.defaultProps = {
  seek: null,
  paused: true,
  onLoad: null,
  onProgress: null,
  onEnd: null,
};

const RNSpotifyPlayer = requireNativeComponent('RNSpotifyPlayer', SpotifyPlayer, {
  nativeOnly: {
    playableUri: true,
    seek: true,
  },
});
