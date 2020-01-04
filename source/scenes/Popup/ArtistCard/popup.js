import React from 'react';
import { View, WebView, findNodeHandle } from 'react-native';
import { Text, Button, Image, Border, TextInput, Icon, Picker2 } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { BlurView } from 'react-native-blur';
import PopupDialog from 'react-native-popup-dialog';
import ImagePicker from 'react-native-image-crop-picker';
import Swiper from 'react-native-swiper';
import { shallowEqual, handler } from '@redux';
import { bs, sizes } from '@theme';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import _ from 'lodash';
import apis from '@lib/apis';
import styles from './styles';

const { hud, drop } = handler.alert;

export default class Popup extends React.Component {
  state = {
    isModalVisible: false,
    isRender: false,
    artistIndex: 0,
    tabIndex: 1,
    isHashtag: false,
    isCamera: false,
    canGoBack: false,
    canGoForward: false,
    webviewUrl: null,
    username: '',
    isFollowed: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  get artist() {
    console.log(this._song.artistInfos, 'this._song.artistInfos')
    if (!this._song.artistInfos) return null;
    return this._song.artistInfos[this.state.artistIndex];
  }

  _song = null;
  show = async (song, ref) => {
    this._song = song;

    if (g.isEmpty(this._song.artistInfos)) {
      this._song.artistInfos = await this._requestArtists();
      if (g.isEmpty(this._song.artistInfos)) return;
    }

    gs.panMovable = false;
    gs.requestSongIn(song, false);
    this.setState({
      isModalVisible: true,
      isRender: true,
      artistIndex: 0,
      tabIndex: 1,
      viewRef: findNodeHandle(ref),
    }, () => {
      this.popup.show();
      this._requestFollowers();
    });
  }
  dismiss() {
    this.popup.dismiss();
  }

  /**
   * action handlers
   */
  _onDismissed = () => {
    gs.panMovable = true;
    this.setState({
      isRender: false,
    });
  }

  _onPressFeed = () => {
    if (this.state.tabIndex === 0) {
      if (this.state.isHashtag) {
        this.setState({ tabIndex: 1 });
      } else {
        this.setState({ isHashtag: true });
      }
    } else {
      const username = g.deepValue(this.artist, 'twitterUsername', '');
      this.setState({
        tabIndex: 0, isHashtag: false,
        canGoBack: true, canGoForward: true,
        webviewUrl: `https://twitter.com/${username}`,
        username,
      });
    }
  }
  _onPressStats = async () => {
    hud.show();
    try {
      if (this.state.isFollowed) {
        await apis.unfollowArtist(this.artist._id);
      } else {
        await apis.followArtist(this.artist._id);
      }
      this.setState({ isFollowed: !this.state.isFollowed });
    } catch (ex) {
      console.log('SongCardPopup::_onArtistFollow failed: ', ex);
      drop.showError(c.appName, 'Failed to follow/unfollow artist');
    }
    hud.hide();
  }
  _onPressCamera = () => {
    if (this.state.tabIndex === 2) {
      this.setState({ tabIndex: 1 });
      const buttons = ['Take New Photo', 'Photo Library'];
      this._picker.open(null, buttons, 'Cancel', async (item, index) => {
        const options = {
          mediaType: 'photo',
        };

        try {
          let picked = null;
          if (index === 1) {
            picked = await ImagePicker.openPicker(options);
          } else if (index === 0) {
            picked = await ImagePicker.openCamera(options);
          }
          if (picked) {
            hud.show();
            try {
              if (picked) {
                // this.setState({ avatarTaken: picked.path });
                const url = await apis.uploadArtistImage(this.artist._id, picked.path);
                await apis.addImageToArtist(this.artist._id, url);
                g.deepValue(this.artist, 'images', []).push(url);
                this.forceUpdate();
              }
            } catch (e1) {
              console.log('ArtistCardPopup::_onPressCamera failed: ', e1);
              drop.showError(c.appName, 'Failed to add image to song');
            }
            hud.hide();
          }
        } catch (e) {
          console.log('ArtistCardPopup::_onPressCamera failed: ', e);
        }
      });
      return;
    }

    const username = g.deepValue(this.artist, 'instagramUsername');
    this.setState({
      tabIndex: 2,
      canGoBack: true, canGoForward: true,
      webviewUrl: `https://www.instagram.com/${username}`,
      username,
    });
  }

  _onPressPrevArtist = () => {
    if (this.state.artistIndex <= 0) return;
    this.setState({ artistIndex: this.state.artistIndex - 1 });
  }
  _onPressNextArtist = () => {
    if (this.state.artistIndex >= this._song.artistInfos.length - 1) return;
    this.setState({ artistIndex: this.state.artistIndex + 1 });
  }

  _onPressGoBack = () => {
    this._webView && this._webView.goBack();
  }
  _onPressGoForward = () => {
    this._webView && this._webView.goForward();
  }
  _onNavigationStateChange = () => {
  }
  _onPressWebviewClose = () => {
    this.setState({
      tabIndex: 1,
    });
  }

  /**
   * api requests
   */
  _requestArtists = async () => {
    let artistInfos = [];
    hud.show();
    try {
      const artistNames = this._song.artistNames;
      if (artistNames.length) {
        const res = await apis.findArtist(artistNames);
        artistInfos = artistInfos.concat(res);
      }
    } catch (ex) {
      console.log('ArtistCardPopup::_requestArtist failed: ', ex);
    }
    try {
      const artistIds = (this._song.artists || []).map(el => el._id).filter(el => !g.isEmpty(el));
      if (artistIds.length) {
        const res = await apis.getArtist(artistIds);
        artistInfos = artistInfos.concat(res);
      }
    } catch (ex) {
      console.log('ArtistCardPopup::_requestArtist failed: ', ex);
    }
    hud.hide();

    artistInfos = artistInfos.filter((el, i) => artistInfos.findIndex(el1 => el1._id === el._id) === i);
    if (!artistInfos.length) {
      drop.showError(c.appName, 'Failed to retrieve artist info.');
    }
    return artistInfos;
  }
  _requestFollowers = async () => {
    try {
      const followers = await apis.getArtistFollowers(this.artist._id);
      const followerIndex = _.findIndex(followers, l => l.userId === gs.user.userId);
      this.setState({ isFollowed: followerIndex >= 0 });
    } catch (ex) {
      ex;
    }
  }

  /**
   * render functions
   */
  render() {
    return (
      <PopupDialog
        ref={(node) => { this.popup = node; }}
        width={sizes.window.width} height={sizes.window.height}
        dialogStyle={styles.dialog} onDismissed={this._onDismissed}
        overlayOpacity={0} overlayBackgroundColor="#fff"
      >
        { this.state.isRender && this._renderBackdrop(View, null, [bs.absolute_full]) }
        { this.state.isRender && this._renderContent() }
        { this.state.isRender && this._renderPicker() }
      </PopupDialog>
    );
  }

  _renderBackdrop = (Comp, ref, style, useNativeDriver) => (
    <Comp ref={ref} style={[style, bs.bg_transparent]} useNativeDriver={useNativeDriver} >
      <BlurView style={bs.absolute_full} blurType="dark" blurAmount={6} viewRef={this.state.viewRef} />
      <View style={[bs.absolute_full, bs.f_bg('rgba(0,0,0,0.4)')]} />
    </Comp>
  )

  _renderContent = () => {
    const topHeight = sizes.header.height1 + sizes.profile.titleHeight;
    const thumbHeight = sizes.profile.thumbHeight();
    const thumbImages = g.deepValue(this.artist, 'images', []);console.log(thumbImages);
    const renderImages = _.map(thumbImages, (url, idx) => {
      if(!url) url = 'https://chilll-media.s3-us-west-2.amazonaws.com/default-artist-img.jpg'
      return (
        <Image key={`gallery_photo_${idx}`} cover width={sizes.window.width} height={thumbHeight} source={url} />
      )
    });
    const artist = g.deepValue(this.artist, 'name', '');
    const title = (this._song && this._song.title1) || '';

    const canNext = this.state.artistIndex < this._song.artistInfos.length - 1;
    const canPrev = this.state.artistIndex > 0;
    const prevEnable = canPrev ? 'auto' : 'none';
    const nextEnable = canNext ? 'auto' : 'none';
    const prevStyle = { opacity: (canPrev ? 1 : 0) };
    const nextStyle = { opacity: (canNext ? 1 : 0) };

    return (
      <View style={styles.container} >
        <View style={[bs.self_stretch, bs.end_center, bs.f_height(topHeight), bs.p_status]} >
          <View style={[bs.flex_row, bs.self_stretch, bs.between_center, bs.pv_2x]} >
            <View style={prevStyle} pointerEvents={prevEnable} >
              <Button bnowide bstyle={bs.ph_2x} onPress={this._onPressPrevArtist} >
                <Icon name="sl arrow-left" size={24} color="#eee" />
              </Button>
            </View>

            <Text color="#fff" size={20} numberOfLines={1} >{artist}</Text>

            <View style={nextStyle} pointerEvents={nextEnable} >
              <Button bnowide bstyle={bs.ph_2x} onPress={this._onPressNextArtist} >
                <Icon name="sl arrow-right" size={24} color="#eee" />
              </Button>
            </View>
          </View>

          <View style={[bs.self_stretch, bs.flex_row, bs.around_end]} >
            <Button
              bnowide bunderline={this.state.tabIndex === 0 ? '#fff' : '#0000'}
              bborderWidth={sizes.em(4)} bstyle={[bs.self_end, bs.p_2x, bs.pb_1x]} onPress={this._onPressFeed}
            >
              <Text semibold size={28} color="#fff" >#</Text>
            </Button>
            <Button
              bnowide bunderline={this.state.tabIndex === 1 ? 'blue' : '#fff'}
              bborderWidth={sizes.em(4)} bstyle={[bs.self_end, bs.pv_3x, bs.ph_1x]} onPress={this._onPressStats}
            >
              <Icon name="fa diamond" color={this.state.isFollowed ? 'blue' : '#fff'} size={24} />
            </Button>
            <Button
              bnowide bunderline={this.state.tabIndex === 2 ? '#fff' : '#0000'}
              bborderWidth={sizes.em(4)} bstyle={[bs.self_end, bs.pv_2x, bs.ph_1x]} onPress={this._onPressCamera}
            >
              {/*<Icon name="fa camera" color="#fff" size={24} />*/}
              <FIcon name="camera" color="#fff" size={24} />
            </Button>
          </View>
        </View>

        <View style={bs.match_parent} >
          <Swiper
            ref={(node) => { this._gallery = node; }} onIndexChanged={this._onChangePage} loop={false}
            horizontal width={sizes.window.width} height={thumbHeight} showButtons={false} activeDotColor="#FFDE00" dotColor="#DBDBDB"
            paginationStyle={[bs.f_top(thumbHeight + sizes.em(10)), bs.f_bottom(null)]}
          >
            { renderImages }
          </Swiper>
          <View style={[bs.absolute_top, bs.center, bs.f_top(thumbHeight - sizes.em(20))]} >
            <Text color="#fff" size={12} numberOfLines={1}>{title}</Text>
          </View>
          { this._renderStats() }
          { this._renderHashtag() }
          { this._renderWebview() }
        </View>

        <View style={[bs.absolute_top, bs.f_top(sizes.statusbar), bs.center]} >
          <Button style={[bs.ph_2x, bs.pv_1x]} onPress={this.dismiss.bind(this)} >
            <Icon name="mt close" size={30} color="#fff" />
          </Button>
        </View>
      </View>
    );
  }

  _renderStats = () => {
    if (this.state.tabIndex !== 1) return null;
    if (!this.artist) return null;

    return (
      <View style={bs.absolute_full} pointerEvents="box-none" >
        <View style={[bs.self_stretch, bs.flex_row, bs.around_center, bs.mt_2x]} >
          <View style={[bs.flex_row]} >
            <Icon name="et note" color="#fff" size={20} />
            <Text color="#fff" size={16} style={bs.ml_1x} >{g.formatNumber(this.artist.numSongs || 0, '0 a')}</Text>
          </View>
          <View style={[bs.flex_row]} >
            <Icon name="fa picture-o" color="#fff" size={20} />
            <Text color="#fff" size={16} style={bs.ml_1x} >{g.formatNumber(this.artist.numImages || 0, '0 a')}</Text>
          </View>
          <View style={[bs.flex_row]} >
            {/*<Icon name="fa plane" color="#fff" size={20} />*/}
            <FIcon name="send" color="#fff" size={20} />
            <Text color="#fff" size={16} style={bs.ml_1x} >{g.formatNumber(this.artist.numPlays || 0, '0 a')}</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderHashtag = () => {
    if (this.state.tabIndex !== 0 || !this.state.isHashtag) return null;
    return (
      <View style={[bs.absolute_full, bs.start_center]} >
        <View style={[bs.flex_row, bs.self_stretch, bs.mh_3x, bs.mt_2x]} >
          <TextInput
            border binrow bheight={sizes.em(40)} bbackground="#fff" bradius={sizes.em(5)} bstyle={[bs.ph_2x]}
            color="#000" size={15} placeholder="ADD #HASHTAGS" placeholderTextColor="#888"
            value={this.state.comment} onChangeText={comment => this.setState({ comment })}
          />
          <Button
            bnowide binrow bheight={sizes.em(40)} bbackground="#fff" bradius={sizes.em(5)} bstyle={[bs.center, bs.ph_2x, bs.ml_1x]}
            onPress={this._onPressSendComment}
          >
            <Text size={15} color="#4A90E2" >ADD</Text>
          </Button>
        </View>
      </View>
    );
  }
  _renderWebview = () => {
    if (this.state.tabIndex !== 2 && (this.state.tabIndex !== 0 || this.state.isHashtag)) {
      return null;
    }

    return (
      <View style={styles.webview} >
        <View style={[bs.self_stretch, bs.f_height(sizes.em(40)), bs.between_center, bs.flex_row, bs.pl_4x, bs.pr_3x]} >
          <Text size={14} color="#555" >{g.isEmpty(this.state.username) ? '' : '@'}{this.state.username}</Text>
          <Button bstyle={bs.ph_1x} onPress={this._onPressWebviewClose} >
            <Icon name="mt close" size={24} color="#555" />
          </Button>
        </View>

        <View style={[bs.match_parent]} >
          { !g.isEmpty(this.state.username) && (
            <WebView
              ref={(node) => { this._webView = node; }}
              scalesPageToFit style={[bs.match_parent]}
              source={{ uri: this.state.webviewUrl }}
              onNavigationStateChange={this._onNavigationStateChange}
            />
          )}
          { g.isEmpty(this.state.username) && (
            <Text semibold size={16} color="#555" style={[bs.self_center, bs.mt_6x]} >No user information</Text>
          )}
        </View>

        <Border btopline="#ddd" brow bstyle={[bs.start_center, bs.f_zindex(100)]} bheight={sizes.navbar} >
          <Button disabled={!this.state.canGoBack} onPress={this._onPressGoBack} style={[bs.ml_4x]} >
            <Icon name="io ios-arrow-back" size={36} color={this.state.canGoBack ? '#000' : '#888'} />
          </Button>
          <Button disabled={!this.state.canGoForward} onPress={this._onPressGoForward} style={[bs.ml_4x]} >
            <Icon name="io ios-arrow-forward" size={36} color={this.state.canGoForward ? '#000' : '#888'} />
          </Button>
        </Border>
      </View>
    );
  }
  _renderPicker = () => (
    <Picker2 ref={(node) => { this._picker = node; }} />
  )
}
