import MDUser from '@model/user';
import methodMixin from './states.method';
import method1Mixin from './states.method.api';
import method2Mixin from './states.method.ui';
// import { ViewType, SearchType } from './types';

class AppStatesBase {
  inited = false;
  runOnce = false;
  lastRun = null;
  deviceId = null;
  panMovable = true;
  playlists = [];
  playlistsMap = {};
  locallist = [];

  user = new MDUser();

  chatServer = {
    _id: '20171125',
    current: true,
    lastSubscription: null,
  }
  chat = { // chat contexts
    chatWith: null, // realm user object
    chatMe: null, // realm my object
    user: null, // flute user
    rid: null, // room id
  }

  context = {
    listPos: 0, // song list scroll pos

    song: null, // chat song

    playlistCb: null, // callback when called playlist updated

    // views
    videoPlayer: null,
    streamPlayer: null,
    progress1: null,
    progress2: null,
    progress3: null,
  }

  player = {
    playing: false,
    loading: false,
    repeat: false,
    shuffle: false,
    sliding: false,
    fullscreen: false,
    fullani: false,
    currentTime: 0,
    duration: 0,
    index: -1,
    song: null,
    streamPlayer: null,
    videoPlayer: null,
    streamLiveAudio: false,
    streamLiveVideo: false,
    chilltv: false,
  }

  songData = {
    songs: [],
    limit: 30,
    total: 0,
    loading: false,
    tags: null,
    main: true,
  }

  handles = {
    mainView: null,
    loadNav: null,
    linkPopup: null,
    songPopup: null,
    guidePopup: null,
    songCardPopup: null,
    artistCardPopup: null,
  }
}

const AppStates = method2Mixin(method1Mixin(methodMixin(AppStatesBase)));
export default new AppStates();
