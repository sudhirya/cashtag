import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Player.render';
import methodMixin from './Player.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Player = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  viewType: state.main.view.type,
  sizeFlag: state.main.sizeFlag,
  playerFlag: state.main.playerFlag,
  buttonFlag: state.main.buttonFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
