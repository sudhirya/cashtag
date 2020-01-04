/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { shallowEqual } from '@redux';
import { bs } from '@theme';
import _ from 'lodash';
import SongItem from './SongItem';

export default class GridItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  render() {
    const {
      data, row, compIndex, ...otherProps
    } = this.props;

    const items = _.map(data, (item, index) => (
      <SongItem
        item={item} row={row} index={index}
        key={`songitem_${compIndex}_${row}_${index}`}
        {...otherProps}
      />
    ));

    return (
      <View style={[bs.flex_row, bs.self_stretch]} >
        {items}
      </View>
    );
  }
}
