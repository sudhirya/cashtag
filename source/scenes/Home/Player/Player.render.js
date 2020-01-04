import React from 'react';
import { View, Animated } from 'react-native';
import { Button, Text, Image, Icon } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import TimeProgress from '@components/timeprogress';
import AudioStream from '@components/audiostream';
import Video from 'react-native-video';
import { ApplePlayer } from '@components/applemusic';
import { SpotifyPlayer } from '@components/spotify';
import { ViewType } from '@common/types';
import gs from '@common/states';
import g from '@common/global';
import _ from 'lodash';
import { bs, colors, sizes, images } from '@theme';
import styles from './Player.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      const { player } = gs;
      const { song } = player;
      const isFullscreen = (song && player.fullscreen) || player.fullani;
      const height1 = sizes.player.height();
      const height2 = sizes.songlist.thumbSize;
      const curHeight = this.props.viewType === ViewType.player ? height1 : height2;
      const animHeight = isFullscreen ? this.props.animFull.interpolate({
        inputRange: [0, 1],
        outputRange: [curHeight, sizes.window.height],
      }) : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [height1, height1, height1, height2],
      });
      const height = { height: animHeight };

      return (
        <Animated.View style={[styles.container, height]} {...this.props.pan.panHandlers}>
          { this._renderContent() }
        </Animated.View>
      );
    }

    _renderContent = () => {
      if (!gs.player.song) {
        return (
          <View style={[bs.match_parent, bs.center]} >
            <Image contain width={sizes.em(76)} height={sizes.em(76)} source={images.ic_spinner} />
          </View>
        );
      }

      return (
        <View style={bs.match_parent} >
          { this._renderSongInfo(true) }
          { this._renderPlayer() }
        </View>
      );
    }

    _renderSongInfo = (anim) => {
      const height1 = sizes.player.titleHeight + sizes.player.controlHeight;
      const height2 = sizes.songlist.thumbSize;
      const AnimView = anim ? Animated.View : View;
      const animHeight = !anim ? height1 : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [height1, height1, height1, height2],
      });
      const animLeft = !anim ? 0 : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 0, 0, height2],
      });
      const left = { left: animLeft };
      const height = { height: animHeight };

      return (
        <AnimView style={[styles.view_info, left, height]} >
          { this._renderTitle(anim) }
          { this._renderControlLarge(anim) }
          { this._renderProgress(anim, (node) => { gs.context.progress2 = node; }) }
        </AnimView>
      );
    }

    _renderTitle = (anim) => {
      const { player } = gs;
      const AnimView = anim ? Animated.View : View;
      const title = (player.song && player.song.title) || '';
      const artist = (player.song && player.song.artist) || '';
      const animFlex1to0 = !anim ? 1 : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [1, 1, 1, 0],
      });
      const animFlex0to1 = !anim ? 0 : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 0, 0, 1],
      });

      return (
        <Button onDoublePress={this._onPressMenu} style={[styles.view_title1, !anim && bs.p_status]} hitSlop={{top: 20, bottom: 20, right: 50, left: 50}}>
          <View style={styles.view_title2} >
            <AnimView style={{ flex: animFlex1to0 }} />
            <Text transparent color={colors.text} size={17} style={bs.mh_1x} numberOfLines={1} >{artist}</Text>
            <View style={{ flex: 1 }} />
          </View>
          <View style={styles.view_title2} >
            <View style={[bs.flex_row, bs.match_parent]} >
              <AnimView style={{ flex: animFlex1to0 }} />
              <Text transparent color={colors.text_light} size={12} style={[bs.mt_1x, bs.mh_1x]} numberOfLines={1} >
                {title}
              </Text>
              <View style={{ flex: 1 }} />
            </View>
            { !anim ? null : this._renderControlSmall() }
          </View>
          <AnimView style={{ flex: animFlex0to1 }} />
        </Button>
      );
    }
    _renderControlSmall = () => {
      const { player } = gs;
      const animWidth = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 0, 0, sizes.em(90)],
      });
      const animHeight = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 0, 0, sizes.em(32)],
      });
      const animOpacity = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 0, 0, 1],
      });
      const width = { width: animWidth };
      const height = { height: animHeight };
      const opacity = { opacity: animOpacity };
      const szIcon = sizes.em(16);
      const playImage = player.playing && !player.loading ? images.ic_player_pause_sm : images.ic_player_play_sm;

      return (
        <Animated.View style={[styles.view_ctrl_sm, width, height, opacity]} >
          <Button lock style={bs.p_1x} onPress={this.onPressPrev} >
            <Image stretch width={szIcon} height={szIcon} tint={colors.text} source={images.ic_player_backward_sm} />
          </Button>
          <Button lock style={bs.p_1x} onPress={this.onPressPlay} >
            <Image stretch width={szIcon} height={szIcon} tint={colors.text} source={playImage} />
          </Button>
          <Button lock style={bs.p_1x} onPress={this.onPressNext} >
            <Image stretch width={szIcon} height={szIcon} tint={colors.text} source={images.ic_player_forward_sm} />
          </Button>
        </Animated.View>
      );
    }
    _renderControlLarge = (anim) => {
      const { player } = gs;
      const ctrlHeight = sizes.player.controlHeight - sizes.player.sliderHeight;
      const animHeight = !anim ? ctrlHeight : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [ctrlHeight, ctrlHeight, ctrlHeight, 0],
      });
      const animOpacity = !anim ? 1 : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [1, 1, 1, 0],
      });
      const AnimView = anim ? Animated.View : View;
      const height = { height: animHeight };
      const opacity = { opacity: animOpacity };
      // const addSize = sizes.resize_value6(28);
      const isFuego = player.song && player.song.isFuegoPlaylist;
      const isDisco = player.song && player.song.isDiscoPlaylist;
      const clrBolt = gs.player.streamLiveAudio ? null : '#FFF';
      const clrFuego = isFuego ? null : '#FFF';
      const imagePlay = player.playing && !player.loading ? images.ic_player_pause : images.ic_player_play;
      // const imageBolt = player.streamLiveAudio ? images.ic_live_video_on : images.ic_live_video_off;
      const imageBolt = player.streamLiveAudio ? images.ic_hash : images.ic_hash;
      const imageDisco = isDisco ? images.ic_live_audio_on : images.ic_live_audio_off;
      const szIcon = sizes.em(26);

      return (
        <AnimView style={[styles.view_ctrl_lg, height, opacity]} >
          <View />
          <Button lock style={bs.p_1x} onPress={this.onPressLiveAudio} >
            {/*<Image contain width={szIcon} height={szIcon} tint={clrBolt} source={imageBolt} />*/}
            <Text bold size={sizes.em(szIcon)} color={clrBolt}>#</Text>
          </Button>
          <Button lock style={bs.p_1x} onPress={this.onPressDisco} >
            <Image contain width={szIcon} height={szIcon} source={imageDisco} />
          </Button>
          <Button lock style={bs.p_1x} onPress={this.onPressPrev} >
            <Image contain width={szIcon} height={szIcon} tint={colors.text} source={images.ic_player_backward} />
          </Button>
          { gs.player.loading
            ? (
              <View style={[bs.center, { width: sizes.em(46) + sizes.pad1 * 2 }]} >
                <Image contain width={sizes.em(76)} height={sizes.em(76)} source={images.ic_spinner} />
              </View>
            ) : (
              <Button lock style={bs.p_1x} onPress={this.onPressPlay} >
                <Image contain width={sizes.em(36)} height={sizes.em(36)} tint={colors.text} source={imagePlay} />
              </Button>
            )
          }
          <Button lock style={bs.p_1x} onPress={this.onPressNext} >
            <Image contain width={szIcon} height={szIcon} tint={colors.text} source={images.ic_player_forward} />
          </Button>
          <Button lock style={bs.p_1x} onPress={this.onPressFuego} >
            <Image contain width={szIcon} height={szIcon} tint={clrFuego} source={images.ic_fuego} />
          </Button>
          <Button lock style={bs.p_1x} onPress={this.onPressAdd} >
            <Icon name="mt add" color={colors.text} size={28} />
          </Button>
          <View />
        </AnimView>
      );
    }
    _renderControlFull = () => {
      const portrait = sizes.window.width < sizes.window.height;
      const opacity = { opacity: this.state.animCtrlFullOpacity };
      const height = { height: sizes.player.controlHeight + sizes.pad1 * 2 };
      const padding = { paddingHorizontal: portrait ? 0 : sizes.safeb };
      const paddingTop = { paddingTop: portrait ? sizes.statusbar : 0 };

      return (
        <Animated.View
          style={[styles.view_ctrl_full, opacity, height, padding, paddingTop]}
          pointerEvents={this.state.showControl ? 'auto' : 'none'}
        >
          {/* this._renderTitle(false) */}
          { this._renderControlLarge(false) }
          { this._renderProgress(false, (node) => { gs.context.progress3 = node; }) }
        </Animated.View>
      );
    }

    _renderProgress = (anim, ref) => {
      const AnimView = anim ? Animated.View : View;
      const animBottom = !anim ? sizes.pad : this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [sizes.pad, sizes.pad, sizes.pad, 0],
      });
      const bottom = { marginBottom: animBottom };

      return (
        <AnimView style={[bs.self_stretch, bottom]} >
          <TimeProgress
            onSlidingStart={this.onSlidingStart}
            onSlidingChange={this.onSlidingChange}
            onSlidingComplete={this.onSlidingComplete}
            maxTrackColor={colors.player.prog_track_max}
            minTrackColor={colors.player.prog_track_min}
            timeColor={colors.text_light}
            ref={ref}
          />
        </AnimView>
      );
    }

    _renderPlayer = () => {
      const { player } = gs;
      const { song } = player;
      const { viewType, animView, animFull } = this.props;

      const isInvalid = song.isApple || song.isSpotify
        ? !song.authorized : g.isEmpty(song.url);
      const isLive = !isInvalid && song.isLive;
      const isFullscreen = song.isVideo && player.fullscreen;

      const thumbTop = sizes.player.titleHeight + sizes.player.controlHeight;
      const thumbWidth = sizes.window.width;
      const thumbWidthsm = sizes.songlist.thumbSize;
      const thumbHeight = sizes.player.thumbHeight();
      const curTop = viewType === ViewType.player ? thumbTop : 0;
      const curWidth = viewType === ViewType.player ? thumbWidth : thumbWidthsm;
      const curHeight = viewType === ViewType.player ? thumbHeight : thumbWidthsm;
      const thumbImage = song.thumbImage ? { uri: song.thumbImage } : images.img_def_song_thumb;
      const animTop = (isFullscreen || player.fullani) ? animFull.interpolate({
        inputRange: [0, 1], outputRange: [curTop, 0],
      }) : animView.interpolate({
        inputRange: [0, 1, 2, 3], outputRange: [thumbTop, thumbTop, thumbTop, 0],
      });
      const animWidth = (isFullscreen || player.fullani) ? animFull.interpolate({
        inputRange: [0, 1], outputRange: [curWidth, thumbWidth],
      }) : animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [thumbWidth, thumbWidth, thumbWidth, thumbWidthsm],
      });
      const animHeight = (isFullscreen || player.fullani) ? animFull.interpolate({
        inputRange: [0, 1],
        outputRange: [curHeight, sizes.window.height],
      }) : animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [thumbHeight, thumbHeight, thumbHeight, thumbWidthsm],
      });
      const width = { width: animWidth };
      const height = { height: animHeight };
      const top = { top: animTop };

      const playerStyle = song.isVideo ? styles.video_player : styles.audio_player;
      const styleWrapper = [styles.view_player, width, height, top];
      const stylePlayer = isFullscreen && !player.fullani ? styles.full_player : styleWrapper;
      let viewPlayer = null;
      let viewButton = null;

      if (!isLive && gs.context.streamPlayer) {
        gs.context.streamPlayer.stop();
        gs.context.streamPlayer = null;
      }

      if (!isInvalid) {
        if (song.isApple) {
          viewPlayer = (
            <ApplePlayer
              ref={(node) => { gs.context.videoPlayer = node; }}
              key={`video_player_${song._id}`}
              storeId={song.appleStoreId}
              style={playerStyle}
              paused={!player.playing || player.loading}
              onLoad={this._onMediaLoad}
              onProgress={this._onMediaProgress}
              onEnd={this._onMediaEnd}
            />
          );
        } else if (song.isSpotify) {
          viewPlayer = (
            <SpotifyPlayer
              ref={(node) => { gs.context.videoPlayer = node; }}
              key={`video_player_${song._id}`}
              playableUri={song.spotifyPlayableUri}
              style={playerStyle}
              paused={!player.playing || player.loading}
              onLoad={this._onMediaLoad}
              onProgress={this._onMediaProgress}
              onEnd={this._onMediaEnd}
            />
          );
        } else if (isLive && song.isAudio) {
          viewPlayer = (
            <AudioStream
              ref={(node) => { gs.context.streamPlayer = node; }}
              key={`audio_stream_${song._id}`}
              url={song.url}
              onStreamPlay={this._onStreamPlay}
              onStreamPause={this._onStreamPause}
              onStreamEvent={this._onStreamEvent}
            />
          );
        } else {
          viewPlayer = (
            <Video
              playInBackground
              ref={(node) => { gs.context.videoPlayer = node; }}
              key={`video_player_${song._id}`}
              source={{ uri: song.url }}
              resizeMode="contain"
              muted={false}
              repeat={false}
              style={playerStyle}
              paused={!player.playing || player.loading}
              onLoad={this._onMediaLoad}
              onProgress={this._onMediaProgress}
              onEnd={this._onMediaEnd}
            />
          );
        }
        if (song.isVideo) {
          const viewControlFull = !isFullscreen ? null : this._renderControlFull();
          viewButton = (
            <Button
              activeOpacity={1.0}
              onPress={this._onMediaShowControl}
              onDoublePress={this._onPressFullscreen}
              style={styles.video_player}
            >
              { viewControlFull }
            </Button>
          );
        }
      }

      return (
        <Animated.View style={stylePlayer} >
          { !player.chilltv && (<Animated.Image key={`thumb_${song._id}`} source={thumbImage} style={[styles.img_thumb, width, height]} />) }
          { player.chilltv && (<Animated.Image key={`thumb_${song._id}`} source={images.ic_tv_loading} style={[styles.img_thumb, width, height]} />) }
          { viewPlayer }
          { viewButton }
        </Animated.View>
      );
    }
  };
}

export default renderMixin;
