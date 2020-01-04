import RNFetchBlob from 'rn-fetch-blob';
import gs from '@common/states';
import g from '@common/global';
import apis from '../apibase';

apis.createChannel = function(name, users, type) {
  return this.call(type ? 'createChannel' : 'createPrivateGroup', name, users, type);
};

apis.createPrivateGroup = function(userId) {
  const name = `${gs.user.userId}_${userId}`;
  return this.call('createPrivateGroup', name, [gs.user.userId, userId]);
};

apis.createPrivateChatRoom = function(userId) {
  return this.call('createPrivateChatRoom', { creator: gs.user.userId, responder: userId });
};

apis.testServer = function(url) {
  return new Promise((resolve, reject) => {
    if (/^(https?:\/\/)?(((\w|[0-9])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(url)) {
      const response = fetch(url, { method: 'HEAD' }); // eslint-disable-line
      if (response.status === 200 && response.headers.get('x-instance-id') !== null && response.headers.get('x-instance-id').length) {
        resolve();
        return;
      }
    }
    reject(new Error('invalid server'));
  });
};

apis.spotlight = function(search, usernames) {
  return this.call('spotlight', search, usernames);
};

apis.createDirectMessage = function(username) {
  return this.call('createDirectMessage', username);
};

apis.readMessages = function(rid) {
  return this.call('readMessages', rid);
};

apis.joinRoom = function(rid) {
  return this.call('joinRoom', rid);
};

apis.ufsCreate = function(fileInfo) {
  return this.call('ufsCreate', fileInfo);
};

apis.ufsComplete = function(fileId, store, token) {
  return this.call('ufsComplete', fileId, store, token);
};

// Users Typing
apis.startTyping = function(rid, username) {
  return this.call('startMessageTyping', {
    rid,
    username,
  });
};
apis.stopTyping = function(rid, username) {
  return this.call('stopMessageTyping', {
    rid,
    username,
  });
};
apis.getUsersTyping = function(rid) {
  return this.call('getUsersTyping', rid);
};
//

apis.sendMessage = function(message) {
  return new Promise((resolve, reject) => {
    this.call('sendMessage', {
      _id: message._id,
      rid: message.rid,
      msg: message.msg,
    }).then(() => {
      resolve(message);
    }).catch((e) => {
      reject(e);
    });
  });
};

apis.sendFileMessage2 = function(rid, svc, data, msg = {}) {
  return this.call('sendFileMessage', rid, svc, data, msg);
};

apis.sendFileMessage = async function(rid, fileInfo, data) {
  const result = await this.ufsCreate({ ...fileInfo, rid });

  await RNFetchBlob.fetch('POST', result.url, {
    'Content-Type': 'application/octet-stream',
  }, data);

  const completeRresult = await this.ufsComplete(result.fileId, fileInfo.store, result.token);
  const res = await this.sendFileMessage2(completeRresult.rid, null, {
    _id: completeRresult._id,
    type: completeRresult.type,
    size: completeRresult.size,
    name: completeRresult.name,
    url: completeRresult.path,
  });
  return res;
};

apis.sendImageMessage = async function(message, file) {
  const ext = g.getFileExt(file);
  const key = `chat_${message._id}_${message.rid}.${ext}`;
  const s3url = g.getS3Url(key);

  await this.uploadFile(key, file, 'chilll-media');
  const res = await this.sendFileMessage2(message.rid, 's3', {
    _id: message._id,
    type: g.getContentType(file),
    size: 0,
    name: key,
    url: s3url,
  });
  return res;
};

apis.sendImageMessage = async function(message, file) {
  const ext = g.getFileExt(file);
  const key = `chat_${message._id}_${message.rid}.${ext}`;
  const s3url = g.getS3Url(key);

  await this.uploadFile(key, file);
  const res = await this.call('sendMessage', {
    _id: message._id,
    rid: message.rid,
    msg: '',
    urls: [{ url: s3url, meta: 'image' }],
  });
  return res;
};

apis.getSubscriptions = function() {
  return this.call('subscriptions/get', null); // gs.chatServer.lastSubscription || null);
};

apis.loadHistory = function(rid, end, count, lastdate) {
  return this.call('loadHistory', rid, end, count, lastdate || null);
};

apis.readMessages = function(rid) {
  return this.call('readMessages', rid);
};

apis.eraseRoom = function(rid) {
  return this.call('eraseRoom', rid);
};

export default apis;