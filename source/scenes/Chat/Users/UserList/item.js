/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Avatar } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { shallowEqual } from '@redux';
import { bs, sizes, images } from '@theme';
import styles from './styles';
import { Dropdown } from 'react-native-material-dropdown';

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
    // item.section
    if (item.section && item.section.length) {
      let data = [{
        value: 'FRIENDS',
      }, {
        value: 'INDUSTRY',
      }, {
        value: 'BUSINESSES',
      }];
      return (
        <View style={styles.section} >
          <Dropdown
          data={data}
          value="Friends"
          containerStyle={styles.dropdown_section}
          />
        </View>
      )
    }

    return (
      <Button style={styles.row} onPress={this.onPressItem} activeOpacity={0.9} >
        <Avatar avatar={item.avatar} size={sizes.em(36)} placeholder={images.ic_no_user} background="#EEE" />
        <View style={[bs.start_start, bs.mh_2x, bs.flex]} >
          <Text medium color="#fff" size={15} >{item.name || item.fullName || item.username || ''}</Text>
        </View>
        {/*<Icon name="fa paper-plane" color="#fff" size={24} />*/}
        <FIcon name="send" color="#fff" size={24} />
      </Button>
    );
  }
}
