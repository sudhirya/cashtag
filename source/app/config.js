// If you're running on a device or in the Android simulator be sure to change
let METEOR_URL = 'wss://api-pre.chilll.in/websocket';
// let METEOR_URL = 'ws://localhost:3010/websocket';
if (process.env.NODE_ENV === 'production') {
  METEOR_URL = 'wss://api-pre.chilll.in/websocket'; // your production server url
}

export const settings = {
  env: process.env.NODE_ENV,
  meteor: {
    url: METEOR_URL,
  },

  wowza: {
    hostAddress: '54.183.21.92',
    applicationName: 'live',
    username: 'wowza',
    password: 'i-0f02b9a7cb5fc37b2',
    streamName: 'myStream',
    port: 1935,
    sdkLicenseKey: 'GOSK-C745-010C-E773-D504-8C8B',
  },

  spotify: {
    useAppAuth: true,
    clientID: 'e10ea8de32094eb0ab5573a8300badfb',
    sessionUserDefaultsKey: 'SpotifySession',
    redirectURL: 'com.chilll.zyon://callback',
    scopes: ['user-read-private', 'playlist-read', 'playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'streaming'],
  },

  s3: {
    bucket: 'chilll-media',
  },
};

export default settings;