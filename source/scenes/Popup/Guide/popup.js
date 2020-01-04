import React from 'react';
import { SafeAreaView, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { Text, Button, Image, Icon } from '@components/controls';
import PopupDialog from 'react-native-popup-dialog';
import { shallowEqual } from '@redux';
import gs from '@common/states';
import { bs, sizes, images } from '@theme';
import styles from './styles';


export default class Popup extends React.Component {
  state = {
    isRender: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  _callback = null;
  show(cb) {
    gs.panMovable = false;
    this._callback = cb;
    this.popup.show();
    this.setState({ isRender: true });
  }
  dismiss() {
    this.popup.dismiss();
  }

  _onDismissed = () => {
    gs.panMovable = true;
    this._callback && this._callback();
    this.setState({ isRender: false });
  }
  _onPressEnter = () => {
    this.dismiss();
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
        overlayOpacity={0.8}
      >
        <SafeAreaView style={[bs.match_parent, bs.bg_transparent, bs.hidden]} >
          { this.state.isRender && this._renderContent() }
        </SafeAreaView>
      </PopupDialog>
    );
  }

  _renderContent = () => {
    const thumbImages = [
      images.bg_tutorial1, images.bg_tutorial2, images.bg_tutorial3, images.bg_tutorial4, images.bg_tutorial5,
      images.bg_tutorial1, images.bg_tutorial2,
    ];
    const thumbTitles = [
      'DISCOVER SONGS', 'RECORD LIVE VIDEOS', 'SHARE AUDIO STREAMZ', 'FIND NEW ARTISTS', 'BREAK HOT TRACKS',
      'IMPORT PLAYLISTS', 'CREATE #TAGS',
    ];
    const thumbDescs = [
      'Test Description1', 'Test Description2', 'Test Description3', 'Test Description4', 'Test Description5',
      'Test Description6', 'Test Description7',
    ];
    const renderThumb = (image, title, desc) => (
      <View style={[bs.match_parent, bs.start_center]} >
        <Image
          cover source={image} width={sizes.window.width * 0.4} height={sizes.window.width * 0.4}
          style={bs.f_mt(sizes.window.height * 0.2)}
        />
        <Text medium color="#fff" size={20} style={bs.mt_8x} >{title}</Text>
        <Text color="#ddd" size={14} style={bs.mt_2x} >{desc}</Text>
      </View>
    );

    return (
      <View style={styles.container} activeOpacity={1} >
        {/* <Text style={[bs.font_stink, bs.mt_8x]} color="#fff" size={60} >Chilll Music</Text>
        <View style={[bs.flex, bs.center_start, bs.ph_4x]} >
          <View style={[bs.center, bs.flex_row]} >
            <Image contain width={sizes.em(32)} height={sizes.em(32)} source={images.ic_live_audio_on} />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >DISCOVER SONGS</Text>
          </View>
          <View style={[bs.center, bs.flex_row, bs.mt_3x]} >
            <Icon name="fa video-camera" size={32} color="#fff" />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >RECORD LIVE VIDEOS</Text>
          </View>
          <View style={[bs.center, bs.flex_row, bs.mt_3x]} >
            <Image contain width={sizes.em(32)} height={sizes.em(32)} source={images.ic_live_video_on} />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >SHARE AUDIO STREAMZ</Text>
          </View>
          <View style={[bs.center, bs.flex_row, bs.mt_3x]} >
            <Icon name="fa diamond" color="#fff" size={28} />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >FIND NEW ARTISTS</Text>
          </View>
          <View style={[bs.center, bs.flex_row, bs.mt_3x]} >
            <Image contain width={sizes.em(32)} height={sizes.em(32)} source={images.ic_fuego} />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >BREAK HOT TRACKS</Text>
          </View>
          <View style={[bs.center, bs.flex_row, bs.mt_3x]} >
            <Icon name="fa headphones" size={32} color="#fff" />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >IMPORT PLAYLISTS</Text>
          </View>
          <View style={[bs.center, bs.flex_row, bs.mt_3x]} >
            <Icon name="mt add" color="#fff" size={32} />
            <Text medium color="#fff" size={20} style={bs.ml_4x} >CREATE #TAGS</Text>
          </View>
        </View>
        */}
        <Swiper
          ref={(node) => { this._gallery = node; }} onIndexChanged={this._onChangePage} loop={false}
          horizontal width={sizes.window.width} height={sizes.window.height - sizes.em(80)} showButtons={false} activeDotColor="#FFDE00" dotColor="#DBDBDB"
          paginationStyle={[bs.f_bottom(sizes.em(15))]}
        >
          { renderThumb(thumbImages[0], thumbTitles[0], thumbDescs[0]) }
          { renderThumb(thumbImages[1], thumbTitles[1], thumbDescs[1]) }
          { renderThumb(thumbImages[2], thumbTitles[2], thumbDescs[2]) }
          { renderThumb(thumbImages[3], thumbTitles[3], thumbDescs[3]) }
          { renderThumb(thumbImages[4], thumbTitles[4], thumbDescs[4]) }
          { renderThumb(thumbImages[5], thumbTitles[5], thumbDescs[5]) }
          { renderThumb(thumbImages[6], thumbTitles[6], thumbDescs[6]) }
        </Swiper>

        <Button
          bbackground="#7ED321" bradius={sizes.pad1} bheight={sizes.em(50)} bstyle={[bs.mh_4x, bs.mb_3x]}
          onPress={this._onPressEnter}
        >
          <Text center transparent color="#fff" size={17} medium >ENJOY!</Text>
        </Button>
      </View>
    );
  }
}
