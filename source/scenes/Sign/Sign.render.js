import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, Button, Scroll, TextInput, Image, Icon } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';
import { bs, sizes, images } from '@theme';
import styles from './Sign.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          <SafeAreaView style={bs.match_parent} >
            <Swiper
              ref={(node) => { this._swiper = node; }} loop={false}
              horizontal width={sizes.window.width} height={sizes.window.height - sizes.em(80)} showButtons={false} activeDotColor="#FFDE00" dotColor="#DBDBDB"
              index={this.state.page} onIndexChanged={index => this.setState({ index })}
              paginationStyle={[bs.f_bottom(sizes.em(15))]}
            >
              { this.state.loginVerify ? this._renderSmsVerify() : this._renderLogin() }
              { this._renderGuide() }
            </Swiper>

            {/*
            <Button
              bbackground="#7ED321" bradius={sizes.pad1} bheight={sizes.em(50)} bstyle={[bs.mh_4x, bs.mb_3x]}
              onPress={this._onPressEnjoy}
            >
              <Text center transparent color="#fff" size={17} medium >ENJOY!</Text>
            </Button>
            */}
          </SafeAreaView>
        </View>
      );
    }

    _renderLogin = () => (
      <Scroll style={bs.mb_8x} contentStyle={bs.center} >
        {/* <Text semibold color="#fff" size={16} style={bs.mt_4x} >Please enter your mobile number</Text> */}
        <TextInput
          border bpadding={0} bunderline="#E7B700" bborderWidth={sizes.em(2)}
          bwidth={sizes.em(300, 560)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_3x]}
          center size={15} color="#fff"
          placeholder="Mobile Number" placeholderTextColor="#C9A004" keyboardType="number-pad"
          value={this.state.loginMobile} onChangeText={loginMobile => this.setState({ loginMobile })}
        />
        <Button
          bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_8x]}
          bbackground="#4990E2" bradius={sizes.pad1}
          onPress={this._onPressLogin}
        >
          <Text semibold color="#fff" size={16} >Enter</Text>
        </Button>
      </Scroll>
    )
    _renderSmsVerify = () => (
      <Scroll style={bs.mb_8x} contentStyle={bs.center} >
        <Text center color="#fff" size={14} style={bs.mt_4x} >We just sent you a text message.</Text>
        <Text center color="#C9A004" size={14} style={bs.mt_1x} >Please enter the code below.</Text>

        <View style={[bs.flex_row, bs.center, bs.mt_3x]} >
          { this._renderVerifyCodeInput(0) }
          { this._renderVerifyCodeInput(1) }
          { this._renderVerifyCodeInput(2) }
          <Text size={40} color="#fff" >-</Text>
          { this._renderVerifyCodeInput(3) }
          { this._renderVerifyCodeInput(4) }
          { this._renderVerifyCodeInput(5) }
        </View>

        <Button
          bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_8x]}
          bbackground="#fff" bradius={sizes.pad1}
          onPress={this._onPressVerifySms}
        >
          <Text semibold color="#C9A004" size={16} >Verify</Text>
        </Button>
        <Button
          onPress={this._onPressResendSms}
          bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_3x]}
          bbackground="#fff" bradius={sizes.pad1}
        >
          <Text semibold color="#C9A004" size={16} >Resend SMS</Text>
        </Button>
      </Scroll>
    )

    _renderRegister = () => (
      <Scroll style={bs.mb_8x} contentStyle={bs.center} >
        {/* <Text semibold color="#fff" size={16} style={bs.mt_4x} >Please enter your mobile number</Text> */}
        <TextInput
          border bpadding={0} bunderline="#E7B700" bborderWidth={sizes.em(2)}
          bwidth={sizes.em(300, 560)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_3x]}
          center size={15} color="#fff"
          placeholder="Mobile Number" placeholderTextColor="#C9A004" keyboardType="number-pad"
          value={this.state.regMobile} onChangeText={regMobile => this.setState({ regMobile })}
        />

        {/* <Text semibold color="#fff" size={16} style={bs.mt_8x} >Please enter your handle</Text> */}
        <TextInput
          border bpadding={0} bunderline="#E7B700" bborderWidth={sizes.em(2)}
          bwidth={sizes.em(300, 560)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_3x]}
          center size={15} color="#fff"
          placeholder="Enter username handle" placeholderTextColor="#C9A004"
          value={this.state.regHandle} onChangeText={(regHandle) => { this.setState({ regHandle }); }}
        />

        {/* <Text semibold color="#fff" size={16} style={bs.mt_8x} >Please enter your pass code</Text> */}
        <View style={[bs.flex_row, bs.center, bs.mt_3x]} >
          { this._renderRegCodeInput(0) }
          { this._renderRegCodeInput(1) }
          { this._renderRegCodeInput(2) }
          <Text size={40} color="#fff" >-</Text>
          { this._renderRegCodeInput(3) }
          { this._renderRegCodeInput(4) }
          { this._renderRegCodeInput(5) }
        </View>

        <Button
          bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_8x]}
          bbackground="#7ED321" bradius={sizes.pad1}
          onPress={this._onPressRegister}
        >
          <Text semibold color="#fff" size={16} >Register</Text>
        </Button>
      </Scroll>
    )

    _renderGuide = () => (
      <View style={[bs.match_parent, bs.center]} >
        <View style={[bs.flex, bs.center_start, bs.ph_4x]} >
          <Text style={[bs.font_stink, bs.mb_8x, bs.self_center]} color="#fff" size={60} >Chilll Music</Text>
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
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >COLLECT HOLOGRAMS</Text>*/}
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
            {/*<FIcon name="camera" size={32} color="#fff" />*/}
            {/*<Text medium color="#fff" size={20} style={bs.ml_4x} >RECORD VIDEOS</Text>*/}
          {/*</View>*/}

          <Button
            bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_8x]}
            bbackground="#4990E2" bradius={sizes.pad1}
            onPress={() => { this._swiper.scrollBy(-1, true); }}
          >
            <Text semibold color="#fff" size={16} >Enter</Text>
          </Button>
          <Button
            bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bstyle={[bs.center, bs.mt_4x]}
            bbackground="#7ED321" bradius={sizes.pad1}
            onPress={() => { this._swiper.scrollBy(1, true); }}
          >

          </Button>
        </View>
      </View>
    )

    _renderCodeInput = (state, edit, index) => (
      <TextInput
        onRef={(node) => { this[edit][index] = node; }}
        border bpadding={0} bradius={sizes.em(18)} bborderWidth={sizes.em(3)} bwidth={sizes.em(45)} bheight={sizes.em(90)}
        bborder="#bbb" bbackground="#fff" bstyle={[bs.center, { marginHorizontal: sizes.em(3) }]}
        center size={40} color="#000" placeholder="0" keyboardType="number-pad"
        value={this.state[state][index]} onChangeText={this._onChangeCode.bind(this, state, edit, index)}
      />
    )
    _renderLoginCodeInput = index => this._renderCodeInput('loginCode', 'editLoginCode', index)
    _renderRegCodeInput = index => this._renderCodeInput('regCode', 'editRegCode', index)
    _renderVerifyCodeInput = index => this._renderCodeInput('verifyCode', 'editVerifyCode', index)
  };
}

export default renderMixin;
