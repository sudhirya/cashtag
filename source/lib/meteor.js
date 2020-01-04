import Meteor from 'react-native-meteor';
// import DeviceInfo from 'react-native-device-info';
import setupSong from '@model/song';
import gs from '@common/states';
import g from '@common/global';
import _ from 'lodash';
import Realm from '@model/realm';

export default class MeteorMethods {
  static userProfile() {
    if (!gs.user.loggedIn) return null;

    Meteor.subscribe('getCurrentUserProfile', gs.user.userId);
    const users = Meteor.collection('UserProfiles').find() || [];
    const user = users[0];
    // console.log('user: ', user);
    if (user) gs.user.update(user);
    return user;
  }

  static recentListens(tags) {
    let handleSongs = Meteor.subscribe('getRecentListens', {});
    // if (typeof tags === "object") {
    //   handleSongs = Meteor.subscribe('getRecentListens', tags);
    // } else {
    //   handleSongs = Meteor.subscribe('getRecentListens', { userId: gs.user.userId });
    // }
    // console.log(handleSongs, "=============");

    const listens = Meteor.collection('Listens').find() || [];
    console.log(listens, 'listens')
    let songInfos = _.filter(listens, u => u.songObject);
    songInfos = _.map(songInfos, u => u.songObject);
    const songs = setupSong(songInfos);

    return {
      songsReady: handleSongs.ready(),
      songs,
    };
  }

  /**
   * subscribe chat user subscriptions
   */
  static subscriptions() {
    if (!gs.user.loggedIn) return [];

    Meteor.subscribe('privateChats', gs.user.userId);
    const subscriptions = Meteor.collection('subscriptions').find({});
    Realm.chat.addSubscriptions(subscriptions, true);

    console.log('subscriptions: ', gs.user.userId, subscriptions);
    return subscriptions;
  }

  /**
   * subscribe chat messages
   */
  static roomMessages() {
    if (g.isNull(gs.chat.rid)) return [];

    Meteor.subscribe('stream-room-messages', gs.chat.rid, false);
    const messages = Meteor.collection('stream-room-messages').find({}) || [];
    // console.log('room messages: ', messages);
    if (messages.length && messages[0].args) {
      messages[0].args.forEach(msg => Realm.chat.addMessage(msg));
    }
    return messages;
  }

  /**
   * check user is typing
   */
  static roomTyping() {
    if (g.isNull(gs.chat.rid)) return false;

    var users = [];
    Meteor.subscribe('rooms', gs.chat.rid);
    const room = Meteor.collection('rooms').findOne(gs.chat.rid) || {};
    if (room && room.usersTyping) {
      users = room.usersTyping;
      return users.findIndex(el => el !== gs.user.userId) >= 0;
    }
    return false;
  }
}
