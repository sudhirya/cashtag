import { NativeEventEmitter, NativeModules } from 'react-native';
import { getStore } from '@app/storevar';
import { actions } from '@redux';

const NativeAppBridge = NativeModules.AppBridge;
const nowPlayingEmitter = new NativeEventEmitter(NativeAppBridge);

export function setNowPlaying(playing, thumb, title, artist) {
  if (NativeAppBridge.setNowPlaying) {
    NativeAppBridge.setNowPlaying(playing, thumb, title, artist);
  }
}

nowPlayingEmitter.addListener('onRemotePlayEvent', (event) => {
  const store = getStore();

  if (event.type === 'play') {
    store.dispatch(actions.player.play());
  } else if (event.type === 'pause') {
    store.dispatch(actions.player.pause());
  } else if (event.type === 'toggle') {
    store.dispatch(actions.player.toggle());
  } else if (event.type === 'next') {
    actions.player.nextSong();
  } else if (event.type === 'prev') {
    // actions.player.prevSong();
  }
});

export function setAppFullscreen(fullscreen) {
  if (NativeAppBridge.setFullscreen) {
    NativeAppBridge.setFullscreen(fullscreen);
  }
}

export function getMusicToken() {
  return new Promise((resolve, reject) => {
    NativeAppBridge.getMusicToken((token, error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(token);
    });
  });
}

export function startNormalPlaying() {
  return new Promise((resolve) => {
    NativeAppBridge.startNormalPlaying(() => {
      resolve();
    });
  });
}

export function startOtherPlaying() {
  return new Promise((resolve) => {
    NativeAppBridge.startOtherPlaying(() => {
      resolve();
    });
  });
}
