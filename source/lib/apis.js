import Random from 'react-native-meteor/lib/Random';
import gs from '@common/states';
import g from '@common/global';
import { sizes } from '@theme';
import { chatapis as apis } from './chat';

/**
 * generate braintree token
 * @param  {String} code - sms vericiation code
 */
apis.generateBraintreeToken = async function(userId) {
  return this.call('generateBraintreeToken', userId);
};

/**
 * send sms verification request
 * @param  {String} mobile - mobile number
 */
apis.sendSmsVerificationCode = function(mobile) {
  return this.call('sendSmsVerificationCode', {
    userId: gs.user.userId,
    destinationNumber: mobile,
  });
};

/**
 * verify sms code
 * @param  {String} code - sms vericiation code
 */
apis.verifySmsCode = function(code) {
  return this.call('verifySmsCode', {
    userId: gs.user.userId,
    code,
  });
};

/**
 * save username handle
 * @param  {String} handle - username handle
 */
apis.setHandle = function(handle) {
  return this.call('setHandle', {
    userId: gs.user.userId,
    handle,
  });
};

/**
 * get artists from ids
 * @param  {Array} artistId - artist ids
 */
apis.getArtist = function(artistId) {
  return this.call('getArtist', { artistId });
};

/**
 * get artists from names
 * @param  {Array} artistName - artist names
 */
apis.findArtist = function(artistName) {
  return this.call('findArtist', { name: artistName });
};

/**
 * add playlist to stream
 * @param  {String} playlistName - playlist name
 */
apis.addPlaylistToStream = function(playlistName) {
  return this.call('addPlaylistToStream', {
    userId: gs.user.userId,
    playlistName,
  });
};

/**
 * get Wallets
 */
apis.getWallets = function() {
  return this.call('getWallets', { userId: gs.user.userId });
};

/**
 * add card to wallet
 * @param  {String} card - card name eg. apple, spotify
 */
apis.addCardToWallet = function(card) {
  return this.call('addCardToWallet', {
    userId: gs.user.userId,
    card,
  });
};

apis.getSearchTags = function() {
  return this.call('getSearchTags', gs.user.userId);
};

apis.getPlaylist = function(tags, limit, skip) {
  return this.call('getPlaylist', gs.user.userId, tags, limit, skip);
};

apis.getSuggestedTags = function(keyword) {
  return this.call('getSuggestedTags', keyword);
};

apis.searchMedia = function(keyword) {
  return this.call('searchMedia', { keyword, userId: gs.user.userId });
};

apis.addSearchTags = function(tags) {
  return this.call('addSearchTags', gs.user.userId, tags);
};

apis.addInitialSearchTags = function() {
  return this.call('addSearchTags', gs.user.userId, ['+2017'], true);
};

apis.removeSearchTag = function(tag) {
  return this.call('removeSearchTag', gs.user.userId, tag);
};

apis.addVideoObject = function(info) {
  return this.call('addVideoObject', info, gs.user.userId);
};

apis.addSongObject = function(info) {
  return this.call('addSongObject', info, gs.user.userId);
};

apis.saveSongFromSearch = function(info) {
  return this.call('saveSongFromSearch', info);
};

apis.saveSong = function(info) {
  return this.call('saveSong', {}, info);
};

apis.saveMetrics = function(data) {
  return this.call('saveMetrics', gs.user.userId, data);
};

apis.getDevicePlaylistNames = function() {
  return this.call('getDevicePlaylistNames', gs.user.userId);
};

apis.getPlaylistByName = function(listName) {
  return this.call('getPlaylistByName', gs.user.userId, listName);
};

apis.createPlaylist = function(listName, track) {
  return this.call('createPlaylist', gs.user.userId, listName, track);
};

apis.addSongToPlaylist = function(listNames, songId, tags, listTypes) {
  return this.call('addSongToPlaylist', gs.user.userId, listNames, songId, tags, listTypes);
};

apis.addBatchSongsToPlaylist = function(songs, listName, listType) {
  return this.call('addBatchSongsToPlaylist', gs.user.userId, songs, listName, listType);
};

apis.removeSongFromPlaylist = function(songId, listName) {
  return this.call('removeSongFromPlaylist', {
    userId: gs.user.userId,
    playlistSongId: songId,
    listName,
  });
};

apis.getRecentListens = function(data) {
  return this.call('getRecentListens', data);
};

apis.reorderPlaylist = function(orderList, listName) {
  return this.call('reorderPlaylist', orderList, listName, gs.user.userId);
};

apis.reorderPlaylistList = function(orderList) {
  return this.call('reorderPlaylistList', orderList, gs.user.userId);
};

apis.getLivePlaylist = function() {
  return this.call('getLivePlaylist');
};

apis.registerAction = function(actionName, data) {
  if (!g.isEmpty(gs.user.userId)) {
    data.userId = gs.user.userId;
  }
  return this.call('registerAction', gs.user.userId, actionName, data);
};

apis.registerSongAction = function(song, action) {
  const dt = {
    type: song.type,
    songId: song._id,
    platform: 'youtube',
  };
  return this.registerAction(action, dt);
};

apis.nameDevice = function(name) {
  return this.call('nameDevice', gs.user.userId, name);
};

apis.createLiveStation = function(name) {
  return this.call('createLiveStation', name);
};

apis.createVODStation = function(name) {
  return this.call('createVODStation', name);
};

apis.getAllStreams = function() {
  return this.call('getAllStreams');
};

apis.startStream = function(type, name) {
  name;
  return this.call('startStream', type, gs.user.handle, gs.user.userId);
};

apis.endStream = function(type, name) {
  name;
  return this.call('endStream', type, gs.user.handle);
};

apis.getUserChats = function() {
  return this.call('getUserChats', gs.user.userId);
};

apis.saveListen = function(songObject) {
  const params = {
    userId: gs.user.userId,
    songObject,
  };
  if (!g.isEmpty(gs.user.userId)) {
    params.userId = gs.user.userId;
  }
  return this.call('saveListen', params);
};

apis.isSongInPlaylist = function(songId, list) {
  const params = {
    songId,
    playlistName: list,
    userId: gs.user.userId,
  };
  return this.call('isSongInPlaylist', params);
};

apis.inviteContact = function(name, mobile, email) {
  return this.call('inviteContact', {
    sendPrivateCode: true,
    userId: gs.user.userId,
    template: 'standard',
    name: [name],
    emails: [email],
    phones: [mobile],
    platform: sizes.is_ios ? 'ios' : 'android',
  });
};

apis.findUserByNumberOrEmail = function(number, email) {
  return this.call('findUserByNumberOrEmail', { number, email });
};

const userinfo = () => ({
  _id: gs.user.userId,
  username: gs.user.username,
});

apis.likePicture = function(entityId) {
  return this.call('like', {
    userId: gs.user.userId,
    user: userinfo(),
    entityId,
    entityCollection: 'Songs',
    entity: {},
    isActive: true,
  });
};
apis.unlikePicture = function(entityId) {
  return this.call('unlike', {
    entityId,
    entityCollection: 'Songs',
    entity: {},
    userId: gs.user.userId,
  });
};
apis.getPictureLikes = function(entityId) {
  return this.call('getAppitryLikes', {
    entityId,
    entityCollection: 'Songs',
  });
};

apis.followArtist = function(entityId) {
  return this.call('follow', {
    userId: gs.user.userId,
    user: userinfo(),
    entityId,
    entityCollection: 'Artists',
    entity: {},
    isActive: true,
  });
};

apis.unfollowArtist = function(entityId) {
  return this.call('unfollow', {
    entityId,
    entityCollection: 'Artists',
    entity: {},
    userId: gs.user.userId,
  });
};

apis.getArtistFollowers = function(entityId) {
  return this.call('getAppitryFollowers', {
    entityId,
    entityCollection: 'Artists',
  });
};

apis.getPictureComments = function(entityId) {
  return this.call('getAppitryComments', {
    entityId,
    entityCollection: 'Songs',
  });
};
apis.leavePictureComment = function(entityId, comment) {
  return this.call('leaveComment', {
    userId: gs.user.userId,
    user: userinfo(),
    entityId,
    entityCollection: 'Songs',
    entity: {},
    parentCommentId: null,
    comment,
    isActive: true,
  });
};
apis.editPictureComment = function(commentId, comment) {
  return this.call('editComment', {
    commentId,
    comment,
    userId: gs.user.userId,
  });
};
apis.deletePictureComment = function(commentId) {
  return this.call('deleteComment', {
    commentId,
    userId: gs.user.userId,
  });
};

apis.uploadUserFile = async function(tag, id, file) {
  const ext = g.getFileExt(file);
  const key = `${tag}_${Random.id()}_${id}.${ext}`;

  await this.uploadFile(key, file);
  return g.getS3Url(key);
};

apis.updateSongThumb = function(id, file) {
  return this.uploadUserFile('song', id, file);
};
apis.uploadLiveVideo = function(file) {
  return this.uploadUserFile('live', gs.user.userId, file);
};
apis.uploadSongImage = function(id, file) {
  return this.uploadUserFile('song_gallery', id, file);
};
apis.uploadArtistImage = function(id, file) {
  return this.uploadUserFile('artist_gallery', id, file);
};

apis.getUserProfiles = function(userId) {
  return this.call('getUserProfiles', userId);
};

apis.addImageToSong = function(songId, url) {
  return this.call('addImageToSong', { songId, url });
};
apis.addImageToArtist = function(artistId, url) {
  return this.call('addImageToArtist', { artistId, url });
};

apis.getAlbums = function() {
  return this.call('getAlbums');
};

apis.getTags = function() {
  return this.call('getTags');
};

apis.getTopTags = function() {
  return this.call('getTopTags');
};

apis.getVideos = function(tag) {
  return this.call('getVideos', { tag });
};

apis.getChannels = function(tag) {
  return this.call('getChannels', {});
};

export default apis;