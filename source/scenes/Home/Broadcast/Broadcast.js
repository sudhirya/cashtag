import React from 'react';
import { connect } from 'react-redux';
import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
import meteor from '@lib/meteor';
import renderMixin from './Broadcast.render';
import methodMixin from './Broadcast.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Broadcast = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  viewType: state.main.view.type,
  buttonFlag: state.main.buttonFlag,
  playerFlag: state.main.playerFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

const BroadcastMeteor = createContainer(() => {
  const user = meteor.userProfile();

  return {
    user,
  };
}, Broadcast);

export default connect(mapStateToProps, mapDispatchToProps)(BroadcastMeteor);
