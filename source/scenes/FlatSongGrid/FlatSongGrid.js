import React from 'react';
import { shallowEqual } from '@redux';
import renderMixin from './FlatSongGrid.render';
import methodMixin from './FlatSongGrid.method';
import {createContainer} from "react-native-meteor";
import meteor from '@lib/meteor';
import {connect} from "react-redux";

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

const FlatSongGrid = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  sizeFlag: state.main.sizeFlag,
  viewType: state.main.view.type,
  songs: state.main.view.songs
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

// const FlatSongGridMeteor = createContainer(() => {
//   const { songs } = meteor.recentListens();
//   return {
//     songs,
//   };
// }, FlatSongGrid);

export default connect(mapStateToProps, mapDispatchToProps)(FlatSongGrid);
