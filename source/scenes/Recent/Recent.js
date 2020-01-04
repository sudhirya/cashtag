import React from 'react';
import { connect } from 'react-redux';
import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
import meteor from '@lib/meteor';
import renderMixin from './Recent.render.new';
import methodMixin from './Recent.method.new';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Playlist = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  sizeFlag: state.main.sizeFlag,
  viewType: state.main.view.type,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

// const PlaylistMeteor = createContainer(() => {
//   const { songs } = meteor.recentListens();
//
//   return {
//     songs,
//   };
// }, Playlist);

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
