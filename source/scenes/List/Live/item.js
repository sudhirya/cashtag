/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text, Image } from '@components/controls';
import { shallowEqual } from '@redux';
import { bs, sizes, colors, images } from '@theme';
import styles from './styles';

export default class Item extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  onPressItem = () => {
    const { item, index, onPressItem } = this.props;
    onPressItem && onPressItem(item, index);
  }

  render() {
    const { item } = this.props;
    const szPlay = sizes.em(36);

    return (
      <View style={styles.item} >
        <Button style={styles.btn_play} onPress={this.onPressItem} >
          <Image contain width={szPlay} height={szPlay} tint={colors.text} source={images.ic_player_play} />
        </Button>
        <View style={styles.view_title} >
          <Text color={colors.text} size={16} >{item.artist}</Text>
          <Text color={colors.text_light} size={14} >{item.isAudio ? 'Audio Stream' : 'Video Stream'}</Text>
        </View>
      </View>
    );
  }
}
