import Contacts from 'react-native-contacts';
import { handler } from '@redux';
// import { routes } from '@routes';
import g from '@common/global';
import _ from 'lodash';
import moment from 'moment';
import Mixpanel from 'react-native-mixpanel';
import apis from '@lib/apis';
// import { ViewType } from './types';

// const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    showGuidePopup = () => {
      this.handles.guidePopup && this.handles.guidePopup.show();
    }

    showSongPopup = (song) => {
      this.handles.songPopup && this.handles.songPopup.show(song);
    }

    closeLoadFlow = () => {
      this.handles.loadNav && this.handles.loadNav.hide(() => {
        this.onClosedLoadFlow();
      });
    }
    onClosedLoadFlow = () => {
      handler.main.loadFlow.change(false);

      const mcur = moment();
      const mlast = moment(this.lastRun);

      // this.lastRun = null;
      if (!this.lastRun || mcur.format('MM/DD/YYYY') !== mlast.format('MM/DD/YYYY')) {
        this.setAppRunOnce();
        this.setLastRun();

        // this.showGuidePopup();
      }
    }

    loadMoreSongs = () => {
      if (!this.songData.main) return;
      this.loadSongs();
    }

    prevSong = () => {
      if (this.player.shuffle) {
        this.shuffleSong();
      } else {
        this.loadSongAt(this.player.index - 1);
      }
      Mixpanel.track('Prev song');
    }

    nextSong = (action) => {
      apis.registerSongAction(this.player.song, action);

      if (this.player.shuffle) {
        this.shuffleSong();
      } else {
        this.loadSongAt(this.player.index + 1);
      }
      Mixpanel.track('Next song');
    }

    shuffleSong = () => {
      var { index } = this.player;
      while (this.songData.songs.length > 1 && index === this.player.index) {
        index = Math.floor(Math.random() * this.songData.songs.length);
      }
      handler.loadSongAt(index);
    }

    togglePlay = () => {
      this.player.playing = !this.player.playing;
      handler.main.update.button();
      this.updateNowPlaying();
      if (this.player.playing) {
        Mixpanel.track('Play song');
      }
    }

    playSong = () => {
      if (this.player.playing) return;

      this.player.playing = true;
      this.updateNowPlaying();
      handler.main.update.button();
      Mixpanel.track('Play song');
    }
    pauseSong = () => {
      if (!this.player.playing) return;

      this.player.playing = false;
      this.updateNowPlaying();
      handler.main.update.button();
    }

    seekPlayer = (time) => {
      if (this.player.loading) return;

      this.player.currentTime = time;
      this.context.videoPlayer && this.context.videoPlayer.seek(time);
    }
    updatePlayTime = (time) => {
      this.player.currentTime = time;
      this.context.progress1 && this.context.progress1.updateTime(this.player.duration, this.player.currentTime);
      this.context.progress2 && this.context.progress2.updateTime(this.player.duration, this.player.currentTime);
      this.context.progress3 && this.context.progress3.updateTime(this.player.duration, this.player.currentTime);
    }

    toggleLiveVideo = () => {
      if (!this.player.streamLiveVideo) {
        this.startLiveVideo();
      } else {
        this.stopLiveVideo();
      }
    }

    toggleLiveAudio = () => {
      if (!this.player.streamLiveAudio) {
        this.startLiveAudio();
      } else {
        this.stopLiveAudio();
      }
    }

    addSongToSearch = (song) => {
      this.addSongToPlaylist(song, '#SEARCH');
    }
    addSongToLive = (song) => {
      this.addSongToPlaylist(song, '#LIVE');
    }
    addRemoveSongOnDisco = async (song) => {
      this.addRemoveSongOnPlaylist(song, '#SHARED');
    }
    addRemoveSongOnFuego = (song) => {
      this.addRemoveSongOnPlaylist(song, '#FIRE');
    }
    addRemoveSongOnStream = (song) => {
      this.addRemoveSongOnPlaylist(song, '#STREAM');
    }
    addRemoveSongOnPlaylist = (song, playlist) => {
      if (!song || song.isLive) return;
      const isExist = song.checkPlaylist(playlist);
      if (isExist) {
        this.removeSongFromPlaylist(song, playlist);
      } else {
        this.addSongToPlaylist(song, playlist);
      }
    }

    getContacts = () => new Promise((resolve, reject) => {
      Contacts.getAll((err, contacts) => {
        if (err) {
          reject(err);
          return;
        }

        const users = [];
        let idx = 0;

        contacts.forEach((contact) => {
          const mobiles = contact.phoneNumbers && contact.phoneNumbers.length ? contact.phoneNumbers : [];
          const emails = contact.emailAddresses && contact.emailAddresses.length ? contact.emailAddresses : [];

          const mobile = mobiles && mobiles[0] && mobiles[0].number;
          const email = emails && emails[0] && emails[0].email;
          const mobileEscapes = mobiles.map(m => m.number.replace(/[^\d]/g, ''));
          if (mobile || email) {
            idx += 1;
            users.push({
              userId: `_contact_${idx}`,
              isContact: true,
              fullName: `${contact.givenName} ${contact.familyName}`,
              avatar: contact.thumbnailPath,
              firstName: contact.givenName,
              lastName: contact.familyName,
              mobile, email, mobileEscapes,
              mobiles: _.map(mobiles, m => m.number),
              emails: _.map(emails, m => m.email),
            });
          }
        });
        resolve(users);
      });
    })
  };
}

export default methodMixin;
