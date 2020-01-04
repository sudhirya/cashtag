import React from 'react';
import { shallowEqual } from '@redux';
import renderMixin from './SongGrid.render';
import methodMixin from './SongGrid.method';

var compIndex = 0;

class Component extends React.Component {
  constructor(props) {
    super(props);

    compIndex += 1;
    this.compIndex = compIndex;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

export default renderMixin(methodMixin(Component));
