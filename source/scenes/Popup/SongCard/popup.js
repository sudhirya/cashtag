import React from 'react';
import { View, findNodeHandle, FlatList } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Text, Button, Image, TextInput, Icon, Picker2, Border } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { BlurView } from 'react-native-blur';
// import Modal from '@components/modal';
import PopupDialog from 'react-native-popup-dialog';
import Swiper from 'react-native-swiper';
import { shallowEqual, handler } from '@redux';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import _ from 'lodash';
import apis from '@lib/apis';
import moment from 'moment';
import { bs, sizes, images } from '@theme';
import styles from './styles';

const { hud, drop } = handler.alert;

export default class Popup extends React.Component {
  state = {
    isModalVisible: false,
    isRender: false,
    index: 0,
    comment: '',
    liked: false,

    tabIndex: 1,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  _song = null;
  show(song, ref) {
    gs.panMovable = false;
    this._song = song;
    gs.requestSongIn(song, false);
    this.setState({
      isModalVisible: true,
      isRender: true,
      index: 0,
      tabIndex: 1,
      viewRef: findNodeHandle(ref),
    }, () => {
      this.popup.show();
      this._requestLike();
      this._requestComments();
    });
  }
  dismiss() {
    this.setState({ isModalVisible: false });
    this.popup.dismiss();
  }

  _onDismissed = () => {
    gs.panMovable = true;
    this.setState({
      isRender: false,
    });
  }

  _onPressComment = async () => {
    if (this.state.tabIndex === 0) {
      this.setState({ tabIndex: -1 });
      return;
    }

    this.setState({ tabIndex: 0, comment: '' });
  }
  _onPressCamera = () => {
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

        hud.show('Requesting...');
        try {
          if (picked) {
            // this.setState({ avatarTaken: picked.path });
            const url = await apis.uploadSongImage(this._song._id, picked.path);
            await apis.addImageToSong(this._song._id, url);
            this._song.images.push(url);
            this.forceUpdate();
          }
        } catch (e1) {
          console.log('ArtistCardPopup::_onPressCamera failed: ', e1);
          drop.showError(c.appName, 'Failed to add image to song');
        }
        hud.hide();
      } catch (e) {
        console.log('ArtistCardPopup::_onPressCamera failed: ', e);
      }
    });
  }
  _onPressLike = async () => {
    hud.show();
    try {
      const index = this.state.index;
      const image = this._song.images[index];
      if (this.state.liked) {
        await apis.unlikePicture(image);
      } else {
        await apis.likePicture(image);
      }
      if (index === this.state.index) {
        this.setState({ liked: true });
      }
    } catch (ex) {
      console.log('SongCardPopup::_onPressLike failed: ', ex);
    }
    hud.hide();
  }
  _onChangePage = (index) => {
    if (!this.state.isRender) return;
    this.comments = [];
    this.setState({ index, liked: false }, () => {
      this._requestLike();
      this._requestComments();
    });
  }
  _onPressSendComment = async () => {
    if (g.isEmpty(this.state.comment)) {
      drop.showError(c.appName, 'Please enter comment');
      return;
    }

    hud.show();
    try {
      const index = this.state.index;
      const image = this._song.images[index];
      await apis.leavePictureComment(image, this.state.comment);
      if (index === this.state.index) {
        if (!this.comments) this.comments = [];
        this.comments.splice(0, 0, {
          createdAt: new Date(),
          comment: this.state.comment,
          user: gs.user,
          userId: gs.user.userId,
        });
        this.forceUpdate();
      }
    } catch (ex) {
      console.log('SongCardPopup::_onPressSendComment failed: ', ex);
      drop.showError(c.appName, 'Failed to enter comment');
    }
    hud.hide();
  }

  _onPressArtist = () => {
    if (!gs.player.song) return;
    this.dismiss();
    gs.handles.artistCardPopup && gs.handles.artistCardPopup.show(gs.player.song, gs.handles.mainView);
  }

  _requestLike = async () => {
    try {
      const index = this.state.index;
      const image = this._song.images[index];
      const likes = await apis.getPictureLikes(image);
      const liked = _.findIndex(likes, l => l.userId === gs.user.userId) >= 0;
      if (index === this.state.index) {
        this.setState({ liked });
      }
    } catch (ex) {
      console.log('SongCardPopup::_requestLike failed: ', ex);
    }
  }
  _requestComments = async () => {
    try {
      const index = this.state.index;
      const image = this._song.images[index];
      const comments = await apis.getPictureComments(image);
      if (index === this.state.index) {
        this.comments = comments;
        this.forceUpdate();
      }
    } catch (ex) {
      console.log('SongCardPopup::_requestComments failed: ', ex);
    }
  }

  render() {
    // return (
    //   <Modal
    //     ref={(node) => { this.popup = node; }} useNativeDriver={false}
    //     isVisible={this.state.isModalVisible} style={styles.dialog}
    //     animationIn="fadeIn" animationOut="fadeIn"
    //     onModalHide={this._onDismissed}
    //     renderBackdrop={this._renderBackdrop} viewRef={this.state.viewRef}
    //   >
    //     { this.state.isRender && this._renderContent() }
    //   </Modal>
    // );
    return (
      <PopupDialog
        ref={(node) => { this.popup = node; }}
        width={sizes.window.width} height={sizes.window.height}
        dialogStyle={styles.dialog} onDismissed={this._onDismissed}
        overlayOpacity={0} overlayBackgroundColor="#fff"
      >
        { this.state.isRender && this._renderBackdrop(View, null, [bs.absolute_full]) }
        { this.state.isRender && this._renderContent() }
        { this._renderPicker() }
      </PopupDialog>
    );
  }

  _renderBackdrop = (Comp, ref, style, useNativeDriver) => (
    <Comp ref={ref} style={[style, bs.bg_transparent]} useNativeDriver={useNativeDriver} >
      <BlurView style={bs.absolute_full} blurType="light" blurAmount={6} viewRef={this.state.viewRef} />
      <View style={[bs.absolute_full, bs.f_bg('rgba(255,255,255,0.4)')]} />
    </Comp>
  )

  _renderContent = () => {
    const topHeight = sizes.header.height1 + sizes.profile.titleHeight;
    const thumbHeight = sizes.profile.thumbHeight();
    // const thumbImage = this._song && this._song.thumbImage ? { uri: this._song.thumbImage } : images.img_def_song_thumb;
    const thumbImages = this._song.images; // [thumbImage, thumbImage, thumbImage];
    const renderImages = _.map(thumbImages, (url, idx) => (
      <Image key={`gallery_photo_${idx}`} cover width={sizes.window.width} height={thumbHeight} source={url} />
    ));
    const isFuego = this.state.liked;
    const clrFuego = isFuego ? null : '#000';
    const artist = (this._song && this._song.artist) || '';
    const title = (this._song && this._song.title) || '';

    return (
      <View style={styles.container} >
        <View style={[bs.self_stretch, bs.end_center, bs.f_height(topHeight), bs.pb_2x]} >
          <View style={[bs.match_parent, bs.center, bs.ph_2x, bs.m_status]} >
            <Button style={bs.mt_4x} onPress={this._onPressArtist} >
              <Text semibold color="#0000ff" size={20} numberOfLines={1} >{artist}</Text>
            </Button>
            <Text semibold center color="#000" size={16} numberOfLines={2} style={bs.mt_1x} >{title}</Text>
          </View>

          <View style={[bs.self_stretch, bs.flex_row, bs.around_end]} >
            <Button
              bnowide bunderline={this.state.tabIndex === 0 ? '#00f' : '#0000'}
              bborderWidth={sizes.em(4)} bstyle={[bs.self_end, bs.p_2x, bs.pb_1x]} onPress={this._onPressComment}
            >
              <Text semibold size={28} color={this.state.tabIndex === 0 ? '#00f' : '#000'} >#</Text>
            </Button>
            <Button
              bnowide bunderline={this.state.tabIndex === 1 ? '#00D86C' : '#0000'}
              bborderWidth={sizes.em(4)} bstyle={[bs.self_end, bs.pv_2x, bs.ph_1x]} onPress={this._onPressCamera}
            >
              {/*<Icon name="fa camera-retro" color={this.state.tabIndex === 1 ? '#00D86C' : '#000'} size={24} />*/}
              <FIcon name="camera" color={this.state.tabIndex === 1 ? '#00D86C' : '#000'} size={24} />
            </Button>
            <Button
              bnowide
              bborderWidth={sizes.em(4)} bstyle={[bs.self_end, bs.pv_2x, bs.ph_1x]} onPress={this._onPressLike}
            >
              <Image contain width={24} height={24} tint={clrFuego} source={images.ic_fuego} />
            </Button>
          </View>
        </View>

        <View style={bs.match_parent} >
          <Swiper
            ref={(node) => { this._gallery = node; }} onIndexChanged={this._onChangePage} loop={false}
            horizontal width={sizes.window.width} height={thumbHeight} showButtons={false} activeDotColor="#FFDE00" dotColor="#DBDBDB"
            paginationStyle={[bs.f_bottom(sizes.em(15))]}
          >
            { renderImages }
          </Swiper>
          { this._renderComments() }
        </View>

        <Button
          bnowide bbackground="#000" bradius={sizes.em(15)} bwidth={sizes.em(30)} bheight={sizes.em(30)}
          bstyle={[bs.mb_2x, bs.mt_1x]} onPress={this.dismiss.bind(this)}
        >
          <Icon name="mt close" size={24} color="#fff" />
        </Button>
      </View>
    );
  }

  _renderComments = () => {
    if (this.state.tabIndex !== 0) return null;

    return (
      <View style={[bs.absolute_full]} pointerEvents="box-none" >
        <View style={[bs.flex_row, bs.self_stretch, bs.mh_1x, bs.mt_2x]} >
          <TextInput
            border binrow bheight={sizes.em(40)} bbackground="#fff" bradius={sizes.em(5)} bstyle={[bs.ph_2x]}
            color="#000" size={15} placeholder="ENTER COMMENT" placeholderTextColor="#aaa"
            value={this.state.comment} onChangeText={comment => this.setState({ comment })}
          />
          <Button
            bnowide binrow bheight={sizes.em(40)} bbackground="#4A90E2" bradius={sizes.em(5)} bstyle={[bs.center, bs.ph_2x, bs.ml_1x]}
            onPress={this._onPressSendComment}
          >
            <Text size={15} color="#fff" >ADD</Text>
          </Button>
        </View>

        <FlatList
          data={this.comments}
          style={[bs.match_parent, bs.mt_2x]}
          keyExtractor={item => item._id}
          renderItem={({ ...props }) => <CommentItem {...props} />}
        />
      </View>
    );
  }
  _renderPicker = () => (
    <Picker2 ref={(node) => { this._picker = node; }} />
  )
}

const CommentItem = (function () {
  const Comp = React.Component;
  return class ItemClass extends Comp {
    shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
    }

    render = () => {
      const { item } = this.props;
      const mdate = moment(item.createdAt);
      console.log(item);
      return (
        <View style={[bs.self_stretch, bs.mh_2x, bs.mt_1x]} >
          <Border brow bnowide bradius={sizes.em(10)} bbackground="rgba(50,50,50,0.6)" bstyle={[bs.ph_2x, bs.pv_1x, bs.self_start]} >
            <Text color="#fff" size={14} >{mdate.format('MMM D, YYYY - ')}</Text>
            <Text color="#fff" size={14} style={bs.ml_2x} numberOfLines={3} >{item.comment}</Text>
          </Border>
        </View>
      );
    }
  };
}());
