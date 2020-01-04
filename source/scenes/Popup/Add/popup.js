import React from 'react';
import { View, Keyboard, FlatList } from 'react-native';
import { Button, Icon, Text, TextInput } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import PopupDialog from 'react-native-popup-dialog';
import { handler, shallowEqual } from '@redux';
import gs from '@common/states';
import g from '@common/global';
import _ from 'lodash';
import apis from '@lib/apis';
import { bs, sizes } from '@theme';
import styles from './styles';

const { drop, hud } = handler.alert;

const Item = ({
  item, index, selected, onPressItem,
}) => (
    <Button activeOpacity={0.9} style={[styles.row, selected && styles.row_on]} onPress={() => { onPressItem(item, index); }} >
      <Text color="#000" size={14} >{item}</Text>
    </Button>
  );

export default class Popup extends React.Component {
  state = {
    name: '',
    selected: [],
    playlist: [],
    isRender: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  show(song) {
    this._song = song;
    gs.panMovable = false;

    this.popup.show();
    this.setState({
      isRender: true,
      playlist: [],
    });
    this._requestPlaylist();
  }
  dismiss() {
    this.popup.dismiss();
  }

  _song = null;
  _requestPlaylist = async () => {
    if (!gs.playlists) {
      await gs.requestPlaylists();
    }

    let playlist = _.filter(gs.playlists || [], l => l.type === 'chilll');
    playlist = _.map(playlist || [], l => l.name);
    this.setState({ playlist });
  }

  _addSong = (lists) => {
    gs.addSongToPlaylists(this._song, lists, () => {
      this.popup.dismiss();
    });
  }

  _onDismissed = () => {
    Keyboard.dismiss();
    gs.panMovable = true;
    this.setState({ isRender: false });
  }

  _onPressDone = () => {
    if (!this.state.selected.length) {
      this.popup.dismiss();
      return;
    }
    this._addSong(this.state.selected);
  }

  _onPressAdd = () => {
    if (g.isEmpty(this.state.name)) {
      drop.showError('Add Playlist', 'Please enter playlist name to add.');
      return;
    }
    this._addSong([this.state.name]);
  }

  _onRowSelected = (item) => {
    const index = this.state.selected.findIndex(name => name.toUpperCase() === item.toUpperCase());
    console.log(item, index);
    if (index === -1) {
      const selected = this.state.selected.slice(0);
      selected.push(item);
      this.setState({ selected });
    } else {
      const selected = this.state.selected.slice(0);
      selected.splice(index, 1);
      this.setState({ selected });
    }
  }

  render() {
    const width = sizes.em(340, 500);

    return (
      <PopupDialog
        width={width} height={null} dialogStyle={styles.dialog}
        ref={(node) => { this.popup = node; }}
        onDismissed={this._onDismissed}
      >
        { this.state.isRender && (
          <View style={styles.content} >
            {this._renderTitle()}
            {this._renderList()}
          </View>
        )}

        { this.state.isRender && this._renderDone() }
      </PopupDialog>
    );
  }

  _renderDone = () => (
    <Button bheight={sizes.em(36)} bbackground="#DCAF00" bstyle={bs.center} onPress={this._onPressDone} >
      <Text color="#000" size={15} >DONE</Text>
    </Button>
  )

  _renderTitle = () => (
    <View style={styles.view_name} >
      <TextInput
        color="#000" size={15} style={bs.flex}
        placeholder="ADD PLAYLIST / #TAG"
        placeholderTextColor="#555"
        keyboardAppearance="dark"
        onChangeText={name => this.setState({ name })}
      />
      <Button style={styles.btn_add} onPress={this._onPressAdd} >
        <Icon name="mt add" size={24} color="black" />
      </Button>
    </View>
  )

  _renderList = () => {
    const list = _.map(this.state.playlist, (name) => {
      const selected = _.findIndex(this.state.selected, sel => sel.toUpperCase() === name.toUpperCase()) >= 0;
      return {
        data: name,
        selected,
      };
    });
    return (
      <FlatList
        data={list}
        keyExtractor={(item, index) => `addlist_${index}`}
        renderItem={this._renderItem}
        style={styles.list}
      />
    );
  }
  _renderItem = ({ item, index }) => (
    <Item item={item.data} index={index} selected={item.selected} onPressItem={this._onRowSelected} />
  )
}
