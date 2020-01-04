import React from 'react';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
// import { sizes, bs } from '@theme';
import { extendStyle } from './utils';
import { getTheme } from './theme';

export default ({
  theme, name, style, ...otherProps
}) => {
  let Component = UIActivityIndicator;
  const styles = getTheme(theme);
  const comps = [
    { name: 'ball', comp: BallIndicator },
    { name: 'bar', comp: BarIndicator },
    { name: 'dot', comp: DotIndicator },
    { name: 'material', comp: MaterialIndicator },
    { name: 'pacman', comp: PacmanIndicator },
    { name: 'pulse', comp: PulseIndicator },
    { name: 'skype', comp: SkypeIndicator },
    { name: 'wave', comp: WaveIndicator },
  ];
  for (let i = 0; i < comps.length; i += 1) {
    if (name === comps[i].name) {
      Component = comps[i].comp;
      break;
    }
  }

  const newstyle = [styles.style('indicator')];
  extendStyle(newstyle, style);

  return (
    <Component
      style={newstyle}
      {...otherProps}
    />
  );
};
