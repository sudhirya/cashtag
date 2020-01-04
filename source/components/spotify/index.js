import { NativeEventEmitter, NativeModules } from 'react-native';
import SpotifyPlayer from './player';

// const RNSpotify = NativeModules.RNSpotify;
// const RNSpotifyEmitter = new NativeEventEmitter(RNSpotify);

class Spotify {
  // on(event, handler) {
  //   RNSpotifyEmitter.addListener(event, handler);
  // }
  // un(event, handler) {
  //   RNSpotifyEmitter.removeListener(event, handler);
  // }

  // authorize(options) {
  //   return RNSpotify.authorize(options);
	// }
  // createChilllPlaylist() {
  //   return RNSpotify.createChilllPlaylist();
  // }
  // requestChilllSongs() {
  //   return RNSpotify.requestChilllSongs();
  // }
  // requestChilllPlaylists() {
  //   return RNSpotify.requestChilllPlaylists();
  // }
  // requestPlaylists(incSong) {
  //   return RNSpotify.requestPlaylists(incSong);
  // }
}

export default (new Spotify());

export { SpotifyPlayer };
