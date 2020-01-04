import { NativeEventEmitter, NativeModules } from 'react-native';
import ApplePlayer from './player';

const RNAppleMusic = NativeModules.RNAppleMusic;
const RNAppleMusicEmitter = new NativeEventEmitter(RNAppleMusic);

class AppleMusic {
  on(event, handler) {
    RNAppleMusicEmitter.addListener(event, handler);
  }
  un(event, handler) {
    RNAppleMusicEmitter.removeListener(event, handler);
  }

  authorize() {
    return RNAppleMusic.authorize();
	}
  userToken() {
    return RNAppleMusic.userToken();
  }
  storefrontCountryCode() {
    return RNAppleMusic.storefrontCountryCode();
  }
  createChilllPlaylist() {
    return RNAppleMusic.createChilllPlaylist();
  }
  requestChilllSongs() {
    return RNAppleMusic.requestChilllSongs();
  }
  requestChilllPlaylists() {
    return RNAppleMusic.requestChilllPlaylists();
  }
  requestPlaylists(incSong) {
    return RNAppleMusic.requestPlaylists(incSong);
  }
  loadSong(storeId) {
    RNAppleMusic.loadSong(storeId);
  }
  play() {
    RNAppleMusic.play();
  }
  pause() {
    RNAppleMusic.pause();
  }
  togglePlay() {
    RNAppleMusic.togglePlay();
  }
  seek(offset) {
    RNAppleMusic.seek(offset);
  }
  setRate(rate) {
    RNAppleMusic.setRate(rate);
  }
  currentTime() {
    return new Promise((resolve) => {
      RNAppleMusic.currentTime((time) => {
        resolve(time);
      });
    });
  }
  duration() {
    return new Promise((resolve) => {
      RNAppleMusic.duration((dur) => {
        resolve(dur);
      });
    });
  }
  playbackState() {
    return new Promise((resolve) => {
      RNAppleMusic.playbackState((state) => {
        resolve(state);
      });
    });
  }
}

export default (new AppleMusic());

export { ApplePlayer };
