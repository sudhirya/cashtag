/* eslint import/first: "off" */

import { AppRegistry, YellowBox } from 'react-native';

console.ignoredYellowBox = [
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
];
YellowBox.ignoreWarnings([
  'Module RNFetchBlob requires main queue setup',
  'Module RNReactNativeSharingWinstagram requires main queue setup',
  'Module RCTCardIOUtilities requires main queue setup',
  'Required dispatch_sync to load constants for',
  'RCTBridge required dispatch_sync to load',
  'createContainer is deprecated',
  'Task orphaned for request',
]);

import App from './source';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
