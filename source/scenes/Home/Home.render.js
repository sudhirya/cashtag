import React from 'react';
import { View, Animated } from 'react-native';
import { LinkPopup, GuidePopup, SongCardPopup, ArtistCardPopup } from '@scenes/Popup';
import { sizes } from '@theme';
import gs from '@common/states';
import SongGrid from '@scenes/SongGrid';
import Header from './Header';
import Profile from './Profile';
import Broadcast from './Broadcast';
import Player from './Player';
import Search from './Search';
import styles from './Home.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} ref={(node) => { gs.handles.mainView = node; }} >
          <View style={styles.container}>
            { this._renderSearch() }
            { this._renderBroadcast() }
            { this._renderProfile() }
            { this._renderHeader() }
            { this._renderPlayer() }
          </View>
          { this._renderLinkPopup() }
          { this._renderGuidePopup() }
          { this._renderSongCardPopup() }
          { this._renderArtistCardPopup() }
        </View>
      );
    }

    _renderHeader = () => (
      <Header animView={this.state.animView} />
    )
    _renderProfile = () => (
      <Profile animView={this.state.animView} pan={this.pan}/>
    )
    _renderBroadcast = () => (
      <Broadcast pan={this.pan}/>
    )
    _renderPlayer = () => {
      const trans = sizes.window.height - sizes.header.height2;
      const animTrans = this.state.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [trans, trans, 0, 0],
      });
      const animTop = this.state.animFull.interpolate({
        inputRange: [0, 1],
        outputRange: [sizes.header.height2, 0],
      });
      const top = { top: animTop };
      const transY = { transform: [{ translateY: animTrans }] };
      const listHeight = { height: sizes.songlist.height() };

      return (
        <Animated.View style={[styles.view_player, top, transY]} >
          <Player animView={this.state.animView} animFull={this.state.animFull} pan = {this.pan}/>
          <SongGrid
            overlay songs={gs.songData.songs || []} loading={gs.songData.loading}
            style={[styles.grid_song, listHeight]}
            onListPos={(pos) => { gs.context.listPos = pos; }}
            onLoadMore={this.onLoadMore}
            onPressItem={this.onPressSong}
            onLongPressItem={this.onLongPressSong}
          />
        </Animated.View>
      );
    }

    _renderSearch = () => (
      <Search />
    )

    _renderLinkPopup = () => (
      <LinkPopup ref={(node) => { gs.handles.linkPopup = node; }} />
    )

    _renderGuidePopup = () => (
      <GuidePopup ref={(node) => { gs.handles.guidePopup = node; }} />
    )

    _renderSongCardPopup = () => (
      <SongCardPopup ref={(node) => { gs.handles.songCardPopup = node; }} />
    )
    _renderArtistCardPopup = () => (
      <ArtistCardPopup ref={(node) => { gs.handles.artistCardPopup = node; }} />
    )
  };
}

export default renderMixin;
