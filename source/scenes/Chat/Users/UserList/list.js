/* @flow weak */

import React from 'react';
import { FlatList } from 'react-native';
// import _ from 'lodash';
import Item from './item';
import styles from './styles';

export default ({ data, onPressItem }) => {
  const renderItem = ({ item, index }) => (
    <Item
      item={item}
      index={index}
      onPressItem={onPressItem}
    />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `user_${index}`}
      renderItem={renderItem}
      style={styles.container}
    />
  );
};
