import Realm from '@model/realm';
import apis from '@lib/apis';
import { handler } from '@redux';
import setupSong from '@model/song';
import youtube from '@components/youtube';
import AppleMusic from '@components/applemusic';
import Spotify from '@components/spotify';
import AppConfig from '@app/config';
import {
  setNowPlaying,
  startNormalPlaying,
  startOtherPlaying,
} from '@components/appbridge';
import g from '@common/global';
import c from '@common/consts';
import _ from 'lodash';
import Mixpanel from 'react-native-mixpanel';

const { drop, hud } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    resetSongs = () => {
      this.player.index = -1;
      this.player.playing = false;
      this.player.song = null;

      this.songData.songs = [];
      this.songData.total = 0;
    }

    loadSongs = async (categories) => {
      const count = this.songData.songs.length;

      // while loading, do not load again. if loaded all, do not load too
      if (this.songData.loading || (this.songData.total && count >= this.songData.total)) return;

      this.songData.loading = true;
      handler.main.update.list();

      try {
        // let's request tags first if not exist
        if (!this.songData.tags) {
          this.songData.tags = await apis.getSearchTags();
        }

        // request songs
        if (categories && categories.length > 0) var res = await apis.getPlaylist(categories, this.songData.limit, count);
        else var res = await apis.getPlaylist(this.songData.tags, this.songData.limit, count);
        const recvSongs = setupSong(res.results);
        const songs = this.songData.songs.concat(recvSongs);
        this.songData.total = res.count;
        this.songData.songs = songs;
        this.songData.loading = false;

        if (!this.player.song && songs.length > 0) {
          this.loadSong(songs[0], 0);
        }
      } catch (e) {
        console.log('loadSongs failed: ', e);
      }

      this.songData.loading = false;
      handler.main.update.list();
    }

    loadPlaylistSongs = (songs, initSong) => {
      this.songData.total = songs.count;
      this.songData.songs = songs;
      this.songData.loading = false;
      this.songData.main = false;

      if (initSong) {
        this.loadSong(initSong);
      }
      handler.main.update.list();
    }

    loadPlaylist = async (name, initSong, completed) => {
      try {
        const res = await apis.getPlaylistByName(name);

        let orderedList = res.results.sort((song1, song2) => {
          const order1 = song1.order ? song1.order : 0;
          const order2 = song2.order ? song2.order : 0;
          return order1 - order2;
        });
        orderedList = _.map(orderedList, info => info.songObject);
        const songs = setupSong(orderedList);

        if (!initSong && songs.length) {
          ({ initSong } = songs);
        }

        this.loadPlaylistSongs(songs, initSong);
        completed && completed();
      } catch (e) { e; }
    }

    updateNowPlaying = () => {
      if (!this.player.song) return;
      if (this.player.song.isApple) return;
      if (this.player.song.isSpotify) return;

      setNowPlaying(
        this.player.playing && !this.player.loading,
        this.player.song.thumbImage, this.player.song.title, this.player.song.artist,
      );
    }

    loadSong = async (song, index, tv) => {
      if (g.isNull(index)) {
        index = _.find(this.songData.songs, s => s._id && s._id === song._id) > 0;
        if (index === -1) {
          ({ index } = this.player);
        }
      }

      const loading = song._id !== g.deepValue(this.player, 'song._id');
      this.player.song = song;
      this.player.index = index === 0 ? 0 : (index || this.player.index);
      this.player.loading = loading;
      this.player.duration = 0;
      this.player.currentTime = 0;
      this.player.chilltv = tv || false;

      if (song.isApple || song.isSpotify) {
        await startOtherPlaying();
      } else {
        await startNormalPlaying();
      }

      if (song.isApple) {
        song.authorized = false;
        AppleMusic.authorize().then(async () => {
          // await AppleMusic.userToken();
          song.authorized = true;
          handler.main.update.player();
        }).catch((ex) => {
          console.log('states::loadSong failed: ', ex);
        });
      } else if (song.isSpotify) {
        song.authorized = false;
        Spotify.authorize(AppConfig.spotify).then(() => {
          song.authorized = true;
          handler.main.update.player();
        }).catch((ex) => {
          console.log('states::loadSong failed: ', ex);
          drop.showError('Spotify', 'In order to use the album feature, you must first be logged into Spotify Premium. Visit the card section in this app to login to Spotify.');
        });
      } else if (song.isYoutube && !youtube.isMapped(song.song_key)) {
        youtube.getYoutubeUrl(song.youtubeId, song.song_key).then(() => {
          handler.main.update.player();
        }).catch((ex) => {
          console.log('states::loadSong failed: ', ex);
        });
      }

      console.log('load song: ', song);
      apis.registerSongAction(song, 'Play');
      this.requestSongIn(song, false);
      handler.main.update.player();
      Mixpanel.trackWithProperties('Load Song', { title: song.title });
    }
    loadSongAt = (index) => {
      if (index === null || index === undefined || index < 0 || index >= this.songData.songs.length) {
        this.pauseSong();
        return;
      }
      this.loadSong(this.songData.songs[index], index);
    }

    requestSongIn = (song, force) => {
      if (force || !song.playlist) {
        apis.isSongInPlaylist(song._id, ['#FIRE', '#SHARED', '#STREAM']).then((res) => {
          song.playlist = res || [];
          handler.main.update.button();
        }).catch(() => {});
      }
    }

    requestPlaylists = async () => {
      try {
        const res = await apis.getDevicePlaylistNames();
        const lists = res.lists || {};
        const names = _.filter(res.results || [], name => !g.isEmpty(lists[name]));
        const playlists = {};
        this.playlists = _.map(names, (name) => {
          const songs = lists[name].sort((song1, song2) => {
            const order1 = song1.order ? song1.order : 0;
            const order2 = song2.order ? song2.order : 0;
            return order1 - order2;
          });
          const songs2 = _.map(songs, song => song.songObject);
          playlists[name] = setupSong(songs2);

          return {
            name,
            count: songs.length,
            type: songs[0].type,
            isAlsoStream: songs[0].isAlsoStream || undefined
          };
        });
        this.playlistsMap = playlists;
        handler.main.update.playlist();
        return playlists;
      } catch (ex) {
        console.log('states::requestPlaylists failed: ', ex);
      }
      return [];
    }
    addSongToPlaylist = async (song, playlist, cb) => {
      this.addSongToPlaylists(song, [playlist], cb);
    }
    addSongToPlaylists = async (song, playlists, cb) => {
      if (!song || song.isLive) {
        cb && cb();
        return;
      }

      hud.show('Requesting...');
      try {
        await apis.addSongToPlaylist(playlists, song._id, '', ['chilll']);

        if (playlists[0] === '#FIRE') {
          apis.registerSongAction(song, 'Fire');
        } else if (playlists[0] === '#SHARED') {
          apis.registerSongAction(song, 'Discover');
        } else if (playlists[0] === '#SEARCH') {
          apis.registerSongAction(song, 'Search');
        } else if (playlists[0] === '#STREAM') {
          apis.registerSongAction(song, 'Stream');
        }

        this.requestSongIn(song, true);

        if (this.playlists) {
          playlists = _.map(playlists, name => ({ type: 'chilll', name }));
          playlists = this.playlists.concat(playlists);
          this.playlists = playlists.filter((v, idx, self) => _.findIndex(self, a => a.name === v.name) === idx);
        }

        cb && cb();
      } catch (ex) {
        console.log('states::addSongToPlaylist failed: ', ex);
        drop.showError('Add Song', 'Failed to add song.');
      }
      hud.hide();
    }
    removeSongFromPlaylist = async (song, playlist, cb) => {
      if (!song || song.isLive) {
        cb && cb();
        return;
      }

      hud.show('Requesting...');
      try {
        await apis.removeSongFromPlaylist(song._id, playlist);
        apis.registerSongAction(song, 'Remove')
        this.requestSongIn(song, true);
        this.playlists = [];

        cb && cb();
      } catch (ex) {
        console.log('states::removeSongFromPlaylist failed: ', ex);
        drop.showError('Remove Song', 'Failed to remove song.');
      }
      hud.hide();
    }

    goLive = () => {
      apis.registerAction('Go Live', { type: 'audio' });
    }

    startStream = (type) => {
      hud.show('Starting...');
      apis.startStream(type).then(() => {
        hud.hide();
        if (type === 'live video') {
          this.player.streamLiveVideo = true;
        } else {
          this.player.streamLiveAudio = true;
        }
        handler.main.update.button();
      }).catch(() => {
        hud.hide();
        drop.showError(c.appName, 'Failed to start stream');
      });
    }
    endStream = (type) => {
      hud.show('Ending...');
      apis.endStream(type).then(() => {
        hud.hide();
        if (type === 'live video') {
          this.player.streamLiveVideo = false;
        } else {
          this.player.streamLiveAudio = false;
        }
        handler.main.update.button();
      }).catch(() => {
        hud.hide();
        drop.showError(c.appName, 'Failed to stop stream');
      });
    }

    startLiveVideo = async () => {
      this.startStream('live video');
    }
    stopLiveVideo = () => {
      this.endStream('live video');
    }

    startLiveAudio = () => {
      this.startStream('live audio');
    }
    stopLiveAudio = () => {
      this.endStream('live audio');
    }

    saveSearchSong = (info, cb) => {
      if (info.isLive || info._id) {
        cb && cb();
        return;
      }

      apis.saveSong(info.songInfo).then((res) => {
        info._id = res;
        info.songInfo._id = res;

        if (info.isVideo) {
          apis.addVideoObject(this.user.userId, info.songInfo);
        } else {
          apis.addSongObject(this.user.userId, info.songInfo);
        }

        cb && cb();
      }).catch((err) => {
        drop.showError(c.appName, 'Failed to save song');
        cb(err || (new Error('Failed to save song')));
      });
    }

    saveListen = (song) => {
      if (!song || !song.songInfo || song.addedListen) return;
      song.addedListen = true;
      apis.saveListen(song.songInfo).then(() => {}).catch(() => {});
    }

    initChat = async () => {
      if (!this.user.loggedIn) return;

      await Realm.chat.addServer(this.chatServer);
      await Realm.chat.addLoginUser();
    }

    loadSubscriptions = async () => {
      try {
        const date = new Date();
        let subscriptions = await apis.getSubscriptions();
        subscriptions = subscriptions.filter(el => el.open);
        this.setLastSubscription(date);

        if (subscriptions.length) {
          Realm.chat.addSubscriptions(subscriptions, false);
        }
        if (subscriptions.update) {
          Realm.chat.addSubscriptions(subscriptions.update, false);
        }
      } catch (e) {
        e;
      }
    }

    setupChat = async (rid, userWebOrChat) => {
      let chatWith = null;
      if (userWebOrChat.userId) {
        await Realm.chat.addWebUser(userWebOrChat);
        chatWith = Realm.chat.findUser(userWebOrChat.userId);
      } else {
        chatWith = Realm.chat.findUser(userWebOrChat._id);
      }

      if (!chatWith || !chatWith._id) {
        throw new Error('Failed to add chat user');
      }
      const chatMe = Realm.chat.findUser(this.user.userId);
      if (!chatMe || !chatMe._id) {
        throw new Error('Failed to find login user');
      }

      // const room = await apis.createDirectMessage(chatWith.username);
      if (!rid || !rid.length) {
        let subscription = Realm.chat.findSubscriptionByUser(chatWith._id);
        if (!subscription) {
          await this.loadSubscriptions();
          subscription = Realm.chat.findSubscriptionByUser(chatWith._id);
        }
        if (subscription) {
          rid = subscription.rid;
        } else {
          const room = await apis.createPrivateChatRoom(chatWith._id);
          rid = room.rid;
        }
      }
      if (!rid || !rid.length) throw new Error('Failed to create room');

      Realm.chat.deleteMessages(rid);

      // const room = await apis.createDirectMessage(chatWith.username);
      const needLoop = true;
      let endDate = null;
      while (needLoop) { // eslint-disable-line
        const history = await apis.loadHistory(rid, endDate, 100 /* , lastMessage && lastMessage._updatedAt */ ); // eslint-disable-line
        if (!history || !history.messages || !history.messages.length) break;

        _.each(history.messages, (msg) => {
          Realm.chat.addMessage(msg);
        });
        endDate = history.messages[history.messages.length - 1].ts;

        // if (!history.unreadNotLoaded) break;
      }

      // await apis.joinRoom(rid);
      try {
        await apis.readMessages(rid);
      } catch (e) { e; }

      this.chat.rid = rid;
      this.chat.chatWith = chatWith;
      this.chat.chatMe = chatMe;

      // console.log('setup chat: ', this.chat);
    }
  };
}

export default methodMixin;