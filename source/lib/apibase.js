import Meteor from 'react-native-meteor';
import setting from '@common/settings';
import gs from '@common/states';
import g from '@common/global';
import { handler } from '@redux';
// import { transferUtility } from 'react-native-s3';
import AppConfig from '@app/config';

class apis {}

apis.call = function(...args) {
  const arrArgs = [].slice.call(args);
  const method = args[0];
  return new Promise((resolve, reject) => {
    const callcb = (err, res) => {
      try {
        if (err) {
          console.log(`${method} failed - 1. error: `, err);
          reject(err);
        } else {
          if (method === 'getPlaylist') {
            console.log(`${method} success. result: `, res && res.results && res.results.length);
          } else {
            console.log(`${method} success. result: `, res);
          }
          resolve(res);
        }
      } catch (err1) {
        console.log(`${method} failed - 4. error: `, err1);
      }
    };

    try {
      console.log(`request ${method}, args: `, args);

      arrArgs.push(callcb);
      Meteor.call.apply(null, arrArgs);
    } catch (err) {
      try {
        console.log(`${method} failed - 2. error: `, err);
        reject(err);
      } catch (err1) {
        console.log(`${method} failed - 3. error: `, err, err1);
      }
    }
  });
};

apis.meteorLoginWithToken = function(token) {
  return new Promise((resolve, reject) => {
    Meteor.loginWithToken(token, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
apis.meteorLogout = function() {
  return new Promise((resolve, reject) => {
    Meteor.logout((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

apis.meteorLoggedIn = async function(email, token) {
  const meteorUser = Meteor.user();
  gs.user.login(meteorUser, email, token);
  console.log('meteor logged in - ', meteorUser);

  gs.initChat();
  handler.main.update.user();

  return gs.user;
};

apis.loginWithToken = async function(email, token) {
  console.log('loginWithToken: ', email, token);

  await this.meteorLoginWithToken(token);
  const user = await this.meteorLoggedIn(email, token);
  setting.setLoginToken(token, email);

  return user;
};

apis.logout = async function() {
  try {
    await Meteor.logout();
  } catch (ex) { ex; }

  gs.user.logout();
  gs.user.saveInfo();
  handler.main.update.user();
};

apis.createUser = async function(params) {
  const regData = await this.call('createChilllAppUser', params);
  const user = await this.loginWithToken(params.mobileNumber, regData.token);
  return user;
};

apis.registerWithToken = async function(params) {
  const token = await setting.loginToken(params.mobileNumber);
  if (!g.isEmpty(token)) {
    try {
      const user = await this.loginWithToken(params.mobileNumber, token);
      return user;
    } catch (ex) {
      if (ex.reason !== 'You\'ve been logged out by the server. Please log in again.') throw ex;
    }
  }

  params.generateToken = true;
  const user1 = await this.createUser(params);
  if (user1) return user1;

  throw new Error('register failed');
};

apis.uploadFile = function(key, file, bucket) {
  return new Promise(async (resolve, reject) => {
    try {
      const contentType = g.getContentType(file);
      const newFile = g.normalizeFileUrl(file);
      console.log('uploadFile: ', newFile, g.getS3Url(key), contentType);

      // const uploadTask = await transferUtility.upload({
      //   bucket: bucket || AppConfig.s3.bucket,
      //   key,
      //   file: newFile,
      //   meta: {
      //     'Content-Type': contentType,
      //     'x-amz-acl': 'public-read',
      //   },
      // });

      transferUtility.subscribe(uploadTask.id, (err, task) => {
        if (err) {
          console.log('uploadFile failed: ', err);
          reject(err);
        } else if (task.state === 'completed') {
          resolve();
        }
      });
    } catch (err) {
      console.log('uploadFile failed1: ', err);
      reject(err);
    }
  });
};

export default apis;