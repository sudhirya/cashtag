/* @flow weak */

import React from 'react';
import { FlatList } from 'react-native';
// import _ from 'lodash';
import Item from './item';
import styles from './styles';

export default ({ data, onPressItem }) => {
  const renderItem = ({ ...props }) => (
    <Item {...props} onPressItem={onPressItem} />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `song_${index}`}
      renderItem={renderItem}
      style={styles.container}
    />
  );
};
