/* @flow weak */

import React from 'react';
import { View, FlatList } from 'react-native';
import { shallowEqual, handler } from '@redux';
import { Text, Button, Image, Icon } from '@components/controls';
import { SortList } from '@components/sortlist';
import { routes } from '@routes';
import setupSong from '@model/song';
import gs from '@common/states';
import apis from '@lib/apis';
import { bs, colors, sizes, images } from '@theme';
import Item from './item';
import styles from './styles';

const { navigation } = handler;
const { hud, drop } = handler.alert;

export default class List extends React.Component {
  state = {
    list: [],
    order: [],
  };
  albums = [];

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  mounted = false;
  componentDidMount() {
    this.mounted = true;
    this._requestPlaylist();
    this._requestAlbums();
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.playlistFlag !== nextProps.playlistFlag) {
      this.buildDataSource();
    }
  }

  buildDataSource() {
    let playlists = gs.playlists;
    if (this.props.isPlaylist) {
      playlists = playlists.filter(el => el.type !== 'chilll');
    } else {
      playlists = playlists.filter(el => el.type === 'chilll' || el.isAlsoStream);
    }

    this.state.list = playlists;
    this.state.order = playlists.map((info, index) => index);
  }

  /**
   * action handlers
   */
  _onPressView = (listInfo) => {
    gs.context.playlist = listInfo.name;
    navigation.navigate({ name: routes.names.app.songlist });
  }
  _onPressEdit = (listInfo) => {
    listInfo;
  }
  _onPressDelete = (listInfo) => {
    listInfo;
  }
  _onPressPlay = (listInfo) => {
    const songs = gs.playlistsMap[listInfo.name];
    if (songs && songs.length) {
      gs.loadPlaylistSongs(songs, songs[0]);
      gs.playSong();
      navigation.popTo(routes.keys.app.home);
    }
  }

  _onRowMoved = async (e) => {
    this._requestRowMove(e.from, e.to);
  }

  _onPressAddStream = (item) => {
    if (!this.props.isPlaylist) return;

    this._requestAddToStream(item);
  }

  _onPressAlbum = () => {
    this.props.onPressAlbum && this.props.onPressAlbum();
  }
  _onPressAlbumPlay = (item) => {
    if (!item.songs || !item.songs.length) return;

    const songs = item.songs.slice(0).map(el => ({ ...el }));
    setupSong(songs);
    gs.loadPlaylistSongs(songs, songs[0]);
    gs.playSong();
    navigation.popTo(routes.keys.app.home);
  }

  /**
   * api requests
   */
  _requestPlaylist = async () => {
    await gs.requestPlaylists();
    this.buildDataSource();
    this.mounted && this.forceUpdate();
  }

  _requestAddToStream = async (item) => {
    hud.show();
    try {
      await apis.addPlaylistToStream(item.name);
    } catch (ex) {
      console.log('PlaylistList::_requestAddToStream failed: ', ex);
      drop.showError('Playlist', 'Failed to add to stream');
    }
    hud.hide();
  }

  _requestRowMove = async (from, to) => {
    const newOrder = this.state.order.slice();
    const newList = gs.playlists.slice();

    newOrder.splice(to, 0, newOrder.splice(from, 1)[0]);
    newList.splice(to, 0, newList.splice(from, 1)[0]);

    const params = newOrder.map((index, order) => ({
      name: this.state.list[index],
      order,
    }));

    hud.show();
    try {
      await apis.reorderPlaylistList(params);

      gs.playlists = newList;
      if (this.mounted) this.setState({ order: newOrder });
    } catch (ex) {
      console.log('PlaylistList::_onRowMoved failed: ', ex);
      drop.showError('Playlist', 'Failed to order playlist');
    }
    hud.hide();
  }

  _requestAlbums = async () => {
    if (!this.props.showAlbum) return;
    try {
      this.albums = await apis.getAlbums();
      if (this.mounted) this.forceUpdate();
    } catch (ex) {
      console.log('PlaylistList::_requestAlbums failed: ', ex);
    }
  }

  /**
   * render functions
   */
  render() {
    if (this.props.isAlbum) {
      return this._renderAlbumlist();
    }

    return this._renderPlaylist();
  }

  _renderPlaylist = () => {
    let renderDesc = null;
    if (!this.state.list || !this.state.list.length) {
      if (!this.props.showAlbum || !this.albums.length) {
        renderDesc = this.props.renderDesc && this.props.renderDesc();
      }
    }

    return (
      <View style={styles.list} >
        <View style={[bs.match_parent, bs.f_opacity(this.props.holding || renderDesc ? 0 : 1)]} >
          <SortList
            data={this.state.list}
            order={this.state.order}
            style={[bs.match_parent, bs.mt_1x]}
            onRowMoved={this._onRowMoved}
            renderRow={this._renderPlaylistItem}
            renderHeader={this._renderPlaylistAlbum}
          />
        </View>

        { renderDesc }
      </View>
    );
  }

  _renderPlaylistItem = (listInfo, sec, row, temp, active, handlers1) => (
    <Item
      handlers={handlers1} showButtons={this.props.showButtons}
      showSource={this.props.showSource} showTV={this.props.showTV}
      item={listInfo} sec={sec} row={row} active={active}
      onPressPlay={this._onPressPlay}
      onPressView={this._onPressView}
      onPressEdit={this._onPressEdit}
      onPressDelete={this._onPressDelete}
      onPressAddStream={this._onPressAddStream}
    />
  )

  _renderPlaylistAlbum = () => {
    if (!this.props.showAlbum) return null;
    if (!this.albums.length) return null;

    return (
      <Button style={styles.row} onPress={this._onPressAlbum} >
        <View style={styles.btn_row_play} >
          <Image contain tint="#fff" width={sizes.em(36)} height={sizes.em(36)} source={images.ic_player_play} />
        </View>
        <View style={styles.row_info} >
          <Text size={15} color={colors.text} >#ALBUMS</Text>
          <Text size={12} color={colors.text_light} >{this.albums.length} Albums</Text>
        </View>
      </Button>
    );
  }

  _renderAlbumlist = () => (
    <View style={styles.list} >
      <FlatList
        data={this.albums}
        keyExtractor={(item, index) => `albumlist_${index}`}
        renderItem={this._renderAlbumlistItem}
      />
    </View>
  )
  _renderAlbumlistItem = ({ item, index }) => (
    <Item showButtons={false} showSource={false} showTV={false}
      item={item} sec={0} row={index} onPressPlay={this._onPressAlbumPlay} />
  )
}
