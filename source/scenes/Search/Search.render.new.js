import React from 'react';
import {FlatList, View} from 'react-native';
import { Button, Text, TextInput, Image, Icon } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { bs, sizes, images, colors } from '@theme';
import SongGrid from '@scenes/SongGrid';
import { PlayList } from '@scenes/List';
// import _ from 'lodash';
// import gs from '@common/states';
import styles from './Search.styles';
import GridItem from "../FlatSongGrid/GridItem";

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderSearchBar() }
          { this._renderTabBar() }
          { this._renderImport() }
          { this._renderContent() }

          {/*  <Button style={styles.chat_button} onPress={this._onPressChat} >
            <Icon name="fa paper-plane" color={colors.text} size={26} />
            <FIcon name="send" color={colors.text} size={26} />
          </Button>
          */}

          <Button style={styles.chat_button} onPress={this._onPressWallet} >
            <Image width={36} height={28} source={images.ic_wallet} />
          </Button>
        </View>
      );
    }

    _renderSearchBar = () => (
      <View style={[styles.searchbar, bs.mb_2x]} >
        <Icon name="io md-search" size={24} color={colors.text} style={{ ...bs.pl_3x, ...bs.pt_2x }} />

        <TextInput
          border bunderline="#fff" bstyle={[bs.flex, bs.mt_2x, bs.mh_2x]} bpadding={1} bheight={sizes.em(35)}
          size={16} color="#fff" placeholder="SEARCH" placeholderTextColor="#888"
          value={this.state.searchText} onChangeText={this._onSearchKeyChanged}
        />

        <Button onPress={this._onPressClose} style={styles.btn_close} >
          <Icon name="io md-close" size={24} color={colors.text} />
        </Button>
      </View>
    )

    _renderTabBar = () => (
      <View style={styles.tabbar} >
        { this._renderTabButton('#DMS', 'DMS') }
        { this._renderTabButton('#STREAM', 'TAGS') }
        { this._renderTabButton('#SHARED', 'SAVES') }
        { this._renderTabButton('#FIRE', 'STARS') }
        { this._renderTabButton('#PLAYLIST', 'PLAYS') }
      </View>
    )

    _renderTabButton = (tab, text) => {
      let renderImage = null;
      if (tab === '#STREAM') {
        // renderImage = <Image contain width={sizes.em(26)} height={sizes.em(25)} source={images.ic_hash} />;
        renderImage = (
          <View width={sizes.em(26)} height={sizes.em(26)}><Text bold size={sizes.em(26)}>#</Text></View>
        );
      } else if (tab === '#DMS') {
        renderImage = <FIcon name="send" color={colors.text} size={22} onPress={this._onPressChat} />;
      } else if (tab === '#SHARED') {
        renderImage = <Image contain width={sizes.em(26)} height={sizes.em(25)} source={images.ic_live_audio_on} />;
      } else if (tab === '#FIRE') {
        renderImage = <Image contain width={sizes.em(26)} height={sizes.em(25)} source={images.ic_fuego} />;
      } else if (tab === '#PLAYLIST') {
        // renderImage = <Icon name="fa server" size={22} color="#fff" />;
        renderImage = <FIcon name="server" size={22} color="#fff" />;
      }
      return (
        <Button style={styles.btn_tab} onPress={this._onPressTab.bind(this, tab)}
                onPressIn={this._onPressHolding.bind(this, tab)} onPressOut={this._onPressHoldingOff} >
          { renderImage }
          <View style={[styles.line_tab_active, bs.mt_1x, { opacity: this.state.tab === tab ? 1 : 0 }]} />
          <Text size={15} color="#fff" style={bs.mt_1x}>{text}</Text>
        </Button>
      )
    }

    _renderImport = () => {
      if (this.state.tab !== '#PLAYLIST') return null;
      return (
        <Button
          bbackground="#7ED321" bheight={sizes.em(40)} bradius={sizes.em(5)} bstyle={[bs.mh_6x, bs.mt_5x, bs.mb_2x]}
          onPress={this._onPressWallet}
        >
          <Text size={15} color="#fff" >IMPORT PLAYLISTS</Text>
        </Button>
      );
    }

    _renderContent = () => {
      const isStream = this.state.tab === '#SHARED';
      const isDMS = this.state.tab === '#DMS';
      const isPlaylist = this.state.tab === '#PLAYLIST';
      const isSonglist = !isStream && !isPlaylist;
      const isFire = this.state.tab === '#FIRE';
      let renderDesc = null;

      if (this.state.holding) { console.log(this.state.holdingtab);
        if (this.state.holdingtab === '#SHARED') renderDesc = this._renderStreamDesc();
        else if (this.state.holdingtab === '#DMS') renderDesc = this._renderDMSDesc();
        else if (this.state.holdingtab === '#STREAM') renderDesc = this._renderDiscoverDesc();
        else if (this.state.holdingtab === '#FIRE') renderDesc = this._renderFireDesc();
        else if (this.state.holdingtab === '#PLAYLIST') renderDesc = this._renderPlaylistDesc();

      } else if (!this.songs || !this.songs.length) {
        if (this.state.tab === '#STREAM') renderDesc = this._renderDiscoverDesc();
        else if (this.state.tab === '#FIRE') renderDesc = this._renderFireDesc();
      }

      return (
        <View style={[styles.content, !isPlaylist && bs.mt_3x]} >
          { isDMS && this._renderDMS() }
          { isStream && this._renderStream() }
          { isPlaylist && this._renderPlaylist() }
          { isSonglist && !isFire && this._renderSonglist(!!renderDesc) }
          { isFire && this._renderFireSongs()}
          { renderDesc }
        </View>
      );
    }

    _renderDMS = () => (
      <PlayList holding={this.state.holding} showTV showButtons renderDesc={this._renderDMSDesc} />
    )
    _renderStream = () => (
      <PlayList holding={this.state.holding} showTV showButtons renderDesc={this._renderStreamDesc} />
    )
    _renderPlaylist = () => (
      <PlayList holding={this.state.holding} isPlaylist showSource showTV showButtons renderDesc={this._renderPlaylistDesc} />
    )
    _renderSonglist = (visible) => (
      <View style={[bs.match_parent, bs.f_opacity(visible ? 0 : 1)]} >
        <SongGrid
          overlay songs={this.songs}
          onPressItem={this._onPressSong}
          onLongPressItem={this._onLongPressSong}
        />
      </View>
    )

    _renderDMSDesc = () => (
      <View style={styles.no_list} >
        <FIcon name="send" color={colors.text} size={26} />
      </View>
    )
    _renderDiscoverDesc = () => (
      <View style={styles.no_list} >
        <Image contain width={sizes.em(24)} height={sizes.em(40)} source={images.ic_live_video_on} />
      </View>
    )
    _renderFireDesc = () => (
      <View style={styles.no_list} >
        <Image contain width={sizes.em(24)} height={sizes.em(40)} source={images.ic_fuego} />
      </View>
    )
    _renderStreamDesc = () => (
      <View style={styles.no_list} >
        <Image contain width={sizes.em(24)} height={sizes.em(40)} source={images.ic_live_audio_on} />
      </View>
    )

    _renderPlaylistDesc = () => (
      <View style={styles.no_list} >
        <Text center line={40} size={16} color="#888" style={bs.mh_6x} >
          SYNC YOUR{' '}<Icon color="#fff" size={24} name="io ios-musical-notes" />{'\n'}
          (APPLE, SPOTIFY, SOUNDCLOUD)
        </Text>
      </View>
    )

    _renderFireSongs = () => {
      const data = this._buildSongs(this.songs);
      return (
        <View style={{...bs.match_parent, overflow:'hidden'}}>
          <FlatList
            data={data}
            renderItem={this._renderFireRow}
            keyExtractor={(item, index) => `songrow_${this.compIndex}_${index}`}
            style={bs.match_parent}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            onScroll={this.onScroll}
            onContentSizeChange={this.onContentSizeChange}
            onLayout={this.onLayout}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={20}
          />
          { this._renderOverlayTop() }
          { this._renderOverlayBottom() }
        </View>
      );
    }

    _renderOverlayTop = () => {
      return (
        <Image
          stretch width={this.state.listWidth + 2} height={sizes.em(50)} source={images.bg_list_top_overlay} pointerEvents="none"
          style={styles.overlay_top}
        />
      );
    }
    _renderOverlayBottom = () => {
      return (
        <Image
          stretch width={this.state.listWidth + 2} height={sizes.em(50)} source={images.bg_list_bottom_overlay} pointerEvents="none"
          style={styles.overlay_bottom}
        />
      );
    }

    _renderFireRow = ({ item, index }) => (
      <GridItem
        data={item}
        row={index}
        contentSize={this.state.contentSize}
        listHeight={this.state.listHeight}
        animScroll={this.state.animScroll}
        compIndex={this.compIndex}
        onPressItem={this._onPressSong}
        onLongPressItem={this._onLongPressSong}
      />
    )
  };
}

export default renderMixin;
