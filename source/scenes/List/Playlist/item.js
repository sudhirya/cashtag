/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text, Image } from '@components/controls';
import { shallowEqual } from '@redux';
import { bs, sizes, colors, images } from '@theme';
import g from '@common/global';
import styles from './styles';

export default class Item extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  render() {
    const {
      item, handlers, showSource, showTV, showButtons,
      onPressPlay, onPressView, onPressEdit, onPressDelete, onPressAddStream,
    } = this.props;

    const imgSource = item.type === 'apple'
        ? images.ic_list_apple
        : item.type === 'spotify'
        ? images.ic_list_spotify
        : images.ic_list_chilll;
    const tintSource = item.type === 'apple' ? '#fff' : null;
    const count = g.ifNull(item.count, g.deepValue(item, 'songs.length'));

    return (
      <Button style={styles.row} {...handlers} >
        <Button style={styles.btn_row_play} onPress={() => { onPressPlay(item); }} >
          <Image contain tint="#fff" width={sizes.em(36)} height={sizes.em(36)} source={images.ic_player_play} />
        </Button>

        <View style={styles.row_info} >
          <Text size={15} color={colors.text} >{item.name}</Text>
          <Text size={12} color={colors.text_light} >{`${count} Songs`}</Text>

          { showButtons && (
            <View style={styles.view_row_btns} >
              <Button sytle={styles.btn_row_func} onPress={() => { onPressView(item); }} >
                <Text size={13} color="#878687" >VIEW</Text>
              </Button>
              <Text size={13} color="#878687" > • </Text>
              <Button sytle={styles.btn_row_func} onPress={() => { onPressEdit(item); }} >
                <Text size={13} color="#878687" >SHARE</Text>
              </Button>
              <Text size={13} color="#878687" > • </Text>
              <Button sytle={styles.btn_row_func} onPress={() => { onPressDelete(item); }} >
                <Text size={13} color="#878687" >DELETE</Text>
              </Button>
            </View>
          )}
        </View>

        { showSource && (
          <Image contain width={sizes.em(30)} height={sizes.em(30)} tint={tintSource} source={imgSource} style={[bs.p_1x]} />
        )}

        { showTV && (
          <Button style={[bs.p_1x, bs.ml_1x]} onPress={() => { item.isAlsoStream ? onPressDelete(item) : onPressAddStream(item); }} >
            <Image contain width={sizes.em(32)} height={sizes.em(32)} source={item.isAlsoStream ? images.ic_header_tv : images.ic_header_tv_gray} />
          </Button>
        )}
      </Button>
    );
  }
}
