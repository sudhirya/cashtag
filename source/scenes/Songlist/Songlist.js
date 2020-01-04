import React from 'react';
import { View } from 'react-native';
import { Button, Icon, Text, Image } from '@components/controls';
import { SortList } from '@components/sortlist';
import Swipeable from '@components/swipeable';
import _ from 'lodash';
import apis from '@lib/apis';
import { connect } from 'react-redux';
import { handler } from '@redux';
import setupSong from '@model/song';
import gs from '@common/states';
import { routes } from '@routes';
import { colors, sizes, images, bs } from '@theme';
import styles from './Songlist.styles';

const { navigation } = handler;
const { drop, hud } = handler.alert;

class Songlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSwiping: false,
    };
    this.rowRefs = [];

    this.buildDataSource([]);
  }

  _mounted = false;
  componentDidMount() {
    this._mounted = true;
    setTimeout(() => {
      this._requestSongs();
    }, 50);
  }
  componentWillUnmount() {
    this._mounted = false;
  }

  buildDataSource(songlist) {
    const newList = songlist.sort((song1, song2) => {
      const order1 = song1.order ? song1.order : 0;
      const order2 = song2.order ? song2.order : 0;
      return order1 - order2;
    });

    const temp = _.map(songlist, info => info.songObject);
    const songs = setupSong(temp);

    this.lists = songlist;
    this.state.songList = songs;
    this.state.songOrder = newList.map((song, index) => index);
  }

  _requestSongs(showHud) {
    const playlistName = gs.context.playlist;
    apis.getPlaylistByName(playlistName).then((res) => {
      if (showHud) hud.hide();

      this.buildDataSource(res.results);
      this.forceUpdate();
    }).catch(() => {});
  }

  _onPressClose = () => {
    navigation.navback();
  }

  _onPressRow = (song) => {
    hud.show('Requesting...');
    gs.loadPlaylist(gs.context.playlist, song, () => {
      hud.hide();
      navigation.popTo(routes.keys.app.home);
      gs.playSong();
    });
  }
  _onDeleteSong = (song, sec, row) => {
    const playlistName = gs.context.playlist;
    this.rowRefs[row].recenter();
    hud.show('Requesting...');
    apis.removeSongFromPlaylist(song._id, playlistName).then(() => {
      this._requestSongs(true);
    }).catch(() => {
      hud.hide();
    });
  }

  _onRowMoved = (e) => {
    const playlistName = gs.context.playlist;
    const newOrder = this.state.songOrder.slice();
    const oldOrder = this.state.songOrder;

    newOrder.splice(e.to, 0, newOrder.splice(e.from, 1)[0]);

    const params = newOrder.map((index, order) => ({
      _id: this.lists[index]._id,
      order,
    }));

    hud.show('Requesting...');
    apis.reorderPlaylist(params, playlistName).then(() => {
      hud.hide();
    }).catch(() => {
      // console.log('failed to reorder songs');
      drop.showError('Playlist', 'Failed to order songs');
      hud.hide();
      this.state.songOrder = oldOrder;
      this.forceUpdate();
    });

    this.state.songOrder = newOrder;
    this.forceUpdate();
  }

  render() {
    return (
      <View style={styles.container} >
        { this._renderTitle() }
        { this._renderList() }
      </View>
    );
  }

  _renderTitle = () => {
    const title = gs.context.playlist;

    return (
      <View style={styles.view_title} >
        <Text size={17} color={colors.text} style={[bs.flex, bs.ml_5x]} numberOfLines={1} >{title}</Text>
        <Button onPress={this._onPressClose} style={styles.btn_close} >
          <Icon name="io md-close" size={24} color={colors.text} />
        </Button>
      </View>
    );
  }

  _renderList = () => (
    <SortList
      scrollEnabled={!this.state.isSwiping}
      data={this.state.songList}
      style={styles.list}
      order={this.state.songOrder}
      onRowMoved={this._onRowMoved}
      renderRow={this._renderRow}
    />
  )

  _renderRow = (song, sec, row, temp, active, handlers1) => {
    const artist = song.artist;
    const title = song.title;
    const thumbImage = song.thumbImage ? { uri: song.thumbImage } : images.img_def_song_thumb;
    const rightButtons = [
      <Button style={styles.btn_delete} onPress={this._onDeleteSong.bind(this, song, sec, row)} >
        <Text size={12} color="#fff" >DELETE</Text>
      </Button>,
    ];

    return (
      <View style={[styles.list_row, { width: sizes.window.width }]} >
        <Swipeable
          ref={(node) => { this.rowRefs[row] = node; }}
          rightButtons={rightButtons}
          onSwipeStart={() => this.setState({ isSwiping: true })}
          onSwipeRelease={() => this.setState({ isSwiping: false })}
        >
          <Button style={styles.list_row} {...handlers1} >
            <View style={styles.view_song_thumb} >
              <Image cover width={sizes.em(70)} height={sizes.em(70)} source={thumbImage} style={bs.absolute_full} />
              <Button onPress={this._onPressRow.bind(this, song, sec, row)} style={styles.btn_play} >
                <View style={styles.view_play_circle} >
                  <Icon name="et controller-play" size={sizes.em(20)} color="white" />
                </View>
              </Button>
            </View>
            <View style={styles.view_song_info} >
              <Text size={16} color="#fff" numberOfLines={1} ellipsizeMode="tail" >{artist}</Text>
              <Text size={12} color="#fff" numberOfLines={1} ellipsizeMode="tail" >{title}</Text>
            </View>
          </Button>
        </Swipeable>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  playerFlag: state.main.playerFlag,
});

const mapDispatchToProps = dispatch => ({
  dispatcher: state => dispatch(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Songlist);
