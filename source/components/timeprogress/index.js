import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
import { shallowEqual } from '@redux';
import { sizes, bs } from '@theme';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    ...bs.self_stretch,
    ...bs.bg_transparent,
  },
  times: {
    ...bs.flex_row,
    ...bs.between_center,
  },
  time: {
    ...bs.font_normal,
    ...bs.bg_transparent,
    ...bs.mh_1x,
    ...bs.pv_1x,
    fontSize: sizes.em(11, null, false),
  },
  slider: {
    height: sizes.em(2, 3),
  },
  track: {
    ...bs.mt_none,
    height: sizes.em(2, 3),
  },
  thumb: {
    width: 0,
    height: 0,
  },
});

export default class TimeProgress extends React.Component {
  state = {
    timeLeft: '0:00',
    timeRight: '0:00',
    progress: 0,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  _mounted = false;
  componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false;
  }

  updateTime = (duration, elapsed) => {
    if (!this._mounted) return;

    const timeLeft = this.formattedTime(elapsed);
    const timeRight = this.formattedTime(duration);
    const progress = duration ? elapsed / duration : 0;
    if (this.state.timeLeft !== timeLeft || this.state.timeRight !== timeRight || this.state.progress !== progress) {
      this.setState({ timeLeft, timeRight, progress });
    }
  }

  formattedTime(sec) {
    if (sec === undefined) {
      return '0:00';
    }

    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec - minutes * 60);

    if (isNaN(minutes) || isNaN(seconds)) {
      return '0:00';
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  render() {
    const {
      onSlidingStart, onSlidingComplete, onSlidingChange,
      timeTop, timePad, timeColor, timeStyle, minTrackColor, maxTrackColor,
      sliderStyle, trackStyle, thumbStyle, style, ...otherProps
    } = this.props;

    const textStyle = [timeStyle, {
      color: timeColor,
      marginTop: timeTop ? 0 : timePad,
      marginBottom: timeTop ? timePad : 0,
    }];
    const texts = (
      <View style={styles.times} pointerEvents="none" >
        <Text style={textStyle}>{this.state.timeLeft}</Text>
        <Text style={textStyle}>{this.state.timeRight}</Text>
      </View>
    );
    const slider = (
      <Slider
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        onValueChange={onSlidingChange}
        minimumTrackTintColor={minTrackColor}
        maximumTrackTintColor={maxTrackColor}
        style={[styles.slider, sliderStyle]}
        trackStyle={[styles.track, trackStyle]}
        thumbStyle={[styles.thumb, thumbStyle]}
        value={this.state.progress}
        {...otherProps}
      />
    );
    return (
      <View style={[styles.container, style]} >
        { timeTop ? texts : slider }
        { timeTop ? slider : texts }
      </View>
    );
  }
}

TimeProgress.propTypes = {
  onSlidingStart: PropTypes.func,
  onSlidingComplete: PropTypes.func,
  onSlidingChange: PropTypes.func,
  timeTop: PropTypes.bool,
  timePad: PropTypes.number,
  timeColor: PropTypes.string,
  timeStyle: PropTypes.any,
  minTrackColor: PropTypes.string,
  maxTrackColor: PropTypes.string,
  sliderStyle: PropTypes.any,
  trackStyle: PropTypes.any,
  thumbStyle: PropTypes.any,
  style: PropTypes.any,
};

TimeProgress.defaultProps = {
  onSlidingStart: () => null,
  onSlidingComplete: () => null,
  onSlidingChange: () => null,
  timeTop: false,
  timePad: 0,
  timeColor: '#fff',
  timeStyle: styles.time,
  minTrackColor: '#4CB89A',
  maxTrackColor: 'rgba(255,255,255,0.6)',
  sliderStyle: styles.slider,
  trackStyle: styles.track,
  thumbStyle: styles.thumb,
  style: styles.container,
};
