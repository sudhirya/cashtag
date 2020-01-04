/* @flow */

import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { Button, Text, Image } from '@components/controls';
import { shallowEqual } from '@redux';
import { bs, sizes, images } from '@theme';
import styles from './SongItem.styles';
import g from "../../common/global";

export default class SongItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  onPressItem = () => {
    const {
      item, row, index, onPressItem,
    } = this.props;
    onPressItem && onPressItem(item, row, index);
  }
  onLongPressItem = () => {
    const {
      item, row, index, onLongPressItem,
    } = this.props;
    onLongPressItem && onLongPressItem(item, row, index);
  }

  render() {
    const {
      item: song, animScroll, contentSize, listHeight,
    } = this.props;

    const row = parseInt(this.props.row, 10);
    const col = parseInt(this.props.index, 10);
    const thumbHeight = { height: sizes.flat_song_size };

    // const thumbWidth = Math.floor(sizes.window.width / sizes.song_in_row) + 2;
    const thumbWidth = Math.floor(sizes.window.width / 1);
    const bt = row === 0 ? 1 : 0, bl = col === 0 ? 0 : 1;

    const borderStyle = [
      bs.absolute_full, styles.border, {
        borderLeftWidth: bl, borderTopWidth: bt, borderRightWidth: 0, borderBottomWidth: 1,
      },
    ];

    if (!song) {
      return (
        <View style={[styles.row, thumbHeight]} >
          { /* <View style={borderStyle} /> */}
        </View>
      );
    }

    const y = row * sizes.song_size;
    const lastOffset = contentSize - listHeight - sizes.song_size;
    const hm1 = Math.min(y - sizes.song_size * 3, lastOffset) - 0.01;
    const hm2 = Math.min(y, lastOffset);
    const hm3 = y;
    const hm4 = y + sizes.song_size;
    const animOverlayOpacity = animScroll.interpolate({
      inputRange: [y - sizes.song_size * 1000, hm1, hm2, hm3, hm4, y + sizes.song_size * 1000],
      outputRange: [0.8, 0.8, 0.8, 0.8, 0.7, 0.7],
    });
    const overlayOpacity = { opacity: animOverlayOpacity };

    const thumbImage = song.thumbImage ? { uri: song.thumbImage } : images.img_def_song_thumb;
    const artist = song.artist || '';
    const title = song.title1 || '';

    return (
      <View style={[styles.row, thumbHeight]} >
        <Button style={styles.btn_row} onPress={this.onPressItem} onLongPress={this.onLongPressItem} >
          <Image
            key={`list_thumb_${song._id}`}
            stretch width={thumbWidth + 2} height={thumbHeight.height + 2}
            source={thumbImage} style={styles.img_thumb}
          />
          <Animated.View style={[styles.overlay, overlayOpacity]} />
          <View style={styles.view_title} >
            <Image contain width={sizes.em(28)} height={sizes.em(28)} source={images.ic_list_play} style={bs.center} />
          </View>
          <View style={styles.view_title2} >
            <Text transparent center color="#FFF" size={15} style={bs.txt_artist} numberOfLines={1} >{g.escapeSpecialChars(title)}</Text>
            <Text transparent center color="#fff" size={13} style={bs.txt_artist} numberOfLines={1} >{artist}</Text>
          </View>
        </Button>
        <View style={borderStyle} pointerEvents="none" />
      </View>
    );
  }
}
