import React from 'react';
import { View } from 'react-native';
import { Text, Button, Image, Icon } from '@components/controls';
import PopupDialog from 'react-native-popup-dialog';
import { handler, shallowEqual } from '@redux';
import gs from '@common/states';
import _ from 'lodash';
import { routes } from '@routes';
import { bs, sizes, images } from '@theme';
import styles from './styles';

const { navigation } = handler;

export default class Popup extends React.Component {
  state = {
    isRender: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  _song = null;
  show(song) {
    gs.panMovable = false;
    this._song = song;
    this.popup.show();
    gs.requestSongIn(song, false);
    this.setState({
      isRender: true,
    });
  }
  dismiss() {
    this.popup.dismiss();
  }

  _onDismissed = () => {
    gs.panMovable = true;
    this.setState({
      isRender: false,
    });
  }

  _onPressAdd = () => {
    this.popup.dismiss();
    gs.context.addPopup && gs.context.addPopup.show(this._song);
  }
  _onPressDisco = () => {
    this.popup.dismiss();
    gs.addRemoveSongOnDisco(this._song);
  }
  _onPressFuego = () => {
    this.popup.dismiss();
    gs.addRemoveSongOnFuego(this._song);
  }
  _onPressSend = () => {
    this.popup.dismiss();
    gs.context.song = this._song;
    navigation.navigate({ name: routes.names.app.chatUsers, animation: 'horzinv' });
  }
  _onPressPlay = () => {
    this.popup.dismiss();
    gs.loadSong(this._song);
    navigation.navigate({ type: 'popTo', key: routes.keys.app.home });
  }

  render() {
    const width = sizes.is_phone ? sizes.window.width : 600;

    return (
      <PopupDialog
        width={width}
        height={null}
        ref={(node) => { this.popup = node; }}
        dialogStyle={styles.dialog}
        onDismissed={this._onDismissed}
      >
        { this.state.isRender && this._renderContent() }
      </PopupDialog>
    );
  }

  _renderContent = () => {
    const width = sizes.is_phone ? sizes.window.width : 600;
    const thumbImage = this._song && this._song.thumbImage ? { uri: this._song.thumbImage } : images.img_def_song_thumb;
    const szIcon = sizes.em(28);

    const artist = (this._song && this._song.artist) || '';
    const title = (this._song && this._song.title1) || '';
    const isFuego = this._song && this._song.isFuegoPlaylist;
    const isDisco = this._song && this._song.isDiscoPlaylist;
    const clrFuego = isFuego ? null : '#FFF';
    const imageDisco = isDisco ? images.ic_live_audio_on : images.ic_live_audio_off;
    const imageHash = images.ic_hash;

    return (
      <View style={styles.container} >
        <Text transparent center color="#fff" size={17} style={[bs.mv_1x, bs.mh_2x]} numberOfLines={1} >{`${artist} - ${title}`}</Text>      
        <Image contain width={width} height={width} source={thumbImage} />
        <View style={styles.view_buttons} >
          <Button style={styles.button} onPress={this._onPressSend}>
            {/*<Image contain width={szIcon} height={szIcon} source={imageHash} />*/}
            <Text bold size={sizes.em(szIcon)}>#</Text>
          </Button>
          <Button style={styles.button} onPress={this._onPressDisco}>
            <Image contain width={szIcon} height={szIcon} source={imageDisco} />
          </Button>
          <Button style={styles.button} onPress={this._onPressPlay}>
            <Icon name="sl control-play" size={32} color="#fff" />
          </Button>
          <Button style={styles.button} onPress={this._onPressFuego}>
            <Image contain width={szIcon} height={szIcon} tint={clrFuego} source={images.ic_fuego} />
          </Button>
          <Button style={styles.button} onPress={this._onPressAdd}>
            <Icon name="mc plus" size={36} color="#fff" />
          </Button>
        </View>
      </View>
    );
  }
}
