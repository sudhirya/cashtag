import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Profile.render';
import methodMixin from './Profile.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Profile = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  view: state.main.view,
  sizeFlag: state.main.sizeFlag,
  playerFlag: state.main.playerFlag,
  buttonFlag: state.main.buttonFlag,
  viewType: state.main.view.type
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
