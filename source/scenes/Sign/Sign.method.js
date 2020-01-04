/* global isNaN */
/* eslint no-restricted-globals: ["error", "event"] */

import { Keyboard } from 'react-native';
import { handler } from '@redux';
import { routes } from '@routes';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import apis from '@lib/apis';

const { navigation } = handler;
const { hud, drop } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      loginVerify: false,
      regVerify: false,
      loginMobile: '',
      regHandle: '',
      regMobile: '',
      loginCode: ['', '', '', '', ''],
      regCode: ['', '', '', '', ''],
      verifyCode: ['', '', '', '', '', ''],
      page: 1,
    }
    mobile = '';
    codes = '';
    editLoginCode = [null, null, null, null, null, null];
    editRegCode = [null, null, null, null, null, null];
    editVerifyCode = [null, null, null, null, null, null];

    /**
     * action handlers
     */
    _onPressEnjoy = () => {
      this._swiper.scrollBy(2, true);
    }

    _onPressLogin = () => {
      Keyboard.dismiss();

      if (g.isEmpty(this.state.loginMobile)) {
        drop.showError(c.appName, 'Please enter mobile number');
        return;
      }

      this._requestLogin(this.state.loginMobile, codes);
    }
    _onPressResendSms = () => {
      Keyboard.dismiss();
      this._requestResendSms();
    }
    _onPressVerifySms = () => {
      Keyboard.dismiss();

      const codes = this.state.verifyCode.join('');
      if (codes.length !== 6) {
        drop.showError(c.appName, 'Please enter verification code.');
        return;
      }

      this._requestSmsVerify(codes);
    }

    _onChangeCode = (state, edit, index, code) => {
      let value = parseInt(code, 10) % 10;
      if (isNaN(value)) value = 0;

      const empty = g.isEmpty(code);
      const codes = this.state[state].slice(0);
      codes[index] = empty ? '' : `${value}`;

      const temp = {};
      temp[state] = codes;
      this.setState(temp);

      if (empty && this[edit][index - 1]) {
        this[edit][index - 1].focus();
      } else if (!empty && this[edit][index + 1]) {
        this[edit][index + 1].focus();
      }
    }

    _onLoggedIn = () => {
      gs.user.loginEmail = this.mobile;
      gs.user.loginPassword = this.codes;
      gs.user.verified = true;
      gs.user.saveInfo();

      handler.main.view.swiperslidenumber(3);
      this.forceUpdate();
      // navigation.navigate({
      //   name: routes.names.app.home, key: routes.keys.app.home, animation: 'fade',
      // });
    }

    /**
     * api requests
     */
    _requestLogin = async (mobile) => {
      hud.show('Requesting...');
      try {
        const res = await apis.sendSmsVerificationCode(this.mobile);
        if (res.response) {
          gs.user.verifyCode = res.response.verifyCode;

          // now go to view
        } else {
          throw new Error('Failed to send sms verification code');
        }

        this.setState({ loginVerify: true });
      } catch (e) {
        console.log('sendSms failed: ', e);
        drop.showError(c.appName, 'Failed to login with mobile');
      }
      hud.hide();
    }

    _requestResendSms = async () => {
      hud.show('Requesting...');
      try {
        const res = await apis.sendSmsVerificationCode(this.mobile);
        if (res.response) {
          gs.user.verifyCode = res.response.verifyCode;
        } else {
          throw new Error('Failed to send sms verification code');
        }
      } catch (ex) {
        console.log('sendSms failed: ', ex);
        drop.showError(c.appName, 'Failed to send sms.');
      }
      hud.hide();
    }

    _requestSmsVerify = async (codes) => {
      hud.show('Requesting');
      try {
        const res = await apis.verifySmsCode(codes);
        console.log(res, 'res')
        if (!res) throw new Error('Failed to verify code.');

        this._onLoggedIn();
      } catch (ex) {
        drop.showError(c.appName, 'Failed to verify code. [839]');
      }
      hud.hide();
    }

  };
}

export default methodMixin;
