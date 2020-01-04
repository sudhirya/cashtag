import React from 'react';
import { connect } from 'react-redux';
import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
import meteor from '@lib/meteor';
import renderMixin from './Wallet.render';
import methodMixin from './Wallet.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const WalletMixin = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  status: state.meteor.status,
  sizeFlag: state.main.sizeFlag,
  userFlag: state.main.userFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});
const Wallet = createContainer(() => {
  const userData = meteor.userProfile() || {};
  return {
    userData,
  };
}, WalletMixin);
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
