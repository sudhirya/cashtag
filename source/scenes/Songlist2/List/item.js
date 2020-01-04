/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Image } from '@components/controls';
import { shallowEqual } from '@redux';
import { bs, sizes, images } from '@theme';
import styles from './styles';

export default class Item extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  _onPressItem = () => {
    const { item, index, onPressItem } = this.props;
    onPressItem && onPressItem(item, index);
  }

  render() {
    const { item: song } = this.props;
    const artist = song.artist;
    const title = song.title;
    const thumbImage = song.thumbImage ? { uri: song.thumbImage } : images.img_def_song_thumb;

    return (
      <View style={styles.list_row} >
        <View style={styles.view_song_thumb} >
          <Image cover width={sizes.em(70)} height={sizes.em(70)} source={thumbImage} style={bs.absolute_full} />
          <Button onPress={this._onPressItem} style={styles.btn_play} >
            <View style={styles.view_play_circle} >
              <Icon name="et controller-play" size={sizes.em(20)} color="white" />
            </View>
          </Button>
        </View>

        <View style={styles.view_song_info} >
          <Text size={16} color="#fff" numberOfLines={1} ellipsizeMode="tail" >{artist}</Text>
          <Text size={12} color="#fff" numberOfLines={1} ellipsizeMode="tail" >{title}</Text>
        </View>
      </View>
    );
  }
}
