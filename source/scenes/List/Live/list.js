/* @flow weak */

import React from 'react';
import { View, FlatList } from 'react-native';
import { shallowEqual } from '@redux';
import { MDLiveSong } from '@model';
import apis from '@lib/apis';
import Item from './item';
import styles from './styles';

export default class List extends React.Component {
  state = {
    list: [],
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  _mounted = false;
  componentDidMount() {
    this._mounted = true;
    setTimeout(() => {
      this._requestPlaylist();
    }, 50);
  }
  componentWillUnmount() {
    this._mounted = false;
  }

  _requestPlaylist() {
    apis.getAllStreams().then((res) => {
      if (!this._mounted) return;

      const list = MDLiveSong.parseList(res);
      this.setState({ list });
    }).catch(() => {});
  }

  render() {
    return (
      <View style={styles.list} >
        <FlatList
          data={this.state.list}
          keyExtractor={(item, index) => `livelist_${index}`}
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  renderItem = ({ item, index }) => (
    <Item
      item={item}
      index={index}
      onPressItem={this.props.onPressItem}
    />
  )
}
