import React from 'react';
import { View } from 'react-native';
import { Button, Text, Scroll, TextInput } from '@components/controls';
import { CodeInput } from '@scenes/View';
import { shallowEqual, handler } from '@redux';
import { routes } from '@routes';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import { bs, sizes } from '@theme';
import apis from '@lib/apis';
import styles from './styles';

const { navigation } = handler;
const { hud, drop } = handler.alert;

class OnboardView extends React.Component {
  state = {
    mobile: '',
    smscode: '',
    handle: '',
    type: 'login', // login, sms, handle
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  componentDidMount() {
    if (gs.user.isSaved()) {
      this._requestAutoLogin();
    }
  }

  /**
   * action handlers
   */
  _onPressLogin = () => {
    if (g.isEmpty(this.state.mobile)) {
      drop.showError(c.appName, 'Please enter mobile number');
      return;
    }
    this._requestLogin();
  }

  _onPressVerifySms = () => {
    if (this.state.smscode.length !== 6) {
      drop.showError(c.appName, 'Please enter sms code');
      return;
    }
    this._requestSmsVerify();
  }

  _onPressResendSms = () => {
    this._requestResendSms();
  }

  _onPressSaveHandle = () => {
    if (g.isEmpty(this.state.handle)) {
      drop.showError(c.appName, 'Please enter username handle');
      return;
    }
    this._requestSaveHandle();
  }

  _onLoggedIn = () => {
    gs.user.saveInfo();

    // set state so go to Filter View
    handler.main.view.swiperslidenumber(3);
    this.forceUpdate();

    // navigation.navigate({ name: routes.names.app.home, key: routes.keys.app.home, animation: 'fade' });
  }

  /**
   * api requests
   */
  _requestLogin = async () => {
    hud.show();
    try {
      await apis.registerWithToken({
        mobileNumber: this.state.mobile,
      });
      await apis.sendSmsVerificationCode(this.state.mobile);

      this.setState({ type: 'sms' });
    } catch (e) {
      console.log('sendSms failed: ', e);
      drop.showError(c.appName, 'Failed to login');
    }
    hud.hide();
  }

  _requestSmsVerify = async () => {
    hud.show();
    try {
      const res = await apis.verifySmsCode(this.state.smscode);
      console.log(res, 'res')
      if (!res) throw new Error('Failed to verify code.');

      if (g.isEmpty(gs.user.handle)) this.setState({ type: 'handle' });
      else this._onLoggedIn();
    } catch (ex) {
      console.log(ex)
      drop.showError(c.appName, 'Failed to verify code. [902]');
    }
    hud.hide();
  }

  _requestResendSms = async () => {
    hud.show();
    try {
      const res = await apis.sendSmsVerificationCode(this.state.mobile);
      if (!res.response) throw new Error('Failed to send sms verification code');
    } catch (ex) {
      console.log('sendSms failed: ', ex);
      drop.showError(c.appName, 'Failed to send sms verification code.');
    }
    hud.hide();
  }

  _requestSaveHandle = async () => {
    hud.show();
    try {
      const handle = this.state.handle.replace(' ', '');
      await apis.setHandle(handle);

      if (gs.user.meteorInfo.profile) gs.user.meteorInfo.profile.handle = handle;
      else gs.user.meteorInfo.profile = { handle };

      this._onLoggedIn();
    } catch(ex) {
      console.log('SignIn::_requestSaveHandle failed: ', ex);
      drop.showError(c.appName, 'Failed to save username handle');
    }
    hud.hide();
  }

  _requestAutoLogin = async () => {
    hud.show();
    try {
      await apis.loginWithToken(gs.user.loginEmail, gs.user.loginToken);
      this._onLoggedIn();
    } catch (ex) {
      console.log('SignIn::_requestAutoLogin failed: ', ex);
    }
    hud.hide();
  }

  /**
   * render functions
   */
  render () {
    return (
      <View style={styles.container} >
        { this.state.type === 'login' && this._renderLogin() }
        { this.state.type === 'sms' && this._renderSmsCode() }
        { this.state.type === 'handle' && this._renderHandle() }
      </View>
    );
  }

  _renderLogin = () => {
    if (!g.isEmpty(gs.user.handle)) { // logged in
      return (
        <Scroll contentStyle={bs.center} >
          <TextInput
            border bunderline="#E7B700" bborderWidth={sizes.em(2)} bwidth={sizes.em(300, 560)} bheight={sizes.em(40)}
            center size={15} color="#fff"
            placeholder="**********" placeholderTextColor="#C9A004" keyboardType="number-pad"
            value={this.state.mobile} onChangeText={text => this.setState({ mobile: text })}
          />
        </Scroll>
      )
    } else {
      return (
        <Scroll contentStyle={bs.center} >
          <TextInput
            border bunderline="#E7B700" bborderWidth={sizes.em(2)} bwidth={sizes.em(300, 560)} bheight={sizes.em(40)}
            center size={15} color="#fff"
            placeholder="Mobile Number" placeholderTextColor="#C9A004" keyboardType="number-pad"
            value={this.state.mobile} onChangeText={text => this.setState({ mobile: text })}
          />
        <Button bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bbackground="#32CD32" bradius={sizes.pad1}
            bstyle={[bs.center, bs.mt_8x]} onPress={this._onPressLogin} >
            <Text semibold color="#fff" size={16} >ENTER</Text>
          </Button>
        </Scroll>
      )
    }
  }

  _renderSmsCode = () => (
    <Scroll contentStyle={bs.center} >
      <Text center color="#fff" size={14} style={bs.mt_4x} >We just send you a text message.</Text>
      <Text center color="#C9A004" size={14} style={bs.mt_1x} >Please enter the code below.</Text>

      <CodeInput onChange={code => this.setState({ smscode: code })} style={bs.mt_6x} />

      <Button bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bbackground="#4990E2" bradius={sizes.pad1}
        bstyle={[bs.center, bs.mt_8x]} onPress={this._onPressVerifySms} >
        <Text semibold color="#fff" size={16} >VERIFY</Text>
      </Button>
      <Button bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bbackground="#FF8C00" bradius={sizes.pad1}
        bstyle={[bs.center, bs.mt_3x]} onPress={this._onPressResendSms} >
        <Text semibold color="#fff" size={16} >RESEND SMS</Text>
      </Button>
    </Scroll>
  )

  _renderHandle = () => (
    <Scroll contentStyle={bs.center} >
      <TextInput
        border bunderline="#E7B700" bborderWidth={sizes.em(2)} bwidth={sizes.em(300, 560)} bheight={sizes.em(40)}
        center size={15} color="#fff"
        placeholder="Enter username handle" placeholderTextColor="#C9A004"
        value={this.state.handle} onChangeText={text => this.setState({ handle: text })}
      />
      <Button bwidth={sizes.em(320, 600)} bheight={sizes.em(40)} bbackground="#fff" bradius={sizes.pad1}
        bstyle={[bs.center, bs.mt_8x]} onPress={this._onPressSaveHandle} >
        <Text semibold color="#C9A004" size={16} >Save Handle</Text>
      </Button>
    </Scroll>
  )
}

export default OnboardView;
