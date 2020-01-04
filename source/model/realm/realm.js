import _ from 'lodash';
import * as chatSchemas from './schemas/chat';
import chatUtils from './chat.method';
import Realm from './_realm';

const schemas = [];

_.each(chatSchemas, schema => schemas.push(schema));

const realm = new Realm({
  schema: schemas,
  schemaVersion: 5,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion >= 4) return;
    if (oldRealm.schemaVersion === 0) return;

    const oldUsers = oldRealm.objects('User');
    const newUsers = newRealm.objects('User');

    if (oldRealm.schemaVersion < 2) {
      for (let i = 0; i < oldUsers.length; i += 1) {
        newUsers[i].avatar = null;
      }
    }
    if (oldRealm.schemaVersion < 3) {
      for (let i = 0; i < oldUsers.length; i += 1) {
        newUsers[i].drink = null;
      }
    }
    if (oldRealm.schemaVersion < 4) {
      const newSubs = newRealm.objects('Subscription');
      for (let i = 0; i < newSubs.length; i += 1) {
        newRealm.delete(newSubs[i]);
      }
    }
    if (oldRealm.schemaVersion < 5) {
      const newMsgs = newRealm.objects('Message');
      for (let i = 0; i < newMsgs.length; i += 1) {
        newMsgs[i].image = null;
      }
    }
  },
});

class utils {
}

utils.realm = realm;
utils.chat = chatUtils(realm);

export default utils;
