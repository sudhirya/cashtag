import AsyncStorage from '@react-native-community/async-storage';

const tag = 'chilll';

const genkey = key => `${tag}.${key}`;
const keys = {
  runOnce: genkey('run.once'),
  lastRun: genkey('last.run'),
  deviceId: genkey('device.id'),
  loginToken: genkey('login.token'),
  userEmail: genkey('user.email'),
  userPassword: genkey('user.password'),
  userToken: genkey('user.token'),
  chatLastSubscription: genkey('chat.last_subscription'),
};

export default class AppSettings {
  static async appRunOnce() {
    return getBoolean(keys.runOnce);
  }
  static setRunOnce() {
    setItem(keys.runOnce, true);
  }

  static async lastRun() {
    return getObject(keys.lastRun);
  }
  static setLastRun(val) {
    setItem(keys.lastRun, val);
  }

  static async deviceId() {
    return getString(keys.deviceId);
  }
  static setDeviceId(deviceId) {
    setItem(keys.deviceId, deviceId);
  }

  static loginToken(email) {
    return getString(`${keys.loginToken}.${email}`);
  }
  static setLoginToken(token, email) {
    return setItem(`${keys.loginToken}.${email}`, token);
  }

  static async userEmail() {
    return getString(keys.userEmail);
  }
  static setUserEmail(email) {
    return setItem(keys.userEmail, email);
  }

  static async userPassword() {
    return getString(keys.userPassword);
  }
  static setUserPassword(password) {
    return setItem(keys.userPassword, password);
  }

  static async userToken() {
    return getString(keys.userToken);
  }
  static setUserToken(token) {
    return setItem(keys.userToken, token);
  }

  static async lastSubscription() {
    return getObject(keys.chatLastSubscription);
  }
  static setLastSubscription(date) {
    return setItem(keys.chatLastSubscription, date);
  }
}

const isNull = value => value === null || typeof value === 'undefined';
const isString = value => typeof value === 'string' || value instanceof String;

function setItem(key, value) {
  if (isNull(value)) {
    AsyncStorage.removeItem(key);
  } else if (isString(value)) {
    AsyncStorage.setItem(key, value);
  } else {
    AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

function getItem(key) {
  return AsyncStorage.getItem(key);
}

async function getObject(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!isNull(value)) {
      return JSON.parse(value);
    }
    return null;
  } catch (err) {
    console.log('setting.getObject: failed with ', err);
    return null;
  }
}
async function getString(key) {
  return (await getItem(key)) || '';
}
async function getBoolean(key) {
  return (await getObject(key)) || false;
}
