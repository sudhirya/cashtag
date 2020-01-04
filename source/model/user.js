import settings from '@common/settings';
import g from '@common/global';
import Mixpanel from 'react-native-mixpanel';
import _ from 'lodash';
import MDBase from './base';

export default class MDUser extends MDBase {
  loggedIn = false;
  info = null;
  meteorInfo = null;

  cards = null;

  loginEmail = null;
  loginToken = null;

  get userId() { return g.deepValue(this, 'meteorInfo._id', ''); }
  get handle() { return g.deepValue(this, 'meteorInfo.profile.handle', ''); }
  get email() { return g.deepValue(this, 'meteorInfo.0.address', ''); }
  get username() { return g.deepValue(this, 'meteorInfo.username', ''); }
  get customerId() { return g.deepValue(this, 'meteorInfo.profile.braintreeCustomerId', ''); }
  get verified() { return g.deepValue(this, 'meteorInfo.profile.smsVerified', ''); }
  get avatar() { return g.deepValue(this, 'info.avatar'); }
  get fullName() { return `${this.firstName || ''} ${this.lastName || ''}`; }

  login(meteorInfo, email, token) {
    this.loggedIn = true;
    this.loginEmail = email;
    this.loginToken = token;
    this.meteorInfo = meteorInfo;

    Mixpanel.identify(this.userId);
    Mixpanel.setOnce({ "$email": this.email });
  }
  logout() {
    settings.setLoginToken(null, this.loginEmail);
    this.loggedIn = false;
    this.loginEmail = null;
    this.loginToken = null;
    this.info = null;
    this.meteorInfo = null;
  }

  update(info) {
    this.info = info;

    _.forEach(this.cards, (card) => {
      _.mapKeys(info.points, (obj, _id) => {
        if (_id === card._id) {
          card.points = obj.platformTotal || 0;
        }
      });
    });
  }

  initCards() {
    // var r1 = Math.floor(1000000000000000 + Math.random() * 9000000000000000)
    // var r2 = Math.floor(1000000000000000 + Math.random() * 9000000000000000)
    // var r3 = Math.floor(1000000000000000 + Math.random() * 9000000000000000)
    // var r4 = Math.floor(1000000000000000 + Math.random() * 9000000000000000)

    var r1 = Math.floor(1000 + Math.random() * 9000)
    var r2 = Math.floor(1000 + Math.random() * 9000)
    var r3 = Math.floor(1000 + Math.random() * 9000)
    var r4 = Math.floor(1000 + Math.random() * 9000)

    this.cards = [
      { _id: 'chilll', name: 'CASHGRAM', points: 0, color: '#29A9D0', type: 'MICRO', number: r1 },
      { _id: 'spotify', name: 'SPOTIFY', points: 0, color: '#00D86C', type: 'MICRO', number: r2 },
      { _id: 'apple', name: 'APPLE MUSIC', points: 0, color: '#F44336', type: 'MICRO', number: r3 },
      { _id: 'audiomack', name: 'SOUND CLOUD', points: 0, color: '#FF7C30', type: 'MICRO', number: r4 },
    ];
  }

  saveInfo() {
    settings.setUserEmail(this.loginEmail);
    settings.setLoginToken(this.loginToken, this.loginEmail);
  }

  async loadInfo() {
    this.loginEmail = await settings.userEmail();

    if (g.isEmpty(this.loginEmail)) this.loginToken = null;
    else this.loginToken = await settings.loginToken(this.loginEmail);
  }

  isSaved() {
    return !g.isEmpty(this.loginEmail) && !g.isEmpty(this.loginToken);
  }
}