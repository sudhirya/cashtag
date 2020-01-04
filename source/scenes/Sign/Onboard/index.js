import React from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Image } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { shallowEqual } from '@redux';
import { bs, sizes, images } from '@theme';
import styles from './styles';

class OnboardView extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  render () {
    return (
      <View style={styles.container} >
        <View flexDirection="row">
          <Text style={[bs.font_stink, bs.mb_8x]} color="#fff" size={140} >Cas</Text>
          <View marginLeft={-8}>
            <Text style={[bs.font_stink, bs.mb_8x]} color="#fff" size={140} >htags</Text>
          </View>
        </View>


        {/*<View style={[bs.center_start, bs.ph_4x]} >*/}
          {/*<View style={[bs.center, bs.flex_row]} >*/}
            {/*<Image contain width={sizes.em(32)} height={sizes.em(32)} source={images.ic_live_audio_on} />*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >DISCOVER TRACKS</Text>*/}
          {/*</View>*/}
          {/*<View style={[bs.center, bs.flex_row, bs.mt_3x]} >*/}
            {/*<Image contain width={sizes.em(32)} height={sizes.em(32)} source={images.ic_fuego} />*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >PROMOTE SONGS</Text>*/}
          {/*</View>*/}
          {/*<View style={[bs.center, bs.flex_row, bs.mt_3x]} >*/}
            {/*<Icon name="fa diamond" color="#fff" size={28} />*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >ARTIST TOKENS</Text>*/}
          {/*</View>*/}
          {/*<View style={[bs.center, bs.flex_row, bs.mt_3x]} >*/}
            {/*<Text center medium color="#fff" size={30} style={[bs.f_width(sizes.em(32))]} >#</Text>*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >ADD HASHTAGS</Text>*/}
          {/*</View>*/}
          {/*<View style={[bs.center, bs.flex_row, bs.mt_3x]} >*/}
            {/*<Image contain width={sizes.em(32)} height={sizes.em(32)} source={images.ic_live_video_on} />*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >SHARE STREAMZ</Text>*/}
          {/*</View>*/}
          {/*<View style={[bs.center, bs.flex_row, bs.mt_3x]} >*/}
            {/*/!*<Icon name="fa video-camera" size={32} color="#fff" />*!/*/}
            {/*<FIcon name="video" size={32} color="#fff" />*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >RECORD VIDEOS</Text>*/}
          {/*</View>*/}
        {/*</View>*/}

        <Button
          bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_13x]}
          bbackground="#4990E2" bradius={sizes.pad1}
          onPress={this.props.onPressLogin}
        >
          <Text semibold color="#fff" size={16} >LOGIN</Text>
        </Button>
      </View>
    );
  }
}

export default OnboardView;
