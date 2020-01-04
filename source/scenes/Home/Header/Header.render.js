import React from 'react';
import { View, Animated } from 'react-native';
import { Button, Text, Image, Icon, TextInput } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather'
import { sizes, bs, images, colors } from '@theme';
import { SearchType, ViewType } from '@common/types';
import gs from '@common/states';
import _ from 'lodash';
import styles from './Header.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      const animHeight = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [sizes.header.height1, sizes.header.height1, sizes.header.height2, sizes.header.height2],
      });
      const height = { height: animHeight };
      const animOverlayOpacity = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [1, 1, 0, 0],
      });
      const overlayOpacity = { opacity: animOverlayOpacity };

      return (
        <Animated.View style={[styles.container, height]} >
          <Animated.View style={[styles.overlay1, overlayOpacity]} />
          { this._renderContent() }
        </Animated.View>
      );
    }

    _renderContent = () => {
      const animOpacity = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [1, 1, 0.75, 0.75],
      });
      const opacity = { opacity: animOpacity };

      return (
        <Animated.View style={[styles.content, opacity]} >
          { this._renderLeft() }
          { this._renderMid() }
          { this._renderRight() }
        </Animated.View>
      );
    }

    _renderLeft = () => {
      const animOpacity1 = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0, 0, 1, 1],
      });
      const opacity1 = { opacity: animOpacity1 };
      const animOpacity2 = this.props.animView.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [1, 1, 0, 0],
      });
      const opacity2 = { opacity: animOpacity2 };

      return (
        <Button lock onPress={this._onPressSearch} onLongPress={this._onPressLongSearch} style={styles.button} >
          <Animated.View style={[bs.absolute_full, bs.center, opacity1]} >
            {/* <Text transparent color="#fff" size={44} style={styles.txt_chill} >C</Text> */}
            <Icon name="io md-search" size={32} color="#fff" style={[bs.pl_3x, bs.pt_2x]} />
          </Animated.View>
          <Animated.View style={opacity2} >
            {/* <Text transparent color="#000" size={44} style={styles.txt_chill} >C</Text> */}
            <Icon name="io md-search" size={32} color={colors.black} style={[bs.pl_3x, bs.pt_2x]} />
          </Animated.View>
        </Button>
      );
    }

    _renderMid = () => {
      if (this.props.viewType === ViewType.player) {
        const animOpacity1 = this.props.animView.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [0, 0, 1, 1],
        });
        const opacity1 = { opacity: animOpacity1 };
        const animOpacity2 = this.props.animView.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1, 0, 0],
        });
        const opacity2 = { opacity: animOpacity2 };
        return (
          <View style={styles.view_mid} >
            <Button lock onPress={this._onPressMenu} style={styles.button} >
              <Animated.View style={[bs.absolute_full, bs.center, opacity1]} >
                <Image contain width={sizes.em(18)} height={sizes.em(18)} source={images.ic_menu} />
              </Animated.View>
              <Animated.View style={opacity2} >
                <Image contain width={sizes.em(18)} height={sizes.em(18)} source={images.ic_menu} />
              </Animated.View>
            </Button>
          </View>
        );
      } else if (this.props.viewType === ViewType.songlist) {
        return (
          <View style={styles.view_mid} >
            <Button lock style={styles.button} >
              <Icon name="io ios-arrow-up" size={32} color="#777" />
            </Button>
          </View>
        );
      } else if (this.props.search.type === SearchType.none) {
        const animOpacity = this.props.animView.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [1, 1, 0, 0],
        });
        const opacity = { opacity: animOpacity };
        const { song } = gs.player;
        const isStream = song && song.isStreamPlaylist;
        // const tintColor = gs.player.streamLiveAudio ? null : '#000';
        this.editSearch = null;

        return (
          <Animated.View style={[styles.view_mid, opacity, isStream ? bs.end_center : bs.center]} >
            <Button lock onPress={this._onPressHandle}>
              <View flexDirection="row">
                <Text style={[bs.font_stink]} color="#000" size={62} >Cas</Text>
                <View marginLeft={-3}>
                  <Text style={[bs.font_stink]} color="#000" size={62} >htags</Text>
                </View>
              </View>
            </Button>
            { isStream && (
              <Button lock bnowide onPress={this._onPressBolt} >
                <Image contain width={sizes.em(24)} height={sizes.em(24)} source={images.ic_live_video_on} />
              </Button>
            )}
          </Animated.View>
        );
      }

      const onRefSearch = (node) => {
        node && !this.editSearch && node.focus();
        this.editSearch = node;
      };
      return (
        <View style={[styles.view_mid, bs.ph_2x]} >
          <TextInput
            border bcenter btransparent bunderline="#666" bstyle={bs.pb_1x}
            center color="#000" size={16} bheight={sizes.em(30)}
            placeholder="" placeholderTextColor="#ddd" keyboardAppearance="dark"
            value={this.props.search.keyword} onRef={onRefSearch} onChangeText={this._onChangeSearch}
          />
        </View>
      );
    }

    _renderRight = () => {
      const clrTV = (this.props.viewType === ViewType.player) ? '#FFF' : null;
      clrTV;

      return (
        <Button lock onPress={this._onPressTV} style={styles.button} >
          {/* <Image contain width={sizes.em(28)} height={sizes.em(28)} tint={clrTV} source={images.ic_header_tv} /> */}
          <Image contain width={sizes.em(28)} height={sizes.em(28)} source={images.ic_header_tv} />
        </Button>
      );
    }
  };
}

export default renderMixin;
