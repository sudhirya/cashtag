import { handler } from '@redux';
import { routes } from '@routes';
import Orientation from 'react-native-orientation';
import Mixpanel from 'react-native-mixpanel';
// import { transferUtility } from 'react-native-s3';
import gs from '@common/states';
import c from '@common/consts';
import apis from '@lib/apis';
// import jwt from 'jsonwebtoken';

const { navigation } = handler;
// const { drop, hud } = handler.alert;

// c.testMode = true;

function methodMixin(Component) {
  return class Method extends Component {
    _timer = null;

    componentDidMount() {
      handler.tracker.startStatusTrack();
      // transferUtility.setupWithNative();
      Orientation.lockToPortrait();
      this.startValidator();
      Mixpanel.sharedInstanceWithToken('0dea44e76dc8132db68f0f4baa492b34');

      //       const cert = `-----BEGIN PRIVATE KEY-----
      // MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg9PNa4pBJNLrK/6cc
      // Ha7nT9nDaAKm3sovTLG5mR00zjegCgYIKoZIzj0DAQehRANCAARsoeGLWiL5DKMb
      // MCF0+2dMBTIuXUCLpFdNaJlGlCPaSCLCiRwMnb0iPlzhN6Tbqc9ho802sY8SuMzS
      // CGtCaCvK
      // -----END PRIVATE KEY-----   `;
      //       jwt.sign({
      //         alg: 'ES256',
      //         kid: 'RR23WR7V27',
      //         iss: '5YYZX7TBX6',
      //         iat: 1530266930,
      //         exp: 1560266930,
      //       }, cert, (err, token) => {
      //         console.log(err, token);
      //       });
    }

    /**
     * helper functions
     */
    startValidator = (interval = 100) => {
      this._timer = setInterval(() => {
        this.checkValid();
      }, interval);
    }

    stopValidator = () => {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    }

    isValid = () => (
      gs.inited &&
      this.props.status.connected &&
      true
    )

    checkValid = () => {
      if (c.testMode) {
        if (!gs.inited) return;
        this.stopValidator();
        this._gotoTest();
        return;
      }

      if (!this.isValid()) return;

      console.log('connected');
      this.stopValidator();
      this._gotoSign();
    }

    _gotoSign = () => {
      navigation.navigate({ name: routes.names.app.sign, key: routes.keys.app.sign, animation: 'fade' });
    }

    _gotoTest() {
      navigation.navigate({ name: routes.names.app.sign, key: routes.keys.app.sign, animation: 'fade' });
    }

    checkSaved() {
      if (gs.user.isSaved()) {
        apis.login(gs.user.loginEmail, gs.user.loginPassword).then(() => {
          if (gs.user.verified) {
            this.gotoMain();
          } else {
            this.gotoSign();
          }
        }).catch(() => {
          this.gotoSign();
        });
      } else {
        this.gotoSign();
      }
    }

    gotoMain() {
      navigation.navigate({
        name: routes.names.app.home,
        key: routes.keys.app.home,
        animation: 'fade',
      });
    }
  };
}

export default methodMixin;