import uniqueId from 'react-native-unique-id';
// import _ from 'lodash';
import setting from './settings';

function methodMixin(Component) {
  return class Method extends Component {
    constructor() {
      super();

      this.loadSetting();
    }

    async loadSetting() {
      this.runOnce = await setting.appRunOnce();
      this.lastRun = await setting.lastRun();
      this.deviceId = await setting.deviceId();

      this.chatServer.lastSubscription = await setting.lastSubscription();
      if (this.chatServer.lastSubscription) {
        this.chatServer.lastSubscription = new Date(this.chatServer.lastSubscription);
      }
      if (this.lastRun) {
        this.lastRun = new Date(this.lastRun);
      }

      await this.user.loadInfo();
      this.user.initCards();

      if ((this.deviceId || '') === '') {
        this.generateDeviceId();
      } else {
        this.inited = true;
      }

      console.log(`states: runOnce = ${this.runOnce}, deviceId = ${this.deviceId}`);
      console.log(`saved user: ${this.user.loginEmail} ${this.user.loginToken}`);
    }

    generateDeviceId = () => {
      uniqueId((err, id) => {
        if (id) {
          console.log('generated device-id: ', id);
          this.deviceId = id;
          setting.setDeviceId(id);
        }
        this.inited = true;
      });
    }

    setLastSubscription(date) {
      this.chatServer.lastSubscription = date;
      setting.setLastSubscription(this.chatServer.lastSubscription);
    }

    setAppRunOnce() {
      this.appRunOnce = true;
      setting.setRunOnce();
    }

    setLastRun() {
      this.lastRun = new Date();
      setting.setLastRun(this.lastRun);
    }
  };
}

export default methodMixin;
