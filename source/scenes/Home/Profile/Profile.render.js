import React from 'react';
import {Animated, View} from 'react-native';
import {Button, Icon, Image, Text} from '@components/controls';
import TimeProgress from '@components/timeprogress';
import FIcon from 'react-native-vector-icons/Feather'
import {bs, colors, images, sizes} from '@theme';
import gs from '@common/states';
import styles from './Profile.styles';
import GestureRecognizer from 'react-native-swipe-gestures'
import g from "../../../common/global";

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      const thumbHeight = sizes.profile.thumbHeight();
      const height = sizes.profile.height();
      const maxTrans = sizes.profile.titleHeight + thumbHeight * 0.2;
      const animTrans = this.props.animView.interpolate({
        inputRange: [-1, 0, 1, 2, 10],
        outputRange: [height, height, 0, -maxTrans, -maxTrans],
      });
      const transY = { transform: [{ translateY: animTrans }] };
      const stheight = { height };

      return (
        <Animated.View style={[styles.container, transY, stheight]} >
          { this._renderContent() }
        </Animated.View>
      );
    }

    _renderContent = () => {
      const { player } = gs;
      if (!player.song) {
        const szLoading = sizes.profile.thumbHeight();
        return (
          <View style={[styles.content, bs.center]} >
            {/* <ActivityIndicator animating color="#000" size="large" /> */}
            <Image contain width={sizes.window.width} height={szLoading} source={images.ic_app_loading} />
          </View>
        );
      }

      const animOpacity = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 10],
        outputRange: [1, 1, 0, 0],
      });
      const opacity = { opacity: animOpacity };
      return (
        <Animated.View style={[styles.content, opacity]} >
          { this._renderTitle() }
          { this._renderProfile() }
          { this._renderProgress() }
          { this._renderMenu() }
        </Animated.View>
      );
    }

    _renderTitle = () => {
      const { player, songData } = gs;
      const canNext = songData.songs.length > 0 && player.index < songData.songs.length - 1;
      const canPrev = songData.songs.length > 0 && player.index > 0;
      const prevEnable = canPrev ? 'auto' : 'none';
      const nextEnable = canNext ? 'auto' : 'none';
      const prevStyle = { opacity: (canPrev ? 1 : 0) };
      const nextStyle = { opacity: (canNext ? 1 : 0) };
      const title = (player.song && player.song.title) || '';
      const artist = (player.song && player.song.artist) || '';

      return (
        <View style={styles.bar_title} {...this.props.pan.panHandlers}>
          <View style={prevStyle} pointerEvents={prevEnable} >
            <Button lock onPress={this._onPressPrev} style={styles.btn_change_song} >
              {/*<Icon name="sl arrow-left" size={24} color="#222" />*/}
              <FIcon name="chevron-left" size={24} color="#222" />
            </Button>
          </View>

          <Button onDoublePress={this._onPressMenu} style={styles.view_title} hitSlop={{top: 20, bottom: 20, right: 50, left: 50}} >
            <Button onPress={this._onPressArtist} style={bs.center} >
              <Text bold color="#4990E2" size={20} numberOfLines={1} >{artist}</Text>
            </Button>
            <Text center color={colors.text_alt_light} size={14} numberOfLines={2}>{title}</Text>
          </Button>

          <View style={nextStyle} pointerEvents={nextEnable} >
            <Button lock onPress={this._onPressNext} style={styles.btn_change_song} >
              {/*<Icon name="sl arrow-right" size={24} color="#222" />*/}
              <FIcon name="chevron-right" size={24} color="#222" />
            </Button>
          </View>
        </View>
      );
    }

    _renderProfile = () => {
      const { player } = gs;
      const thumbImage = player.song && player.song.thumbImage ? { uri: player.song.thumbImage } : images.img_def_song_thumb;

      const playImage = player.playing && !player.loading ? images.ic_profile_pause : images.ic_profile_play;
      const tintColor = player.playing && !player.loading ? '#FFF' : null;
      const opacity = { opacity: player.playing && !player.loading ? 1 : 0.6 };
      const thumbHeight = sizes.profile.thumbHeight();

      return (
        <GestureRecognizer style={styles.view_thumb} onSwipeUp={this._onSwipeUp} onSwipeDown={this._onSwipeDown}>
          <View style={styles.view_play}>
            <Image width={sizes.window.width} height={thumbHeight} source={this.state.previousSongThumbnail ? this.state.previousSongThumbnail : thumbImage} resizeMode={this.state.thumb}/>
          </View>
          <Animated.View style={{opacity: this.state.thumbFadeAnim, ...styles.view_play}} >
            <Button activeOpacity={1.0} onDoublePress={this._onChangeProfileZoom} style={styles.view_play} >
              <Image width={sizes.window.width} height={thumbHeight} source={thumbImage} resizeMode={this.state.thumb} />
              <View style={styles.view_play} >
                <Button style={bs.center} onPress={this._onPressPlay} >
                  <Image width={sizes.em(64)} height={sizes.em(64)} tint={tintColor} source={playImage} style={opacity} />
                </Button>
              </View>
            </Button>
          </Animated.View>
        </GestureRecognizer>
      );
    }

    _renderProgress = () => (
      <View style={styles.view_progress} >
        <TimeProgress
          onSlidingStart={this._onSlidingStart}
          onSlidingChange={this._onSlidingChange}
          onSlidingComplete={this._onSlidingComplete}
          maxTrackColor={colors.player.prog_track_max}
          minTrackColor={colors.player.prog_track_min}
          timeColor={colors.text_alt}
          timeTop
          ref={(node) => { gs.context.progress1 = node; }}
        />
      </View>
    )

    _renderMenu = () => {
      const tintColor = '#000000';
      return (
        <View style={styles.view_menu} pointerEvents="box-none" {...this.props.pan.panHandlers}>
          <Button onPress={this._onPressMenu} style={styles.button} >
            <Image contain tint={tintColor} width={sizes.em(18)} height={sizes.em(18)} source={images.ic_menu} />
          </Button>
        </View>
      );
    };
  };
}

export default renderMixin;
