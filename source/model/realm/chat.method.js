import gs from '@common/states';
import g from '@common/global';
import Random from 'react-native-meteor/lib/Random';
import _ from 'lodash';

export default function (realm) {
  const utils = {};

  utils.addMessage = function (msg) {
    return new Promise((resolve) => {
      realm.write(() => {
        msg._server = { _id: gs.chatServer._id };
        // msg.u = { _id: msg.u._id };

        const url = msg.urls && msg.urls[0];
        if (url && url.meta === 'image') {
          msg.image = url.url;
          msg.msg = null;
        }

        realm.create('Message', msg, true);
        resolve(msg);
      });
    });
  };
  utils.deleteMessage = function (msgId) {
    return new Promise((resolve) => {
      realm.write(() => {
        const message = utils.findMessage(msgId);
        if (message) {
          realm.delete(message);
        }
        resolve();
      });
    });
  };
  utils.deleteMessages = function (rid) {
    return new Promise((resolve) => {
      realm.write(() => {
        const messages = utils.findMessages(rid);
        if (messages && messages.length) {
          realm.delete(messages);
        }
        resolve();
      });
    });
  };
  utils.findMessages = function (rid) {
    return realm.objects('Message').filtered('rid == $0', rid).sorted('ts', true);
  };
  utils.findMessage = function (msgId) {
    return realm.objects('Message').filtered('_id == $0', msgId)[0];
  };
  utils.generateMessage = function (rid, msg) {
    if (!gs.user.loggedIn) return null;

    const message = {
      _id: Random.id(),
      rid,
      msg,
      ts: new Date(),
      temp: true,
      u: {
        _id: gs.user.userId,
        username: gs.user.username || gs.user.email,
        name: gs.user.fullName,
        avatar: gs.user.avatar,
      },
      _server: {
        id: gs.chatServer._id,
        current: true,
      },
      _updatedAt: new Date(),
    };

    return message;
  };
  utils.messageToGifted = function (msg) {
    let image = msg.image;
    if (msg.attachments && msg.attachments.length) {
      image = msg.attachments[0].image_url;
    }
    if (msg.urls && msg.urls[0] && msg.urls[0].meta === 'image') {
      image = msg.urls[0].url;
    }
    if (!image || !image.length) image = null;

    return {
      _id: msg._id,
      text: image ? null : msg.msg,
      image,
      createdAt: msg._updatedAt,
      user: {
        _id: msg.u._id,
        name: msg.u.name || msg.u.username,
        avatar: msg.u.avatar,
      },
    };
  };

  utils.addServer = function (server) {
    return new Promise((resolve) => {
      realm.write(() => {
        realm.create('Server', server, true);
        resolve(server);
      });
    });
  };

  utils.addUser = function (user) {
    return new Promise((resolve) => {
      realm.write(() => {
        realm.create('User', user, true);
        resolve(user);
      });
    });
  };

  utils.addLoginUser = function () {
    return utils.addUser({
      _id: gs.user.userId,
      _server: gs.chatServer,
      username: gs.user.username || gs.user.email,
      name: gs.user.fullName || gs.user.username,
      avatar: gs.user.avatar,
      drink: gs.user.settings && gs.user.settings.drinkOfChoice,
    });
  };
  utils.addWebUser = function (user) {
    return utils.addUser({
      _id: user.userId,
      _server: gs.chatServer,
      username: user.username || user.email,
      name: g.ifEmpty(user.fullName, `${g.ifEmpty(user.firstName, 'Unknown')} ${g.ifEmpty(user.lastName, '')}`),
      avatar: user.avatar,
      drink: user.settings && user.settings.drinkOfChoice,
    });
  };

  utils.findUser = function (userId) {
    return realm.objects('User').filtered('_id == $0', userId)[0];
  };
  utils.findUserByName = function (username) {
    return realm.objects('User').filtered('username == $0', username)[0];
  };

  utils.addSubscription = function (s) {
    return new Promise((resolve) => {
      realm.write(() => {
        realm.create('Subscription', s, true);
        resolve(s);
      });
    });
  };
  utils.addSubscriptions = function (ss, remove) {
    return new Promise(async (resolve) => {
      if (ss && ss.length) {
        if (remove) {
          const dbss = utils.subscriptions;
          const removes = _.filter(dbss, dbs => _.findIndex(ss, s => s._id === dbs._id) < 0);
          await utils.deleteSubscriptions(removes);
        }
        for (let i = 0; i < ss.length; i += 1) {
          await utils.addSubscription(ss[i]); // eslint-disable-line
        }
      }
      resolve();
    });
  };
  utils.deleteSubscription = function (ssId) {
    return new Promise((resolve) => {
      realm.write(() => {
        const subscription = utils.findSubscription(ssId);
        if (subscription) {
          realm.delete(subscription);
        }
        resolve();
      });
    });
  };
  utils.deleteSubscriptions = function (ss) {
    return new Promise((resolve) => {
      realm.write(() => {
        if (ss && ss.length) {
          realm.delete(ss);
        }
        resolve();
      });
    });
  };
  utils.clearSubscription = function () {
    return new Promise((resolve) => {
      realm.write(() => {
        const subscriptions = utils.subscriptions();
        if (subscriptions && subscriptions.length) {
          realm.delete(subscriptions);
        }
        resolve();
      });
    });
  };
  utils.findSubscription = function (ssId) {
    return realm.objects('Subscription').filtered('_id == $0', ssId)[0];
  };
  utils.findSubscriptionByUser = function (userId) {
    const subscriptions = utils.subscriptions();
    return _.find(subscriptions, s => s.name.indexOf(userId) >= 0);
  };
  utils.subscriptions = function () {
    return realm.objects('Subscription').filtered('t == \'p\'').sorted('_updatedAt', true);
  };

  return utils;
}
